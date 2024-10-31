import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getDatabase} from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCvhE7sEDCw9a4gOL8QH0GH-iEn1a4efEI",
  authDomain: "auth-a6c0c.firebaseapp.com",
  projectId: "auth-a6c0c",
  storageBucket: "auth-a6c0c.appspot.com",
  messagingSenderId: "994124748045",
  appId: "1:994124748045:web:5143b011ca6c0917824c44",
  measurementId: "G-TSCK7FNKGL"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getDatabase(app)
export const GoogleProvider = new GoogleAuthProvider();
