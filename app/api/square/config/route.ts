import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { squareAppId, squareBase, SQUARE_VERSION } from '@/lib/square';

// Public: tells the checkout whether online card payment is available and, if so,
// the app id + location id the Web Payments SDK needs (both non-secret). The
// location is auto-resolved from the token. On failure it reports a short,
// non-sensitive `reason` so setup problems (wrong env, unactivated account,
// app-id/account mismatch) are diagnosable at a glance.
export const dynamic = 'force-dynamic';

type SquareLocation = {
  id?: string;
  status?: string;
  capabilities?: string[];
  country?: string;
  currency?: string;
  merchant_id?: string;
};

export async function GET() {
  const appId = squareAppId();
  const token = env('SQUARE_ACCESS_TOKEN');
  const environment = env('SQUARE_ENV') || 'sandbox';

  if (!appId) return NextResponse.json({ configured: false, reason: 'NEXT_PUBLIC_SQUARE_APP_ID is not set', environment });
  if (!token) return NextResponse.json({ configured: false, reason: 'SQUARE_ACCESS_TOKEN is not set', environment });

  // Flag an obvious env/app-id mismatch before even calling Square.
  const appIsSandbox = appId.startsWith('sandbox-');
  if (environment === 'production' && appIsSandbox) {
    return NextResponse.json({ configured: false, reason: 'SQUARE_ENV=production but the app ID is a sandbox id (sandbox-…). Use the production app id (sq0idp-…).', environment });
  }
  if (environment !== 'production' && !appIsSandbox) {
    return NextResponse.json({ configured: false, reason: 'SQUARE_ENV=sandbox but the app ID is a production id. Set SQUARE_ENV=production, or use the sandbox app id.', environment });
  }

  try {
    const res = await fetch(`${squareBase()}/v2/locations`, {
      headers: { Authorization: `Bearer ${token}`, 'Square-Version': SQUARE_VERSION },
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const code = data?.errors?.[0]?.code || data?.errors?.[0]?.detail || `HTTP ${res.status}`;
      const hint =
        res.status === 401
          ? ' — token/environment mismatch: make sure SQUARE_ENV matches the token (production token needs SQUARE_ENV=production).'
          : '';
      return NextResponse.json({ configured: false, reason: `Square rejected the locations lookup (${code})${hint}`, environment, status: res.status });
    }

    const locations: SquareLocation[] = data.locations ?? [];
    const canProcess = (l: SquareLocation) => l.capabilities?.includes('CREDIT_CARD_PROCESSING') ?? false;
    // The Web Payments SDK's applicationId must be paired with a location that
    // can actually take card payments. Prefer an ACTIVE, card-capable location;
    // then any card-capable one; then ACTIVE; then whatever exists.
    const loc =
      locations.find((l) => l.status === 'ACTIVE' && canProcess(l)) ??
      locations.find(canProcess) ??
      locations.find((l) => l.status === 'ACTIVE') ??
      locations[0];

    if (!loc?.id) {
      return NextResponse.json({ configured: false, reason: 'No locations on this Square account yet — finish activating the account for payments.', environment });
    }

    // The decisive check: a location can only initialize the card form when the
    // Square account is activated for card processing. Without this capability
    // the SDK's hydrate call 401s ("An unexpected error occurred while
    // initializing the payment method"), so we fall back to pay-at-pickup
    // instead of showing a card form that can't work — and say why.
    if (!canProcess(loc)) {
      return NextResponse.json({
        configured: false,
        reason:
          'Square account is not activated for card processing yet. Finish activation in the Square Dashboard (business details + linked bank account / deposit), then this turns on automatically. No code change needed.',
        environment,
        diagnostic: {
          locationStatus: loc.status ?? null,
          capabilities: loc.capabilities ?? [],
          country: loc.country ?? null,
          currency: loc.currency ?? null,
          merchantId: loc.merchant_id ?? null,
        },
      });
    }

    return NextResponse.json({
      configured: true,
      appId,
      locationId: loc.id,
      environment,
      diagnostic: {
        capabilities: loc.capabilities ?? [],
        country: loc.country ?? null,
        currency: loc.currency ?? null,
        merchantId: loc.merchant_id ?? null,
      },
    });
  } catch (e) {
    return NextResponse.json({ configured: false, reason: 'Network error reaching Square', environment, detail: (e as Error)?.message });
  }
}
