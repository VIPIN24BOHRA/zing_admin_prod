import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getMetadata
} from 'firebase/storage';
import { app } from './db';

export const uploadImage = async (key: string, file: File) => {
  if (!key || !file) return;

  const storage = getStorage(app);
  const imageRef = storageRef(storage, `images/${key}`);

  try {
    try {
      await getMetadata(imageRef);
      console.log(`File with key "${key}" already exists. Replacing it.`);
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.log(`File with key "${key}" does not exist. Uploading it.`);
      } else {
        throw error; 
      }
    }

    await uploadBytes(imageRef, file);
    console.log('File uploaded or replaced successfully.');
  } catch (error) {
    console.error('Error handling file upload or replacement:', error);
  }
};
