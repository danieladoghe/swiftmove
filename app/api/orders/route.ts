import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { persistAndNotify } from '@/lib/submissions';

interface OrderBody {
  contact: { name: string; email: string; phone?: string };
  fulfillment?: 'pickup' | 'delivery';
  address?: { street: string; city: string; postal?: string };
  items: { id: string; name: string; option?: string; quantity: number; price: number }[];
  subtotal: number; // cents
  gst: number; // cents
  total: number; // cents
  notes?: string;
}

/**
 * Phase 1 shop flow: reserve items online, pay at pickup or on delivery
 * (delivery fee confirmed manually). Full e-commerce comes later.
 */
export async function POST(request: NextRequest) {
  try {
    const body: OrderBody = await request.json();
    if (!body.contact?.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contact?.email ?? '')) {
      return NextResponse.json({ success: false, error: 'Name and a valid email are required.' }, { status: 400 });
    }
    if (!body.items?.length) {
      return NextResponse.json({ success: false, error: 'Your cart is empty.' }, { status: 400 });
    }

    const fulfillment = body.fulfillment === 'delivery' ? 'delivery' : 'pickup';
    if (fulfillment === 'delivery' && (!body.address?.street || !body.address?.city)) {
      return NextResponse.json({ success: false, error: 'A delivery address is required.' }, { status: 400 });
    }

    const reference = `${fulfillment === 'delivery' ? 'DL' : 'PU'}-${randomUUID().slice(0, 6).toUpperCase()}`;
    const itemLines = body.items.map(
      (i) => `${i.quantity}× ${i.name}${i.option ? ` (${i.option})` : ''}`
    );
    const addressStr =
      fulfillment === 'delivery' && body.address
        ? `${body.address.street}, ${body.address.city}${body.address.postal ? ` ${body.address.postal}` : ''}`
        : undefined;

    // Log to the admin database + email info@mosyard.ca (both best-effort).
    await persistAndNotify(
      {
        reference,
        type: 'order',
        name: body.contact.name,
        email: body.contact.email,
        phone: body.contact.phone,
        summary: `${body.items.reduce((n, i) => n + i.quantity, 0)} item(s) — ${fulfillment}`,
        amountCents: body.total,
        fulfillment,
        details: {
          items: body.items,
          itemLines,
          subtotalCents: body.subtotal,
          gstCents: body.gst,
          totalCents: body.total,
          address: addressStr,
          notes: body.notes,
        },
      },
      {
        emailHeading: `New supply order — ${fulfillment === 'delivery' ? 'Delivery' : 'Pickup'}`,
        emailIntro: 'A new shop order came in through mosyard.ca. Payment is collected at pickup/delivery.',
        replyTo: body.contact.email,
        emailRows: [
          ['Customer', body.contact.name],
          ['Email', body.contact.email],
          ['Phone', body.contact.phone],
          ['Fulfillment', fulfillment],
          ['Address', addressStr],
          ['Items', itemLines.join(' · ')],
          ['Total', `$${(body.total / 100).toFixed(2)} CAD`],
          ['Notes', body.notes],
        ],
      }
    );

    return NextResponse.json({ success: true, reference });
  } catch (error) {
    console.error("[Mo's Yard] Order error:", error);
    return NextResponse.json({ success: false, error: 'Failed to submit order. Please try again.' }, { status: 500 });
  }
}
