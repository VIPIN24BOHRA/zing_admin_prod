// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDINk7d_Qfy5i3O7iOMB1zHvncacX-4tZk",
  authDomain: "zingprod-83388.firebaseapp.com",
  databaseURL: "https://zingprod-83388-default-rtdb.firebaseio.com",
  projectId: "zingprod-83388",
  storageBucket: "zingprod-83388.firebasestorage.app",
  messagingSenderId: "140928548403",
  appId: "1:140928548403:web:55c93060c568fac32f6d46",
  measurementId: "G-VH1XH6E1CR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
