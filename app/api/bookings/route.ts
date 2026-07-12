import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

interface BookingBody {
  service: 'storage' | 'movers' | 'rental';
  summary: string;
  total: number;
  details: Record<string, unknown>;
  contact: { name: string; email: string; phone?: string; notes?: string };
  payment: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingBody = await request.json();
    const { service, contact, payment } = body;

    if (!service || !['storage', 'movers', 'rental'].includes(service)) {
      return NextResponse.json({ success: false, error: 'Invalid service type.' }, { status: 400 });
    }
    if (!contact?.name || !contact?.email) {
      return NextResponse.json({ success: false, error: 'Name and email are required.' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 });
    }
    if (!payment) {
      return NextResponse.json({ success: false, error: 'Choose a payment option.' }, { status: 400 });
    }

    const reference = `MY-${randomUUID().slice(0, 6).toUpperCase()}`;

    // ── Persistence & notifications ─────────────────────────────────────────
    // TODO: Save to database and notify the yard (email/SMS).
    // TODO: When Square is integrated, create the payment link here for the
    //       'card-link' option and include it in the confirmation email.
    console.log("[Mo's Yard] New booking:", {
      reference,
      service,
      summary: body.summary,
      total: body.total,
      details: body.details,
      contact,
      payment,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, reference });
  } catch (error) {
    console.error("[Mo's Yard] Booking error:", error);
    return NextResponse.json({ success: false, error: 'Failed to submit booking. Please try again.' }, { status: 500 });
  }
}
