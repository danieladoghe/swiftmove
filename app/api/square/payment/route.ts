import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

interface PaymentBody {
  sourceId: string;
  amount: number;  // in cents
  currency: string;
  buyerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    option?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentBody = await request.json();
    const { sourceId, amount, currency = 'USD', buyerInfo, items } = body;

    // Validation
    if (!sourceId || !amount || amount < 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment details.' },
        { status: 400 }
      );
    }

    // Square API credentials (set as environment variables)
    const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
    const squareLocationId = process.env.SQUARE_LOCATION_ID;

    if (!squareAccessToken || !squareLocationId) {
      // In demo mode, simulate a successful payment
      console.warn("[Mo's Yard] Square credentials not set — running in demo mode.");
      const demoOrderId = `DEMO-${randomUUID().slice(0, 8).toUpperCase()}`;
      return NextResponse.json({
        success: true,
        orderId: demoOrderId,
        message: 'Demo payment processed (credentials not configured)',
        demo: true,
      });
    }

    // Call Square Payments API
    const squareResponse = await fetch(
      `https://connect.squareupsandbox.com/v2/payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${squareAccessToken}`,
          'Square-Version': '2024-01-18',
        },
        body: JSON.stringify({
          idempotency_key: randomUUID(),
          source_id: sourceId,
          amount_money: {
            amount: amount,
            currency: currency,
          },
          location_id: squareLocationId,
          buyer_email_address: buyerInfo.email,
          billing_address: {
            address_line_1: buyerInfo.address,
            locality: buyerInfo.city,
            administrative_district_level_1: buyerInfo.state,
            postal_code: buyerInfo.zip,
            country: 'US',
          },
          note: `Mo's Yard order for ${buyerInfo.firstName} ${buyerInfo.lastName}`,
          order_id: randomUUID(),
        }),
      }
    );

    const squareData = await squareResponse.json();

    if (!squareResponse.ok || squareData.errors) {
      const errorMsg = squareData.errors?.[0]?.detail ?? 'Payment declined.';
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const payment = squareData.payment;

    // TODO: Save order to database here

    return NextResponse.json({
      success: true,
      orderId: payment.id,
      status: payment.status,
      amount: payment.amount_money,
    });

  } catch (error) {
    console.error("[Mo's Yard] Payment error:", error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
