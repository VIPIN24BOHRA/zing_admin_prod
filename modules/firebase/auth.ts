import * as admin from 'firebase-admin';
import { sanitizePath } from './firebase';

export const createCustomToken = async (uid: string) => {
  return await admin.auth().createCustomToken(uid);
};
