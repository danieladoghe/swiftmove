import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { YARD_SPACES, GST_RATE } from '@/lib/booking';

interface BookingBody {
  spaceId: string;
  moveIn?: string;
  notes?: string;
  contact: { name: string; email: string; phone?: string; company?: string };
}

const SQUARE_VERSION = '2024-08-21';

function squareBase() {
  const env = process.env.SQUARE_ENV ?? 'sandbox';
  return env === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com';
}

async function sq<T>(path: string, method: 'GET' | 'POST', body?: unknown): Promise<T> {
  const res = await fetch(`${squareBase()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Square-Version': SQUARE_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Square ${path} ${res.status}: ${JSON.stringify(json.errors ?? json)}`);
  }
  return json as T;
}

/**
 * Creates and emails a Square invoice for the first month's rent (+5% GST).
 * The security deposit and administration fee are handled in the rental
 * agreement. Square emails the invoice with a secure payment link, and
 * automatically emails a receipt once the customer pays.
 */
async function createSquareInvoice(booking: BookingBody, space: (typeof YARD_SPACES)[number]) {
  const monthly = space.launch ?? space.regular ?? 0;

  const locations = await sq<{ locations?: { id: string; status: string }[] }>('/v2/locations', 'GET');
  const location = locations.locations?.find((l) => l.status === 'ACTIVE') ?? locations.locations?.[0];
  if (!location) throw new Error('No Square location found');

  const [givenName, ...rest] = booking.contact.name.trim().split(/\s+/);
  const customer = await sq<{ customer: { id: string } }>('/v2/customers', 'POST', {
    idempotency_key: randomUUID(),
    given_name: givenName,
    family_name: rest.join(' ') || undefined,
    email_address: booking.contact.email,
    phone_number: booking.contact.phone || undefined,
    company_name: booking.contact.company || undefined,
    note: "Mo's Yard storage reservation",
  });

  const order = await sq<{ order: { id: string } }>('/v2/orders', 'POST', {
    idempotency_key: randomUUID(),
    order: {
      location_id: location.id,
      line_items: [
        {
          name: `${space.name} (${space.dims}) — first month${booking.moveIn ? `, move-in ${booking.moveIn}` : ''}`,
          quantity: '1',
          base_price_money: { amount: Math.round(monthly * 100), currency: 'CAD' },
        },
      ],
      taxes: [
        { name: 'GST', percentage: (GST_RATE * 100).toString(), scope: 'ORDER' },
      ],
    },
  });

  const dueDate = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const invoice = await sq<{ invoice: { id: string; version: number } }>('/v2/invoices', 'POST', {
    idempotency_key: randomUUID(),
    invoice: {
      location_id: location.id,
      order_id: order.order.id,
      primary_recipient: { customer_id: customer.customer.id },
      delivery_method: 'EMAIL',
      title: "Mo's Yard — Storage Reservation",
      description:
        `Reservation for ${space.name} (${space.dims}). ` +
        'Your space is confirmed once payment and the signed rental agreement are received. ' +
        'Security deposit and administration fee (if applicable) are outlined in the rental agreement.',
      payment_requests: [{ request_type: 'BALANCE', due_date: dueDate }],
      accepted_payment_methods: { card: true, bank_account: true, square_gift_card: false, buy_now_pay_later: false },
    },
  });

  const published = await sq<{ invoice: { invoice_number?: string; public_url?: string } }>(
    `/v2/invoices/${invoice.invoice.id}/publish`,
    'POST',
    { version: invoice.invoice.version, idempotency_key: randomUUID() }
  );

  return {
    reference: published.invoice.invoice_number ?? invoice.invoice.id,
    invoiceUrl: published.invoice.public_url ?? null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingBody = await request.json();
    const { spaceId, contact } = body;

    const space = YARD_SPACES.find((s) => s.id === spaceId && !s.custom);
    if (!space) {
      return NextResponse.json({ success: false, error: 'Invalid space.' }, { status: 400 });
    }
    if (!contact?.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact?.email ?? '')) {
      return NextResponse.json({ success: false, error: 'Name and a valid email are required.' }, { status: 400 });
    }

    const logBase = {
      space: `${space.name} (${space.dims})`,
      moveIn: body.moveIn,
      contact,
      notes: body.notes,
      receivedAt: new Date().toISOString(),
    };

    // With Square configured, generate + email the real invoice.
    if (process.env.SQUARE_ACCESS_TOKEN) {
      try {
        const { reference, invoiceUrl } = await createSquareInvoice(body, space);
        console.log("[Mo's Yard] Reservation invoiced:", { reference, invoiceUrl, ...logBase });
        return NextResponse.json({ success: true, reference, invoiced: true, invoiceUrl });
      } catch (err) {
        // Never lose the reservation because invoicing hiccuped.
        console.error("[Mo's Yard] Square invoicing failed, falling back to manual:", err);
      }
    }

    const reference = `MY-${randomUUID().slice(0, 6).toUpperCase()}`;
    console.log("[Mo's Yard] Reservation received (manual invoicing):", { reference, ...logBase });
    return NextResponse.json({ success: true, reference, invoiced: false });
  } catch (error) {
    console.error("[Mo's Yard] Booking error:", error);
    return NextResponse.json({ success: false, error: 'Failed to submit reservation. Please try again.' }, { status: 500 });
  }
}
