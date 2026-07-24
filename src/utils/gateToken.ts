/**
 * Signed access token for the /credentials lead gate.
 *
 * Server-only (imports node:crypto) — never import this from client code.
 * The value is HMAC-signed so the gate can't be bypassed by typing a cookie
 * into devtools; without the secret an attacker can't mint a valid token.
 */
import crypto from "node:crypto";

export const GATE_COOKIE = "dnm_cred";
/** 180 days. */
export const GATE_MAX_AGE = 60 * 60 * 24 * 180;

function secret(): string {
  return import.meta.env.CREDENTIALS_GATE_SECRET ?? "";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

/** `v1.<expiryMs>.<hmac>` */
export function signGateToken(): string {
  const exp = Date.now() + GATE_MAX_AGE * 1000;
  const payload = `v1.${exp}`;
  return `${payload}.${sign(payload)}`;
}

/** Constant-time verification of a token from the request cookie. */
export function verifyGateToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;

  const [, expStr, mac] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const expected = sign(`v1.${expStr}`);
  const a = Buffer.from(mac, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
