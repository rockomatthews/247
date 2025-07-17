import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-nowpayments-sig');
    
    if (!signature || !process.env.NOWPAYMENTS_IPN_SECRET) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const computedSignature = createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET)
      .update(body)
      .digest('hex');

    if (computedSignature !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const paymentData = JSON.parse(body);
    
    console.log('NOWPayments callback received:', {
      paymentId: paymentData.payment_id,
      paymentStatus: paymentData.payment_status,
      orderId: paymentData.order_id,
      actuallyPaid: paymentData.actually_paid,
      payCurrency: paymentData.pay_currency,
    });

    if (paymentData.payment_status === 'finished' || 
        paymentData.payment_status === 'partially_paid') {
      console.log('Payment successful:', paymentData.order_id);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('NOWPayments callback error:', error);
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    );
  }
}