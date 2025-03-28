/* eslint-disable import/extensions */

import { getTestPaymentStatus } from '@/lib/riderHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json('get payment  status is up and running');
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey, order_id } = await req.json();
    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_WEB_API_KEY) {
      return NextResponse.json({ success: false, error: 'Invalid Api key' });
    }
    if (!order_id) {
      return NextResponse.json({
        success: false,
        error: 'required fields are missing'
      });
    }

    const result = await getTestPaymentStatus(order_id);

    const response = {
      cf_order_id: result.cf_order_id,
      order_id: result.order_id,
      order_status: result.order_status
    };

    return NextResponse.json({
      success: true,
      response: response
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
