import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBNoPnaNfQwP7EuYpTRHAPA1diSS_m7tCg",
  authDomain: "moveonotes-fc0b0.firebaseapp.com",
  projectId: "moveonotes-fc0b0",
  storageBucket: "moveonotes-fc0b0.appspot.com",
  messagingSenderId: "74204481350",
  appId: "1:74204481350:web:2e4876cd43073d96b24747",
  measurementId: "G-E2089H112S",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { app, db };
