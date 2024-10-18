/* eslint-disable import/extensions */
import { getUserFCMToken } from 'modules/firebase/database';
import { sendPushNotification } from 'modules/firebase/pushNotification';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, uid, title, body, data } = await req.json();
    console.log(
      'running the post request',
      apiKey,
      uid,
      process.env.NEXT_PUBLIC_WEB_API_KEY
    );
    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_WEB_API_KEY) {
      return NextResponse.json({ success: false, error: 'Invalid Api key' });
    }
    if (!uid) {
      return NextResponse.json({
        success: false,
        error: 'no uid is available'
      });
    }
    const user = await getUserFCMToken(uid);

    await sendPushNotification(user.token, {
      title: title,
      body: body,
      data: { title: data.title }
    });
    console.log('user details', user);
    return NextResponse.json({ user, success: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json('unable to save response');
  }
}
