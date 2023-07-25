import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyABQE9IYTxeII-Y-L7-a7J_7fmgbecV7Vk",
  authDomain: "chat-app-e215f.firebaseapp.com",
  projectId: "chat-app-e215f",
  storageBucket: "chat-app-e215f.appspot.com",
  messagingSenderId: "397328813174",
  appId: "1:397328813174:web:2709b73df23360a5872357",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
