import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { squareAppId, resolveLocationId } from '@/lib/square';

// Public: tells the checkout whether online card payment is available and, if so,
// the app id + location id the Web Payments SDK needs (both are non-secret).
// Location is auto-resolved from the access token, so no manual Location ID.
export const dynamic = 'force-dynamic';

export async function GET() {
  const appId = squareAppId();
  const token = env('SQUARE_ACCESS_TOKEN');
  if (!appId || !token) return NextResponse.json({ configured: false });

  const locationId = await resolveLocationId();
  if (!locationId) return NextResponse.json({ configured: false });

  return NextResponse.json({ configured: true, appId, locationId });
}
