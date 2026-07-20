import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

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

    // TODO: Email this to info@mosyard.ca once a transactional email provider
    // (e.g. Resend) is configured.
    console.log("[Mo's Yard] Freight quote request:", { reference, ...body, receivedAt: new Date().toISOString() });

    return NextResponse.json({ success: true, reference });
  } catch (error) {
    console.error("[Mo's Yard] Quote form error:", error);
    return NextResponse.json({ success: false, error: 'Failed to submit. Please try again.' }, { status: 500 });
  }
}
