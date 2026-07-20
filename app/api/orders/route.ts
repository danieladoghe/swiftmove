import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

interface OrderBody {
  contact: { name: string; email: string; phone?: string };
  items: { id: string; name: string; option?: string; quantity: number; price: number }[];
  subtotal: number; // cents
  gst: number; // cents
  total: number; // cents
  notes?: string;
}

/**
 * Phase 1 shop flow: reserve items online, pay at pickup.
 * Full e-commerce (online payment, inventory) comes later.
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

    const reference = `PU-${randomUUID().slice(0, 6).toUpperCase()}`;

    // TODO: Email confirmation to the customer + notify the yard once an
    // email provider is configured.
    console.log("[Mo's Yard] Pickup reservation:", {
      reference,
      contact: body.contact,
      items: body.items.map((i) => `${i.quantity}× ${i.name}${i.option ? ` (${i.option})` : ''}`),
      total: (body.total / 100).toFixed(2),
      notes: body.notes,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, reference });
  } catch (error) {
    console.error("[Mo's Yard] Order error:", error);
    return NextResponse.json({ success: false, error: 'Failed to submit order. Please try again.' }, { status: 500 });
  }
}
