/**
 * Lead-form validation shared by the browser and the server.
 *
 * The client imports these for instant per-field feedback; the API route runs
 * the exact same functions again before touching HubSpot, because anything
 * arriving over the wire is untrusted. Keep this module dependency-free and
 * DOM-free so both runtimes can use it.
 *
 * Deliberately Unicode-aware (`\p{L}` + `u` flag) so Burmese-script names pass.
 */

export interface FieldResult {
  ok: boolean;
  /** Cleaned/normalised value, present when ok. */
  value?: string;
  /** Human-readable, user-facing message when not ok. */
  error?: string;
}

/* ── Name ─────────────────────────────────────────────────────────────── */

/** Obvious placeholder/mash input we never want in the CRM. */
const NAME_JUNK = new Set([
  "test", "testing", "asdf", "asdfgh", "qwerty", "abc", "abcd", "xyz",
  "none", "na", "n/a", "nil", "null", "undefined", "xxx", "aaa", "anonymous",
  "no name", "noname", "unknown", "user", "admin", "sample", "demo",
]);

export function validateName(raw: string): FieldResult {
  const value = (raw ?? "").trim().replace(/\s+/g, " ");

  if (!value) return { ok: false, error: "Please enter your name." };
  if (value.length < 2) return { ok: false, error: "That name looks too short." };
  if (value.length > 60) return { ok: false, error: "Please keep your name under 60 characters." };

  if (/\d/.test(value)) return { ok: false, error: "Names shouldn't contain numbers." };
  if (/[@/\\<>]|https?:/i.test(value)) return { ok: false, error: "Please enter a real name." };

  // Letters (any script), spaces, and the punctuation real names use.
  if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u.test(value)) {
    return { ok: false, error: "Please use letters only." };
  }

  const letters = value.replace(/[^\p{L}]/gu, "");
  if (letters.length < 2) return { ok: false, error: "Please enter your full name." };
  // "aaaa", "llll" — mashing one key.
  if (/(.)\1{3,}/u.test(value)) return { ok: false, error: "Please enter a real name." };
  // Needs at least two distinct letters to be a plausible name.
  if (new Set(letters.toLowerCase()).size < 2) {
    return { ok: false, error: "Please enter a real name." };
  }
  if (NAME_JUNK.has(value.toLowerCase())) {
    return { ok: false, error: "Please enter your real name." };
  }

  return { ok: true, value };
}

/* ── Email ────────────────────────────────────────────────────────────── */

/** Throwaway inbox providers — these are never real business leads. */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com", "tempmail.com", "temp-mail.org", "guerrillamail.com",
  "10minutemail.com", "yopmail.com", "trashmail.com", "throwawaymail.com",
  "sharklasers.com", "getnada.com", "dispostable.com", "fakeinbox.com",
  "maildrop.cc", "mailnesia.com", "mintemail.com", "spamgourmet.com",
  "tempinbox.com", "emailondeck.com", "moakt.com", "mohmal.com",
  "grr.la", "spam4.me", "byom.de", "tmpmail.org", "burnermail.io",
]);

// Pragmatic RFC-5322 subset: no consecutive/leading/trailing dots, TLD >= 2.
const EMAIL_RE =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

export function validateEmail(raw: string): FieldResult {
  const value = (raw ?? "").trim().toLowerCase();

  if (!value) return { ok: false, error: "Please enter your email." };
  if (value.length > 254) return { ok: false, error: "That email is too long." };
  if (!EMAIL_RE.test(value)) return { ok: false, error: "That doesn't look like a valid email." };

  const domain = value.slice(value.lastIndexOf("@") + 1);
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { ok: false, error: "Please use a permanent email address." };
  }

  return { ok: true, value };
}

/** Domain part of an already-validated email. */
export function emailDomain(email: string): string {
  return email.slice(email.lastIndexOf("@") + 1);
}

/* ── Phone ────────────────────────────────────────────────────────────── */

