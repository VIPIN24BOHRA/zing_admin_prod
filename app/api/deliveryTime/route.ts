/* eslint-disable import/extensions */

import { createTestPaymentSession, getETA } from '@/lib/riderHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json(
    `delivery time is up and running ${process.env.GOOGLE_MAPS_API_KEY?.substring(0, 3)}`
  );
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey, origin, destination } = await req.json();
    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_WEB_API_KEY) {
      return NextResponse.json({ success: false, error: 'Invalid Api key' });
    }
    if (
      !origin ||
      !destination ||
      !origin?.lat ||
      !origin?.lng ||
      !destination?.lat ||
      !destination?.lng
    ) {
      return NextResponse.json({
        success: false,
        error: 'required fields are missing'
      });
    }
    console.log(origin, destination);

    const response = await getETA(origin, destination);
    console.log(response);

    return NextResponse.json({
      success: response ? true : false,
      result: response
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
