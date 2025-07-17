import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, message } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const nowPaymentsApiKey = process.env.NEXT_PUBLIC_NOWPAYMENTS_API_KEY;
    
    if (!nowPaymentsApiKey) {
      return NextResponse.json(
        { error: 'NOWPayments API key not configured' },
        { status: 500 }
      );
    }

    const paymentData = {
      price_amount: amount,
      price_currency: 'usd',
      pay_currency: 'btc',
      ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/api/payments/nowpayments/callback`,
      order_id: `tip_${Date.now()}`,
      order_description: `Tip for Projector Bach: ${message || 'No message'}`,
    };

    const response = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': nowPaymentsApiKey,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('NOWPayments API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create payment' },
        { status: 500 }
      );
    }

    const paymentResult = await response.json();
    
    return NextResponse.json({
      paymentId: paymentResult.payment_id,
      paymentAddress: paymentResult.pay_address,
      paymentAmount: paymentResult.pay_amount,
      payCurrency: paymentResult.pay_currency,
      paymentUrl: paymentResult.payment_url,
    });
  } catch (error) {
    console.error('NOWPayments processing error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}