import { type ClassValue, clsx } from 'clsx';
import {
  getDatabase,
  ref,
  set,
  get,
  orderByChild,
  query,
  equalTo,
  update
} from 'firebase/database';
import { twMerge } from 'tailwind-merge';
import { app } from '@/lib/db';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const updateProductStatus = async (status: string, key: string) => {
  if (!key) return;

  const db = getDatabase(app);

  const orderRef = ref(db, `orders/${key}/status`);
  try {
    await set(orderRef, status);
    return true;
  } catch (err) {
    console.log(`error while updateProductStatus ${err}`);
    return false;
  }
};

export const acceptOrder = async (key: string, orderNo: number) => {
  if (!key) return;

  const db = getDatabase(app);

  const orderRef = ref(db, `orders/${key}`);
  try {
    await update(orderRef, { status: 'ACCEPTED', orderNo: orderNo });
    return true;
  } catch (err) {
    console.log(`error while updateProductStatus ${err}`);
    return false;
  }
};

export const downloadCSV = (csvData: any, fileName = 'orders.csv') => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);

  // Trigger download
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const convertToCSV = (data: any) => {
  if (!data || data.length === 0) return '';

  // parse data here.
  const parsedData = data
    .map((order: any) => {
      return order.cartItems.map((item: any, idx: number) => {
        return {
          createdDate: new Date(order.createdAt).toLocaleDateString(),
          createdTime: new Date(order.createdAt).toLocaleTimeString(),
          coupon: order?.coupon ?? '',
          deliveredIn: order.deliveredAt
            ? (Math.floor(
                (order.deliveredAt - order.createdAt) / (1000 * 60 * 60)
              )
                ? Math.floor(
                    (order.deliveredAt - order.createdAt) / (1000 * 60 * 60)
                  ) + 'h '
                : '') +
              Math.floor(
                ((order.deliveredAt - order.createdAt) % (1000 * 60 * 60)) /
                  (1000 * 60)
              ) +
              'min ' +
              Math.floor(
                ((order.deliveredAt - order.createdAt) % (1000 * 60)) / 1000
              ) +
              'sec '
            : '',
          deliveryFee: order.deliveryFee,
          orderNo: order.orderNo,
          status: order.status,
          totalQuantity: order.cartItems.length,
          phoneNumber: order.uid,
          totalPrice: order.totalPrice,
          discount: order.discount,
          cart: item.item.title,
          quantity: item.quantity,
          address:
            order.address.houseDetails +
            ' , ' +
            (order.address.landmark ? order.address.landmark + ' , ' : '') +
            order.address.title,

          paymentMethod: order.transactionDetails ? 'PAID' : 'CASH'
        };
      });
    })
    .flat();

  const headers = Object.keys(parsedData[0]).join(',');

  // Extract rows
  const rows = parsedData
    .map((row: any) =>
      Object.values(row)
        .map((value) => `"${value}"`) // Escape values
        .join(',')
    )
    .join('\n');

  // Combine headers and rows
  return `${headers}\n${rows}`;
};

export const updateStatusDelivered = async (product: any, key: string) => {
  const db = getDatabase(app);

  if (!key) return;

  const orderRef = ref(db, `orders/${key}`);
  delete product['key'];
  try {
    await set(orderRef, { ...product, status: 'Delivered' });
    return true;
  } catch (err) {
    console.log(`error while updateProductStatus ${err}`);
    return false;
  }
};

export const updateStatusCancelled = async (
  product: any,
  key: string,
  reason: string
) => {
  if (!key) return;
  const db = getDatabase(app);

  const orderRef = ref(db, `orders/${key}`);
  delete product['key'];

  try {
    await set(orderRef, { ...product, status: 'CANCELLED', reason });
    return true;
  } catch (err) {
    console.log(`error while updateProductStatus ${err}`);
    return false;
  }
};

export const updateWalletprice = async (
  walletId: string,
  cashPoint: number
) => {
  if (!walletId) return;
  const db = getDatabase(app);
  const walletRef = ref(db, `wallet/${walletId}/points`);

  try {
    const pointSnapshot = await get(walletRef);
    if (pointSnapshot.exists()) {
      if (pointSnapshot.val() >= 1000) return true;
      else if (pointSnapshot.val() + cashPoint > 1000)
        await set(walletRef, 1000);
      else await set(walletRef, pointSnapshot.val() + cashPoint);
    } else await set(walletRef, cashPoint);
    console.log(`wallet price updated succesfully`);
    return true;
  } catch (err) {
    console.log(`error while updateProductStatus ${err}`);
    return false;
  }
};

export const getTotalOrders = async (uid: string) => {
  const db = getDatabase(app);
  const orderRef = ref(db, `orders/`);
  console.log('total orders is runnig ', uid);
  try {
    const ordersSnapShot = await get(
      query(orderRef, orderByChild('uid'), equalTo(uid))
    );

    if (ordersSnapShot.exists()) {
      return ordersSnapShot.val();
    }
    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getRatings = async (orderId: string) => {
  const db = getDatabase(app);
  const ratingsRef = ref(db, `ratings/${orderId}`);

  try {
    const snap = await get(ratingsRef);
    if (snap.exists()) {
      return snap.val();
    }
  } catch (err) {
    console.log('error while getUserDetails', err);
  }
  return {};
};

export const copyToClipboard = async (content: string) => {
  // Check if the browser supports the clipboard API
  if (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    navigator.clipboard
  ) {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(content);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
    return false;
  }
  return false;
};

export async function sendMessage(
  uid: string,
  apiKey: string,
  title: string,
  body: string,
  data: { title: string }
) {
  const url = 'api/sendMsg'; // The endpoint to send the message

  const payload = {
    uid: uid,
    apiKey: apiKey,
    title: title,
    body: body,
    data: data
  };

  console.log(payload);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Message sent successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

export const generateOTP = (limit: number) => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < limit; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
