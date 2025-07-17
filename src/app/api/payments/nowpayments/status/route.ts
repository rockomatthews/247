import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
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

    const response = await fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
      headers: {
        'x-api-key': nowPaymentsApiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('NOWPayments status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment status' },
      { status: 500 }
    );
  }
}