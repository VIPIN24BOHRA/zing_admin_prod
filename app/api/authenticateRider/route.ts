/* eslint-disable import/extensions */
import { addNewPaymentDeatils } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import { generateRiderToken } from '@/lib/riderHelper';

export async function GET(req: NextRequest) {
  return NextResponse.json(
    `authenticate rider is up and running ${process.env.RIDER_BRAND_KEY}`
  );
}

export async function POST(req: NextRequest) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    let token = cookies.token; // Assuming JWT is stored in 'token' cookie

    if (!token) {
      token = await generateRiderToken(
        process.env.RIDER_ACCESS_KEY ?? '',
        process.env.RIDER_SECRET_KEY ?? ''
      );

      const serializedCookie = cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365, // 1 day expiration
        path: '/'
      });
      // Return response with Set-Cookie header
      const response = NextResponse.json({
        success: true,
        message: 'Token set in cookie'
      });

      response.headers.set('Set-Cookie', serializedCookie);
      return response;
    }

    return NextResponse.json({
      success: true
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
