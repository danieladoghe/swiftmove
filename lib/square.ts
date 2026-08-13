// Shared Square helpers. The location id is resolved automatically from the
// access token (like the reservation-invoice flow already does), so the site
// works with just SQUARE_ACCESS_TOKEN + NEXT_PUBLIC_SQUARE_APP_ID — no manual
// Location ID hunting. An explicit NEXT_PUBLIC_SQUARE_LOCATION_ID still wins.

import { env } from './env';

export const SQUARE_VERSION = '2024-08-21';

export function squareBase(): string {
  return (env('SQUARE_ENV') ?? 'sandbox') === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';
}

/** The public application id used by the Web Payments SDK on the client. */
export function squareAppId(): string | undefined {
  return process.env.NEXT_PUBLIC_SQUARE_APP_ID?.trim() || env('SQUARE_APP_ID');
}

let cached: { id: string; ts: number } | null = null;

/**
 * Returns the Square location id: an explicit env value if set, otherwise the
 * account's active location fetched from the access token (cached ~1h).
 * Returns null if Square isn't configured or the lookup fails.
 */
export async function resolveLocationId(): Promise<string | null> {
  const explicit = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || env('SQUARE_LOCATION_ID');
  if (explicit) return explicit;

  const token = env('SQUARE_ACCESS_TOKEN');
  if (!token) return null;
  if (cached && Date.now() - cached.ts < 60 * 60 * 1000) return cached.id;

  try {
    const res = await fetch(`${squareBase()}/v2/locations`, {
      headers: { Authorization: `Bearer ${token}`, 'Square-Version': SQUARE_VERSION },
    });
    const data = await res.json();
    const loc =
      data.locations?.find((l: { status?: string }) => l.status === 'ACTIVE') ?? data.locations?.[0];
    if (loc?.id) {
      cached = { id: loc.id, ts: Date.now() };
      return loc.id;
    }
  } catch (e) {
    console.error('[square] resolveLocationId failed', e);
  }
  return null;
}
