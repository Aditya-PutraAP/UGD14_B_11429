// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJ1-Xq_nITn1wDEdpLc65WswB6aFXrtMQ",
  authDomain: "pw-firebase-11429.firebaseapp.com",
  projectId: "pw-firebase-11429",
  storageBucket: "pw-firebase-11429.appspot.com",
  messagingSenderId: "724353470888",
  appId: "1:724353470888:web:01c7e2740f8f37c5ba0d9d",
  databaseURL: "https://pw-firebase-11429-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Firebase Auth
const signInProvider = new GoogleAuthProvider();
signInProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
export const auth = getAuth(app);
export default app;

// Firebase Realtime Database
export const db = getDatabase(app);
export const DB_TODO_KEY = 'todos';