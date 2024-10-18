import * as admin from 'firebase-admin';
import { sanitizePath } from './firebase';
import { UserDetail } from './firebase.types';

export const getUserFCMToken = async (uid: string) => {
  const db = admin.database();
  const ref = db.ref(sanitizePath(`/users/${uid}`));
  try {
    const snap = await ref.once('value');
    if (snap.exists()) {
      return snap.val() as UserDetail;
    }
  } catch (err) {
    console.log('error while getUserDetails', err);
  }
  return {} as UserDetail;
};
