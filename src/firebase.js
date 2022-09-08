import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH,
  projectId: process.env.REACT_APP_FIREBASE_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING,
  appId: process.env.REACT_APP_FIREBASE_APP
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Storage & Auth
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);