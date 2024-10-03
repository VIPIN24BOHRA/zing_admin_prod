// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDowwt4XRktF9K_OUQ8-M_HWRIidNBDkfQ',
  authDomain: 'zingclipskart.firebaseapp.com',
  databaseURL: 'https://zingclipskart-default-rtdb.firebaseio.com',
  projectId: 'zingclipskart',
  storageBucket: 'zingclipskart.appspot.com',
  messagingSenderId: '1072267385612',
  appId: '1:1072267385612:web:ad0e76adbf56ad57fe4729',
  measurementId: 'G-XS3369E5DN'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
