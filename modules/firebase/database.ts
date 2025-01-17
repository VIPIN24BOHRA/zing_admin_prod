import * as admin from 'firebase-admin';
import { sanitizePath } from './firebase';
import { UserDetail } from './firebase.types';
import { ProductModel } from '@/lib/models';
import {
  endBefore,
  limitToLast,
  orderByKey,
  query,
  ref
} from 'firebase/database';

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

export const addNewProduct = async (data: ProductModel, id: number) => {
  const db = admin.database();
  const ref = db.ref(sanitizePath(`/testProduct/${id}`));

  try {
    await ref.set(data);
  } catch (err) {
    console.log('error while adding new Product', err);
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

export const getRatingsFromOrderIds = async (
  startId: string,
  endId: string
) => {
  console.log(startId, endId);
  try {
    const db = admin.database();
    const ordersRef = db.ref(sanitizePath('/ratings'));

    const query = ordersRef.orderByKey().startAt(startId).endAt(endId);

    const snapshot = await query.once('value');
    if (snapshot.exists()) return snapshot.val();
    return null;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

export const getOrdersFromDates = async (
  startDate: string,
  endDate: string
) => {
  console.log(`Fetching orders from ${startDate} to ${endDate}`);
  try {
    const db = admin.database();
    const ordersRef = db.ref(sanitizePath('orders/'));

    const query = ordersRef
      .orderByChild('createdAt')
      .startAt(startDate)
      .endAt(endDate);

    const snapshot = await query.once('value');
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([id, value]) => {
        if (typeof value === 'object' && value !== null) {
          return { ...value };
        }
        return { id, value };
      });
    }
    return null;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw new Error('Failed to fetch ratings');
  }
};

export const getOrders = async (offset: string, limit: number) => {
  try {
    const db = admin.database();
    const ordersRef = db.ref(sanitizePath('orders/'));

    const query = ordersRef.orderByKey().endBefore(offset).limitToLast(limit);

    const snapshot = await query.once('value');
    return snapshot.exists() ? snapshot : null;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

export const updateRating = async (
  orderId: string,
  mobileNo: string,
  feedback: string
) => {
  try {
    const db = admin.database();
    const ratingRef = db.ref(
      sanitizePath(`ratings/${orderId}/${mobileNo}/feedback`)
    );

    await ratingRef.set(feedback);
    return true;
  } catch (error) {
    console.error('Error updating rating:', error);
    throw new Error('Failed to fetch orders');
  }
};
