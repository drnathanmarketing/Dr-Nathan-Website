// src/pages/api/credentials-lead.ts
// Lead gate for /credentials — validates, de-duplicates against HubSpot,
// submits new leads, and issues the signed access cookie.
// Serverless endpoint — NOT pre-rendered.
export const prerender = false;

import type { APIRoute } from "astro";
import dns from "node:dns/promises";
import { validateLead, splitName, emailDomain, phoneVariants } from "src/utils/leadValidation";
import { GATE_COOKIE, signGateToken, GATE_MAX_AGE } from "src/utils/gateToken";

/* ─── config ──────────────────────────────────────────────────────────────── */

const PORTAL_ID = import.meta.env.HUBSPOT_PORTAL_ID;
const FORM_GUID = import.meta.env.HUBSPOT_FORM_GUID;
const HS_TOKEN = import.meta.env.HUBSPOT_PRIVATE_APP_TOKEN;

/**
 * HubSpot data region. This account is on `ap1` (Sydney), which uses different
 * API hosts than the documented defaults. The region is encoded in the private
 * app token (`pat-<region>-…`); HUBSPOT_REGION can override it.
 */
function hubspotRegion(): string | null {
  const explicit = import.meta.env.HUBSPOT_REGION;
  if (explicit) return explicit;
  const m = /^pat-([a-z0-9]+)-/i.exec(HS_TOKEN ?? "");
  return m ? m[1].toLowerCase() : null;
}

/** Regional host first, global host as the fallback (see fetchWithFallback). */
function crmHosts(): string[] {
  const r = hubspotRegion();
  return r && r !== "na1"
    ? [`https://api-${r}.hubapi.com`, "https://api.hubapi.com"]
    : ["https://api.hubapi.com"];
}
function formsHosts(): string[] {
  const r = hubspotRegion();
  return r && r !== "na1"
    ? [`https://api-${r}.hsforms.com`, "https://api.hsforms.com"]
    : ["https://api.hsforms.com"];
}

/**
 * Try each host in turn. Only a transport failure or a 404 (wrong region host)
 * advances to the next candidate — a 4xx from the right host is a real answer.
 */
