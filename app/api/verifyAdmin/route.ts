/* eslint-disable import/extensions */
import { fetchUserFromToken } from '@/lib/authHelper';
import { sendFastOTPSMS } from '@/lib/fast2sms';
import { generateOTP } from '@/lib/utils';
import { createUserForOTPSMS } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json('send OTP is up and running');
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey, token } = await req.json();

    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_WEB_API_KEY) {
      return NextResponse.json({ success: false, error: 'Invalid Api key' });
    }
    const user = await fetchUserFromToken(token);

    if (user && user.email) {
      const domain = user.email.split('@')[1];

      if (domain == 'getzing.app' || domain == 'lucidapp.co.in')
        return NextResponse.json({ success: true, user });
    }
    return NextResponse.json({ success: false, user: null });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
