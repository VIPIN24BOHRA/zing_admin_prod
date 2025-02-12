/* eslint-disable import/extensions */

import { createTestPaymentSession, getETA } from '@/lib/riderHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json(`delivery time is up and running`);
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey, cart, coupon, uid } = await req.json();
    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_WEB_API_KEY) {
      return NextResponse.json({ success: false, error: 'Invalid Api key' });
    }

    if (!cart || !uid || !coupon || !coupon.code || !coupon.maxCount) {
      return NextResponse.json({ success: false, error: 'invalid data' });
    }

    console.log(cart, coupon,uid);

    return NextResponse.json({
      success: true
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
