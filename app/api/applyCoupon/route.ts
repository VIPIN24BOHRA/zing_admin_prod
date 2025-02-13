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

    console.log(coupon, uid);
    let happyHoursAvailable = false;

    if (cart && cart.length) {
      // check if cart contains any happy hours products

      for (let i = 0; i < cart.length; i++) {
        const item = cart[i].item;
        if (item.categories && item.categories.length) {
          for (let j = 0; j < item.categories.length; j++) {
            if (item.categories[j]?.toLowerCase() == 'happy hours') {
              happyHoursAvailable = true;
              break;
            }
          }
        }
        if (happyHoursAvailable) break;
      }
    }

    if (happyHoursAvailable)
      return NextResponse.json({
        success: true,
        isValid: false,
        reason: 'hapypy hours included'
      });

    const usedCount = await getCouponsCount(uid, coupon.code);

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
