import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  getMetadata
} from 'firebase/storage';
import { app } from './db';

export const uploadImage = async (
  key: string,
  file: File
): Promise<string | null> => {
  console.log(key, file);
  if (!key || !file) return null;

  const storage = getStorage(app);
  const imageRef = storageRef(storage, `images/${key}`);

  try {
    await uploadBytes(imageRef, file);
    console.log('File uploaded or replaced successfully.');

    const downloadURL = await getDownloadURL(imageRef);
    console.log('Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error handling file upload or replacement:', error);
    return null;
  }
};
