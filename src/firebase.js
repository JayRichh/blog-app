import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJU3xyfhs2BjzIGmgCZEWLcQTfy_JUf1c",
  authDomain: "blog-app-1169d.firebaseapp.com",
  projectId: "blog-app-1169d",
  storageBucket: "blog-app-1169d.appspot.com",
  messagingSenderId: "624331907171",
  appId: "1:624331907171:web:5d8ba8b1836bfd17cb9856",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };