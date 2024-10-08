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
