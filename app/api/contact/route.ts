import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { persistAndNotify } from '@/lib/submissions';

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

    const reference = `EN-${randomUUID().slice(0, 6).toUpperCase()}`;
    const fullName = `${firstName} ${lastName}`.trim();

    // Log to the admin database + email info@mosyard.ca (both best-effort).
    await persistAndNotify(
      {
        reference,
        type: 'enquiry',
        name: fullName,
        email,
        phone: body.phone,
        summary: `${moveType} — ${fromAddress} → ${toAddress}`,
        details: {
          moveType,
          rooms: body.rooms,
          fromAddress,
          toAddress,
          moveDate: body.moveDate,
          message: body.message,
        },
      },
      {
        emailHeading: `New enquiry — ${fullName}`,
        emailIntro: 'A new quote/enquiry came in through mosyard.ca.',
        replyTo: email,
        emailRows: [
          ['Name', fullName],
          ['Email', email],
          ['Phone', body.phone],
          ['Move type', moveType],
          ['Rooms', body.rooms],
          ['From', fromAddress],
          ['To', toAddress],
          ['Move date', body.moveDate],
          ['Message', body.message],
        ],
      }
    );

    return NextResponse.json({
      success: true,
      reference,
      message: 'Quote request received. We will be in touch shortly!',
    });

  } catch (error) {
    console.error("[Mo's Yard] Contact form error:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit. Please try again.' },
      { status: 500 }
    );
  }
}
