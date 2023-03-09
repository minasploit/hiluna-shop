// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3wxTSGti72ppr2KIyd8QKyFA53uiNQPU",
  authDomain: "hiluna-shop.firebaseapp.com",
  projectId: "hiluna-shop",
  storageBucket: "hiluna-shop.appspot.com",
  messagingSenderId: "815919065180",
  appId: "1:815919065180:web:3cb04b2c820e5ad30fde99",
  measurementId: "G-MQ2SDJLC09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);