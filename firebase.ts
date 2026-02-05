
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { initializeApp } from "firebase/app";
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { getFirestore } from "firebase/firestore";
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { getAuth } from "firebase/auth";
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCT6aWbxSyIguiyaPiBeC3prmLWv8YOo30",
  authDomain: "maotuitui-love.firebaseapp.com",
  projectId: "maotuitui-love",
  storageBucket: "maotuitui-love.firebasestorage.app",
  messagingSenderId: "351013520325",
  appId: "1:351013520325:web:8973b2a9c0f75cc79f01ac",
  measurementId: "G-D9EBK9130B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
