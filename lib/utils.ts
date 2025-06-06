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

export const setOrderReady = async (key: string) => {
  if (!key) return;

  const db = getDatabase(app);

  const orderRef = ref(db, `orders/${key}/kitchen`);
  try {
    await set(orderRef, { status: 'ready', readyAt: Date.now() });
    return true;
  } catch (err) {
    console.log(`error while set Order Ready ${err}`);
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
          customerName: order.name,
          KPT: order?.kitchen?.readyAt
            ? (Math.floor(
                (order?.kitchen?.readyAt - order.createdAt) / (1000 * 60 * 60)
              )
                ? Math.floor(
                    (order?.kitchen?.readyAt - order.createdAt) /
                      (1000 * 60 * 60)
                  ) + 'h '
                : '') +
              Math.floor(
                ((order?.kitchen?.readyAt - order.createdAt) %
                  (1000 * 60 * 60)) /
                  (1000 * 60)
              ) +
              'min ' +
              Math.floor(
                ((order?.kitchen?.readyAt - order.createdAt) % (1000 * 60)) /
                  1000
              ) +
              'sec '
            : '-',
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
          deliverBoy: order?.deliveryBoy?.name ?? '-',
          orderNo: order.orderNo,
          status: order.status,
          totalQuantity: order.cartItems.length,
          phoneNumber: order.uid,
          totalPrice: order.totalPrice,
          discount: order.discount,
          tax: order?.tax ?? 0,
          smallCartFee: order?.smallCartFee ?? 0,

          cart: item.item.title,
          quantity: item.quantity,
          address:
            order.address.houseDetails +
            ' , ' +
            (order.address.landmark ? order.address.landmark + ' , ' : '') +
            order.address.title,

          paymentMethod:
            order.transactionDetails || order.transactionDetail
              ? 'PAID'
              : 'CASH'
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

export const printCard = (order: any) => {
  // Create a temporary iframe
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.top = '-10000px';
  printFrame.style.left = '-10000px';
  document.body.appendChild(printFrame);

  // Add content to the iframe
  const printDoc: any = printFrame.contentWindow || printFrame.contentDocument;
  if (printDoc == null) return;
  const doc = printDoc.document || printDoc;

  doc.open();
  doc.write(`
    <html>
      <head>
        <title></title>
        <style>
          body { font-family: Arial, sans-serif; text-align:center;}
          p {font-size:10px; font-weight: bold; padding:0px; margin:0px; margin-bottom:4px;}
        </style>
      </head>
      <body>
        <p><b>Order No :- ${order.orderNo}</b></p>
   ${order?.cartItems
     ?.map((cItem: any) => {
       return `<p>${cItem?.item?.title} - ${cItem?.quantity}</p>`;
     })
     ?.join('\n')}
      </body>
    </html>
  `);
  doc.close();

  // Trigger print
  printFrame.onload = () => {
    printDoc.print();
    // Remove iframe after printing
    document.body.removeChild(printFrame);
  };
};

export async function createRiderOrder(order: any) {
  console.log(order);
  const res = await fetch('/api/createRiderOrder', {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include' // Ensures cookies are sent with the request
  });
  const result = await res.json();
  console.log(result);
}

export async function createPidgeRiderOrder(order: any) {
  console.log(order);
  const res = await fetch('/api/pidge/createOrder', {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include' // Ensures cookies are sent with the request
  });
  const result = await res.json();
  console.log(result);
}

export async function cancelPidgeRiderOrder(id: string) {
  const res = await fetch('/api/pidge/cancelOrder', {
    method: 'POST',
    body: JSON.stringify({ id }),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include' // Ensures cookies are sent with the request
  });
  const result = await res.json();
  console.log(result);
}

export async function unallocatePidgeRiderOrder(id: string) {
  const res = await fetch('/api/pidge/unallocateOrder', {
    method: 'POST',
    body: JSON.stringify({ id }),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include' // Ensures cookies are sent with the request
  });
  const result = await res.json();
  console.log(result);
}

export const generateId = (limit: number) => {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < limit; i++) {
    code += digits[Math.floor(Math.random() * 10)];
  }
  return code;
};
