/* eslint-disable import/extensions */
import { addNewPaymentDeatils } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json('webhook is up and running');
}

export async function POST(req: NextRequest) {
  try {
    const { type, order_id, event, data, track_url, order_url } =
      await req.json();

    console.log(type, order_id, event, data, track_url, order_url);

    return NextResponse.json({
      success: true
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
