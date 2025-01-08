import * as admin from 'firebase-admin';
import { sanitizePath } from './firebase';
import { UserDetail } from './firebase.types';
import { ProductModel } from '@/lib/models';

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

export const getRatings = async (orderId: string) => {
  const db = admin.database();
  const ref = db.ref(sanitizePath(`/ratings/${orderId}`));
  try {
    const snap = await ref.once('value');
    if (snap.exists()) {
      return snap.val();
    }
  } catch (err) {
    console.log('error while getUserDetails', err);
  }
  return {} as UserDetail;
};

export const addNewProduct = async (data: ProductModel,id:number) => {
 
  const db = admin.database();
  const ref = db.ref(sanitizePath(`/testProduct/${id}`));

  try {
    await ref.set(data);
  } catch (err) {
    console.log('error while adding new Product', err);
  }
};

export const updateProduct = async (id: number, data: ProductModel) => {
  const db = admin.database();
  const ref = db.ref(sanitizePath(`/testProduct/${id}`));

  try {
    await ref.update(data);
  } catch (err) {
    console.log('error while updating Product', err);
  }
};

export const createUserForOTPSMS = async (data: any) => {
  if (!data || !data.phoneNumber || !data.OTP) return;
  const db = admin.database();
  const ref = db.ref(sanitizePath(`/otpVerification/${data.phoneNumber}`));

  try {
    await ref.set(data);
  } catch (err) {
    console.log('error while createUserTokenObj', err);
  }
};

export const getWaUserDetails = async (phoneNumber: string) => {
  const db = admin.database();
  const ref = db.ref(sanitizePath(`/otpVerification/${phoneNumber}`));
  try {
    const snap = await ref.once('value');
    if (snap.exists()) {
      return snap.val();
    }
  } catch (err) {
    console.log('error while getUserDetails', err);
  }
  return {};
};

export const setWaUserDetails = async (userDetails: any) => {
  console.log('this is user details', userDetails);
  if (!userDetails || !userDetails.phoneNumber) return;
  const db = admin.database();
  const ref = db.ref(
    sanitizePath(`/otpVerification/${userDetails.phoneNumber}`)
  );
  try {
    await ref.set(userDetails);
  } catch (err) {
    console.log('error while setUserDetails', err);
  }
};

export const addNewPaymentDeatils = async (payment: any) => {
  if (!payment.merchantTransactionId) return;
  const db = admin.database();
  const ref = db.ref(
    sanitizePath(`/paymentHistory/${payment.merchantTransactionId}`)
  );

  try {
    await ref.set(payment);
  } catch (err) {
    console.log('error while setUserDetails', err);
  }
};
