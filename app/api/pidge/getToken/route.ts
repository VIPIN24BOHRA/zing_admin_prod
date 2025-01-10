/* eslint-disable import/extensions */
import { addNewPaymentDeatils } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import { generatePidgeToken, generateRiderToken } from '@/lib/riderHelper';

export async function GET(req: NextRequest) {
  return NextResponse.json(
    `authenticate pidge is up and running ${process.env.PIDGE_USERNAME}`
  );
}

export async function POST(req: NextRequest) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    let token = cookies.pidgeToken; // Assuming JWT is stored in 'token' cookie

    if (!token) {
      token = await generatePidgeToken(
        process.env.PIDGE_USERNAME ?? '',
        process.env.PIDGE_PASSWORD ?? ''
      );

      console.log(token);
      const serializedCookie = cookie.serialize('pidgeToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365,
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
    console.log(token);

    return NextResponse.json({
      success: true,
      message: 'token already present'
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
