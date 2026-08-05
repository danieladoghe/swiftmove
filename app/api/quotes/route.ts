import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { persistAndNotify } from '@/lib/submissions';

interface QuoteBody {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service: string;
  pickup?: string;
  delivery?: string;
  date?: string;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteBody = await request.json();
    if (!body.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email ?? '') || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Name, a valid email, and a freight description are required.' },
        { status: 400 }
      );
    }

    const reference = `FQ-${randomUUID().slice(0, 6).toUpperCase()}`;

    // Log to the admin database + email info@mosyard.ca (both best-effort).
    await persistAndNotify(
      {
        reference,
        type: 'quote',
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        summary: `${body.service}${body.pickup ? ` — ${body.pickup} → ${body.delivery ?? ''}` : ''}`,
        details: {
          service: body.service,
          pickup: body.pickup,
          delivery: body.delivery,
          date: body.date,
          description: body.description,
        },
      },
      {
        emailHeading: `New freight quote — ${body.name}`,
        emailIntro: 'A new freight/logistics quote request came in through mosyard.ca.',
        replyTo: body.email,
        emailRows: [
          ['Name', body.name],
          ['Company', body.company],
          ['Email', body.email],
          ['Phone', body.phone],
          ['Service', body.service],
          ['Pickup', body.pickup],
          ['Delivery', body.delivery],
          ['Date', body.date],
          ['Description', body.description],
        ],
      }
    );

    return NextResponse.json({ success: true, reference });
  } catch (error) {
    console.error("[Mo's Yard] Quote form error:", error);
    return NextResponse.json({ success: false, error: 'Failed to submit. Please try again.' }, { status: 500 });
  }
}