async function fetchWithFallback(
  hosts: string[],
  path: string,
  init: RequestInit
): Promise<{ res: Response; host: string }> {
  let lastErr: unknown;
  for (const host of hosts) {
    try {
      const res = await fetch(`${host}${path}`, init);
      if (res.status === 404 && host !== hosts[hosts.length - 1]) continue;
      return { res, host };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("All HubSpot hosts failed");
}

/* ─── rate limiting (per serverless instance, mirrors api/apply.ts) ───────── */

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/* ─── email deliverability ───────────────────────────────────────────────── */

const mxCache = new Map<string, boolean>();

/** Reject domains that can't receive mail at all (catches typo'd/fake domains). */
async function domainAcceptsMail(domain: string): Promise<boolean> {
  const cached = mxCache.get(domain);
  if (cached !== undefined) return cached;
  let ok = true;
  try {
    const records = await dns.resolveMx(domain);
    ok = Array.isArray(records) && records.length > 0;
  } catch {
    try {
      // Some domains accept mail on an A record with no MX.
      await dns.resolve4(domain);
      ok = true;
    } catch {
      ok = false;
    }
  }
  mxCache.set(domain, ok);
  return ok;
}

/* ─── HubSpot ────────────────────────────────────────────────────────────── */

/** True when a contact with this email or phone already exists. */
async function contactExists(email: string, phone: string): Promise<boolean> {
  if (!HS_TOKEN) return false;

  /** filterGroups are OR'd together; filters inside a group are AND'd. */
  const search = async (filterGroups: unknown[], describe: string) => {
    const { res } = await fetchWithFallback(crmHosts(), "/crm/v3/objects/contacts/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filterGroups, properties: ["email"], limit: 1 }),
    });

    if (!res.ok) {
      // Missing scope / auth problem — log and treat as "not found" so a real
      // lead is still captured rather than silently dropped.
      console.error(
        `[credentials-lead] contact search (${describe}) failed: ${res.status} ${await res
          .text()
          .catch(() => "")}`
      );
      return false;
    }
    const data = (await res.json()) as { total?: number };
    return (data.total ?? 0) > 0;
  };

  if (await search([{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }], "email")) {
    return true;
  }

  // A number stored by hand in the CRM is usually in local format, so match
  // every plausible shape across each phone property HubSpot might hold it in.
  const values = phoneVariants(phone);
  const phoneGroups = ["phone", "mobilephone", "hs_searchable_calculated_phone_number"].map(
    (propertyName) => ({ filters: [{ propertyName, operator: "IN", values }] })
  );
  return search(phoneGroups, "phone");
}

/** Push a new lead through the HubSpot Forms API. Throws on failure. */
async function submitToHubSpot(
  lead: { name: string; email: string; phone: string },
  ctx: { hutk?: string; ipAddress?: string; pageUri: string }
): Promise<void> {
  if (!PORTAL_ID || !FORM_GUID) {
    throw new Error("HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID not configured");
  }

  const { firstname, lastname } = splitName(lead.name);
  const fields = [
    { name: "firstname", value: firstname },
    { name: "email", value: lead.email },
    { name: "phone", value: lead.phone },
  ];
  // Only send lastname when the visitor actually gave one — HubSpot rejects
  // submissions containing fields the form doesn't define, and empty values
  // would otherwise overwrite good CRM data.
  if (lastname) fields.push({ name: "lastname", value: lastname });

  const { res, host } = await fetchWithFallback(
    formsHosts(),
    `/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        context: {
          ...(ctx.hutk ? { hutk: ctx.hutk } : {}),
          ...(ctx.ipAddress ? { ipAddress: ctx.ipAddress } : {}),
          pageUri: ctx.pageUri,
          pageName: "Agency Credentials",
        },
      }),
    }
  );

  if (!res.ok) {
    // HubSpot's 400 body names any mismatched/missing form fields — log it
    // verbatim, it is the fastest way to diagnose a form config problem.
    throw new Error(`HubSpot submit ${res.status} via ${host}: ${await res.text().catch(() => "")}`);
  }
  console.log(`[credentials-lead] submitted to HubSpot via ${host}`);
}

/* ─── route ──────────────────────────────────────────────────────────────── */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request, cookies, url }) => {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown-ip";
    const now = Date.now();
    const limit = rateLimitMap.get(ip) ?? { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
    if (now > limit.resetTime) {
      limit.count = 0;
      limit.resetTime = now + RATE_LIMIT_WINDOW_MS;
    }
    if (limit.count >= RATE_LIMIT_MAX) {
      return json({ ok: false, error: "Too many attempts. Please try again later." }, 429);
    }
    limit.count++;
    rateLimitMap.set(ip, limit);

    const body = (await request.json().catch(() => null)) as
      | { name?: string; email?: string; phone?: string; company_website?: string; t?: number }
      | null;
    if (!body) return json({ ok: false, error: "Invalid request." }, 400);

    // Bots fill hidden fields and submit instantly. Humans don't.
    if (body.company_website) return json({ ok: false, error: "Invalid request." }, 400);
    if (typeof body.t === "number" && Date.now() - body.t < 2500) {
      return json({ ok: false, error: "That was too quick — please try again." }, 400);
    }

    const { ok, errors, clean } = validateLead(body);
    if (!ok) return json({ ok: false, errors }, 400);

    if (!(await domainAcceptsMail(emailDomain(clean.email)))) {
      return json(
        { ok: false, errors: { email: "We can't reach that email domain — please check it." } },
        400
      );
    }

    // ── HubSpot: dedupe, then submit. Never block the visitor on our CRM. ──
    let status: "created" | "existing" | "error" = "created";
    try {
      if (await contactExists(clean.email, clean.phone)) {
        status = "existing";
        console.log("[credentials-lead] existing contact — skipping HubSpot submit");
      } else {
        await submitToHubSpot(clean, {
          hutk: cookies.get("hubspotutk")?.value,
          ipAddress: ip !== "unknown-ip" ? ip : undefined,
          pageUri: new URL("/credentials", url.origin).href,
        });
      }
    } catch (err) {
      // Fail open: a CRM outage must not cost us the prospect.
      status = "error";
      console.error("[credentials-lead]", err instanceof Error ? err.message : err);
    }

    cookies.set(GATE_COOKIE, signGateToken(), {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      maxAge: GATE_MAX_AGE,
    });

    return json({ ok: true, status });
  } catch (err) {
    console.error("[credentials-lead] unexpected", err);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }
};
