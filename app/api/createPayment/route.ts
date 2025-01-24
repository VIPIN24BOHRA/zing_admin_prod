/* eslint-disable import/extensions */

import { createPaymentSession } from '@/lib/riderHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json(
    `create payment is up and running ${process.env.CASHFREE_CLIENT_ID?.substring(0, 3)}`
  );
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey, order_amount, order_id, phone, user_id } = await req.json();
    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_WEB_API_KEY) {
      return NextResponse.json({ success: false, error: 'Invalid Api key' });
    }
    if (!order_amount || !order_id || !phone || !user_id) {
      return NextResponse.json({
        success: false,
        error: 'required fields are missing'
      });
    }

    const result = await createPaymentSession(
      order_amount,
      order_id,
      phone,
      user_id
    );
    const response = {
      cf_order_id: result.cf_order_id,
      order_id: result.order_id,
      payment_session_id: result.payment_session_id
    };

    return NextResponse.json({
      success: true,
      response
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
