import { type ClassValue, clsx } from 'clsx';
import { getDatabase, ref, set, get } from 'firebase/database';
import { twMerge } from 'tailwind-merge';
import { app } from '@/lib/db';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const updateProductStatus = async (
  product: any,
  status: string,
  key: string
) => {
  const db = getDatabase(app);
  const orderRef = ref(db, `orders/${key}`);

  const updatedProduct = { ...product, status };

  delete updatedProduct.key;

  try {
    await set(orderRef, updatedProduct);
    return true;
  } catch (err) {
    console.log(`error while updateProductStatus ${err}`);
    return false;
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
