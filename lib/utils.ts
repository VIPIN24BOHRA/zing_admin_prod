import { type ClassValue, clsx } from 'clsx';
import { getDatabase, ref, set } from 'firebase/database';
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
