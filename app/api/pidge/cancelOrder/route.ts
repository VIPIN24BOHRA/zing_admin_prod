/* eslint-disable import/extensions */
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import { cancelPidgeOrder } from '@/lib/riderHelper';

export async function GET(req: NextRequest) {
  return NextResponse.json('create pidge order is up and running');
}

export async function POST(req: NextRequest) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    let token = cookies.pidgeToken; // Assuming JWT is stored in 'token' cookie

    if (!token) {
      const response = NextResponse.json({
        success: false,
        message: 'not authenticated'
      });
      return response;
    }

    const { id } = await req.json();

    if (!id) {
      const response = NextResponse.json({
        success: false,
        message: 'id not present'
      });
      return response;
    }
    const res = await cancelPidgeOrder(id, token);

    return NextResponse.json({
      success: true,
      result: res
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
