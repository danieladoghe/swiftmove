import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { products } from '@/lib/products';
import { GST_RATE } from '@/lib/booking';
import { env } from '@/lib/env';
import { persistAndNotify } from '@/lib/submissions';

interface CardOrderBody {
  sourceId: string; // Square Web Payments card token (cnon:...)
  contact: { name: string; email: string; phone?: string };
  fulfillment?: 'pickup' | 'delivery';
  address?: { street: string; city: string; postal?: string };
  items: { id: string; option?: string; quantity: number }[];
  notes?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SQUARE_VERSION = '2024-08-21';

function squareBase() {
  return (env('SQUARE_ENV') ?? 'sandbox') === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';
}

/**
 * Charges a shop order online with Square's Payments API. The amount is always
 * recomputed server-side from the product catalog — never trusted from the
 * client — so the charge can't be tampered with. On success the paid order is
 * logged to the dashboard and both the yard and the customer are emailed.
 */
export async function POST(request: NextRequest) {
  try {
    const body: CardOrderBody = await request.json();

    if (!body.sourceId) {
      return NextResponse.json({ success: false, error: 'Missing card details.' }, { status: 400 });
    }
    if (!body.contact?.name || !EMAIL_RE.test(body.contact?.email ?? '')) {
      return NextResponse.json({ success: false, error: 'Name and a valid email are required.' }, { status: 400 });
    }
    if (!body.items?.length) {
      return NextResponse.json({ success: false, error: 'Your cart is empty.' }, { status: 400 });
    }

    const fulfillment = body.fulfillment === 'delivery' ? 'delivery' : 'pickup';
    if (fulfillment === 'delivery' && (!body.address?.street || !body.address?.city)) {
      return NextResponse.json({ success: false, error: 'A delivery address is required.' }, { status: 400 });
    }

    // ── Recompute the amount from the catalog (do not trust client totals) ──
    let subtotal = 0;
    const lineItems: { id: string; name: string; option?: string; quantity: number; price: number }[] = [];
    for (const it of body.items) {
      const product = products.find((p) => p.id === it.id);
      const qty = Math.min(999, Math.max(1, Math.floor(Number(it.quantity) || 0)));
      if (!product) continue;
      subtotal += product.price * qty;
      lineItems.push({ id: product.id, name: product.name, option: it.option, quantity: qty, price: product.price });
    }
    if (!lineItems.length || subtotal <= 0) {
      return NextResponse.json({ success: false, error: 'No valid items in your order.' }, { status: 400 });
    }
    const gst = Math.round(subtotal * GST_RATE);
    const total = subtotal + gst; // cents

    // ── Fail closed if Square isn't configured (never fake a success) ──
    const accessToken = env('SQUARE_ACCESS_TOKEN');
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || env('SQUARE_LOCATION_ID');
    if (!accessToken || !locationId) {
      return NextResponse.json(
        { success: false, error: 'Online card payment is not available right now. Please choose pay at pickup/delivery.' },
        { status: 503 }
      );
    }

    // ── Charge via Square ──
    const res = await fetch(`${squareBase()}/v2/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Square-Version': SQUARE_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: randomUUID(),
        source_id: body.sourceId,
        amount_money: { amount: total, currency: 'CAD' },
        location_id: locationId,
        buyer_email_address: body.contact.email,
        note: `Mo's Yard shop order — ${body.contact.name} (${fulfillment})`,
      }),
    });
    const data = await res.json();

    if (!res.ok || data.errors) {
      const detail = data.errors?.[0]?.detail ?? 'Your payment was declined. Please check your card and try again.';
      console.error("[Mo's Yard] Square payment failed:", res.status, JSON.stringify(data.errors ?? data));
      return NextResponse.json({ success: false, error: detail }, { status: 402 });
    }

    const payment = data.payment;
    const reference = `SH-${randomUUID().slice(0, 6).toUpperCase()}`;
    const itemLines = lineItems.map((i) => `${i.quantity}× ${i.name}${i.option ? ` (${i.option})` : ''}`);
    const addressStr =
      fulfillment === 'delivery' && body.address
        ? `${body.address.street}, ${body.address.city}${body.address.postal ? ` ${body.address.postal}` : ''}`
        : undefined;

    // Log the paid order + email the yard and the customer (best-effort).
    await persistAndNotify(
      {
        reference,
        type: 'order',
        name: body.contact.name,
        email: body.contact.email,
        phone: body.contact.phone,
        summary: `${lineItems.reduce((n, i) => n + i.quantity, 0)} item(s) — ${fulfillment} — PAID`,
        amountCents: total,
        fulfillment,
        details: {
          paid: true,
          paymentId: payment.id,
          paymentStatus: payment.status,
          items: lineItems,
          itemLines,
          subtotalCents: subtotal,
          gstCents: gst,
          totalCents: total,
          address: addressStr,
          notes: body.notes,
        },
      },
      {
        emailHeading: `New PAID order — ${fulfillment === 'delivery' ? 'Delivery' : 'Pickup'}`,
        emailIntro: `Paid online by card via Square (status: ${payment.status}).`,
        replyTo: body.contact.email,
        emailRows: [
          ['Customer', body.contact.name],
          ['Email', body.contact.email],
          ['Phone', body.contact.phone],
          ['Fulfillment', fulfillment],
          ['Address', addressStr],
          ['Items', itemLines.join(' · ')],
          ['Total paid', `$${(total / 100).toFixed(2)} CAD`],
          ['Square payment', payment.id],
          ['Notes', body.notes],
        ],
      }
    );

    return NextResponse.json({ success: true, reference, paymentId: payment.id, status: payment.status });
  } catch (error) {
    console.error("[Mo's Yard] Payment error:", error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong processing your payment. Please try again.' },
      { status: 500 }
    );
  }
}
