// Minimal signed-cookie session for the /admin area. No third-party auth, no
// database — a single shared admin login (ADMIN_USERNAME/ADMIN_PASSWORD) plus an
// HMAC-signed, expiring token so the cookie can't be forged.
//
// Uses only Web Crypto + btoa/atob, so the SAME module runs in the Edge
// middleware and in Node route handlers. Do NOT import db/email here — that
// would pull Node-only code into the Edge bundle.
//
// Required env to switch it on (set in Netlify):
//   ADMIN_PASSWORD   the admin password
//   AUTH_SECRET      a long random string used to sign sessions
//   ADMIN_USERNAME   optional, defaults to "admin"

import { env } from './env';

export const ADMIN_COOKIE = 'mosyard_admin';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Create a signed session token, or null if auth isn't configured. */
export async function createSession(username: string): Promise<string | null> {
  const secret = env('AUTH_SECRET');
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ u: username, exp })));
  const sig = toBase64Url(await hmac(secret, payload));
  return `${payload}.${sig}`;
}

/** Verify a session token; returns the username or null. */
export async function verifySession(token: string | undefined): Promise<string | null> {
  const secret = env('AUTH_SECRET');
  if (!secret || !token) return null;
  const dot = token.indexOf('.');
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    const expected = await hmac(secret, payload);
    if (!timingSafeEqual(fromBase64Url(sig), expected)) return null;
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as {
      u: string;
      exp: number;
    };
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data.u;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
