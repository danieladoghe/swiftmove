import { NextRequest, NextResponse } from 'next/server';

interface ContactBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  moveType: string;
  rooms?: string;
  fromAddress: string;
  toAddress: string;
  moveDate?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactBody = await request.json();

    const { firstName, lastName, email, moveType, fromAddress, toAddress } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !moveType || !fromAddress || !toAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // ── Email sending integration ──────────────────────────────────────────
    // Replace this section with your preferred email provider:
    // - Resend:    https://resend.com/docs
    // - SendGrid:  https://docs.sendgrid.com
    // - Nodemailer with SMTP
    //
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'quotes@swiftmove.com',
    //   to: 'hello@swiftmove.com',
    //   subject: `New Quote Request from ${firstName} ${lastName}`,
    //   html: `...`,
    // });

    // For now, log the quote request
    console.log('[SwiftMove] New quote request:', {
      name: `${firstName} ${lastName}`,
      email,
      phone: body.phone,
      moveType,
      rooms: body.rooms,
      from: fromAddress,
      to: toAddress,
      date: body.moveDate,
      message: body.message,
      receivedAt: new Date().toISOString(),
    });

    // TODO: Save to database (e.g., Prisma, Supabase, MongoDB)
    // TODO: Send confirmation email to customer
    // TODO: Send notification email to team

    return NextResponse.json({
      success: true,
      message: 'Quote request received. We will be in touch shortly!',
    });

  } catch (error) {
    console.error('[SwiftMove] Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit. Please try again.' },
      { status: 500 }
    );
  }
}
