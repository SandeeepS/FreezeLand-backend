import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: "freezeland-79b5a",
  storageBucket: "freezeland-79b5a.appspot.com",
  messagingSenderId: "300479921036",
  appId: "1:300479921036:web:fdcec1210931cc4dc474a9",
  measurementId: "G-LBE33DN4B0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export default app;