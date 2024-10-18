import * as admin from 'firebase-admin';
import { PushNotification } from './firebase.types';

export async function sendPushNotification(
  token: string,
  notification: PushNotification
) {
  const message = {
    token: token,
    notification: {
      title: notification.title,
      body: notification.body
    },
    data: notification.data // Optional: Add custom data if needed
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