/**
 * Normalise to E.164. Myanmar-first (09…, 959…, +959…), with valid
 * international numbers accepted so overseas prospects aren't blocked.
 */
export function validatePhone(raw: string): FieldResult {
  const input = (raw ?? "").trim();
  if (!input) return { ok: false, error: "Please enter your phone number." };

  const hadPlus = input.trimStart().startsWith("+");
  const digits = input.replace(/\D/g, "");

  if (!digits) return { ok: false, error: "That doesn't look like a valid phone number." };
  if (isJunkDigits(digits)) return { ok: false, error: "Please enter a real phone number." };

  // ── Myanmar ──
  // Local 09XXXXXXXXX (subscriber part is 7–9 digits after the leading 9).
  if (!hadPlus && /^09\d{7,9}$/.test(digits)) {
    return { ok: true, value: `+95${digits.slice(1)}` };
  }
  // 95 + 9XXXXXXXX (with or without +)
  if (/^959\d{7,9}$/.test(digits)) {
    return { ok: true, value: `+${digits}` };
  }

  // ── International ──
  if (hadPlus) {
    if (/^\d{8,15}$/.test(digits)) return { ok: true, value: `+${digits}` };
    return { ok: false, error: "That doesn't look like a valid phone number." };
  }

  // No "+" and not a Myanmar pattern — most likely a mistyped local number.
  if (/^0\d{6,}$/.test(digits)) {
    return { ok: false, error: "Please enter a valid Myanmar number, e.g. 09 776 299 099." };
  }
  return {
    ok: false,
    error: "Include your country code, e.g. +65…, or use 09… for Myanmar.",
  };
}

/** All-same-digit, or a straight ascending/descending run. */
function isJunkDigits(digits: string): boolean {
  const body = digits.replace(/^(?:95|0)/, "");
  if (body.length >= 5 && /^(\d)\1+$/.test(body)) return true;
  if (digits.length >= 7) {
    const asc = "01234567890123456789";
    const desc = "09876543210987654321";
    if (asc.includes(digits) || desc.includes(digits)) return true;
  }
  return false;
}

/* ── Whole-form helper ────────────────────────────────────────────────── */

export interface LeadInput {
  name: string;
  email: string;
  phone: string;
}

export interface LeadValidation {
  ok: boolean;
  errors: Partial<Record<keyof LeadInput, string>>;
  clean: LeadInput;
}

/** Run all three validators; used verbatim on both client and server. */
export function validateLead(input: Partial<LeadInput>): LeadValidation {
  const name = validateName(input.name ?? "");
  const email = validateEmail(input.email ?? "");
  const phone = validatePhone(input.phone ?? "");

  const errors: LeadValidation["errors"] = {};
  if (!name.ok) errors.name = name.error;
  if (!email.ok) errors.email = email.error;
  if (!phone.ok) errors.phone = phone.error;

  return {
    ok: name.ok && email.ok && phone.ok,
    errors,
    clean: {
      name: name.value ?? "",
      email: email.value ?? "",
      phone: phone.value ?? "",
    },
  };
}

/**
 * Plausible stored forms of a phone number, for CRM lookups.
 *
 * We always store E.164, but a contact added by hand in HubSpot is often typed
 * in local format — so a dedupe check has to try each shape.
 * `+959776299099` → `["+959776299099", "959776299099", "09776299099"]`
 */
export function phoneVariants(e164: string): string[] {
  const variants = new Set<string>([e164]);
  const digits = e164.replace(/\D/g, "");
  variants.add(digits);
  if (digits.startsWith("95")) variants.add(`0${digits.slice(2)}`);
  return [...variants];
}

/** Split a full name into HubSpot's firstname / lastname. */
export function splitName(fullName: string): { firstname: string; lastname?: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstname: parts[0] };
  return { firstname: parts[0], lastname: parts.slice(1).join(" ") };
}
