/* eslint-disable import/extensions */
import { sendFastOTPSMS } from '@/lib/fast2sms';
import { generateOTP } from '@/lib/utils';
import { createUserForOTPSMS } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, phoneNumber } = await req.json();
    console.log('running send otp post request', apiKey, phoneNumber);
    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_WEB_API_KEY) {
      return NextResponse.json({ success: false, error: 'Invalid Api key' });
    }
    if (!phoneNumber) {
      return NextResponse.json({
        success: false,
        error: 'no phoneNumber provided'
      });
    }
    const OTP = generateOTP(6);
    const data = {
      phoneNumber,
      OTP,
      lastLoginAt: Date.now(),
      expireAt: Date.now() + 15 * 60 * 1000
    };

    const phoneNumberIn = phoneNumber?.replace('91', '');

    const isSent = await sendFastOTPSMS(phoneNumberIn, OTP);
    if (isSent) {
      await createUserForOTPSMS(data);
    }

    console.log(
      `otp ${isSent ? 'Sent' : 'not Sent'} for ${phoneNumber} : ${OTP}`
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
