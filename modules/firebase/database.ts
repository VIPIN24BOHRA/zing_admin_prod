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
  const ref = db.ref(sanitizePath(`products/${id}`));

  try {
    await ref.set(data);
  } catch (err) {
    console.log('error while adding new Product', err);
  }
};

export const getAllProduct = async () => {
  try {
    const db = admin.database();
    const ordersRef = db.ref(sanitizePath('products/'));

    const query = ordersRef.orderByKey();
    const snapshot = await query.once('value');

    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

export const getAllCategories = async () => {
  try {
    const db = admin.database();
    const ordersRef = db.ref(sanitizePath('/configuration/categories/'));

    const snapshot = await ordersRef.once('value');

    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
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
  startDate: number,
  endDate: number
) => {
  try {
    const db = admin.database();
    const ordersRef = db.ref(sanitizePath('orders/'));

    const query = ordersRef
      .orderByChild('createdAt')
      .startAt(startDate)
      .endAt(endDate);

    const snapshot = await query.once('value');
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
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

export const getPendingOrder = async (pendingOrderId: String) => {
  try {
    const db = admin.database();
    const ordersRef = db.ref(sanitizePath(`pendingOrder/${pendingOrderId}`));

    const snapshot = await ordersRef.once('value');
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error fetching pending order:', error);
    throw new Error('Failed to fetch pending orders');
  }
};

export const getPendingOrderTEST = async (pendingPrderId: String) => {
  try {
    const db = admin.database();
    const ordersRef = db.ref(
      sanitizePath(`testDB/pendingOrder/${pendingPrderId}`)
    );

    const snapshot = await ordersRef.once('value');
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error fetching pending order:', error);
    throw new Error('Failed to fetch pending orders');
  }
};

export const addNewAppliedCoupon = async (uid: string, code: string) => {
  if (uid && code) {
    try {
      console.log('saving applied cupons');
      const db = admin.database();

      const snapshot = await db
        .ref(`appliedCupons/${uid}/${code}`)
        .once('value');

      let count = 0;
      if (snapshot.exists()) {
        count = snapshot.val() ? snapshot.val() : 0;
      }

      await db.ref(`appliedCupons/${uid}/${code}`).set(count + 1);

      return true;
    } catch (err) {
      console.log('error while add applied coupon');
      return false;
    }
  }
  return false;
};

export const createOrder = async (order: any, transactionDetail: any) => {
  try {
    const db = admin.database();

    order.createdAt = Date.now();
    order.transactionDetail = transactionDetail;
    await db.ref('orderCounter').set(admin.database.ServerValue.increment(1));
    const snap = await db.ref('orderCounter').get();
    const orderCount = snap.val();
    order.orderNo = orderCount;

    await db.ref('orders').push().set(order);
    await addNewAppliedCoupon(order.uid, order.coupon);
  } catch (error) {
    console.error('Error fetching pending order:', error);
    throw new Error('Failed to fetch pending orders');
  }
};

export const savePaymentDetails = async (paymentDetails: any) => {
  try {
    const db = admin.database();

    await db
      .ref(`payment/cashfree/${paymentDetails.order.order_id}`)
      .set(paymentDetails);
  } catch (error) {
    console.error('Error fetching pending order:', error);
  }
};

export const addNewAppliedCouponTEST = async (uid: string, code: string) => {
  console.log('addNewAppliedCouponTEST', uid, code);
  if (uid && code) {
    try {
      console.log('saving applied cupons');
      const db = admin.database();

      const snapshot = await db
        .ref(`testDB/appliedCupons/${uid}/${code}`)
        .once('value');

      let count = 0;
      if (snapshot.exists()) {
        count = snapshot.val() ? snapshot.val() : 0;
      }
      console.log(count);
      await db.ref(`testDB/appliedCupons/${uid}/${code}`).set(count + 1);

      return true;
    } catch (err) {
      console.log('error while add applied coupon');
      return false;
    }
  }
  return false;
};

export const createOrderTEST = async (order: any, transactionDetail: any) => {
  try {
    const db = admin.database();

    order.createdAt = Date.now();
    order.transactionDetail = transactionDetail;
    await db
      .ref('testDB/orderCounter')
      .set(admin.database.ServerValue.increment(1));
    const snap = await db.ref('testDB/orderCounter').get();
    const orderCount = snap.val();
    order.orderNo = orderCount;

    await db.ref('testDB/orders').push().set(order);
    await addNewAppliedCouponTEST(order.uid, order.coupon);
  } catch (error) {
    console.error('Error fetching pending order:', error);
    throw new Error('Failed to fetch pending orders');
  }
};

export const savePaymentDetailsTEST = async (paymentDetails: any) => {
  try {
    const db = admin.database();

    await db
      .ref(`testDB/payment/cashfree/${paymentDetails.order.order_id}`)
      .set(paymentDetails);
  } catch (error) {
    console.error('Error fetching pending order:', error);
  }
};

export const getCouponsCount = async (uid: string, code: string) => {
  if (!uid || !code) return null;
  try {
    const db = admin.database();
    const snapshot = await db.ref(`appliedCupons/${uid}/${code}`).once('value');
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return 0;
  } catch (err) {
    console.log(err);
    return 0;
  }
};
