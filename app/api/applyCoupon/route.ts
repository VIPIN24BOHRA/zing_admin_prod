/* eslint-disable import/extensions */

import { createTestPaymentSession, getETA } from '@/lib/riderHelper';
import { getCouponsCount } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';
import { isValid } from 'react-datepicker/dist/date_utils';

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

    console.log(cart, coupon, uid);

    const usedCount = await getCouponsCount(uid, coupon.code);
    console.log(usedCount);

    return NextResponse.json({
      success: true,
      isValid: usedCount != null && usedCount < coupon.maxCount ? true : false
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
