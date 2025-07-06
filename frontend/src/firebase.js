// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log(
  "import.meta.env.VITE_FIREBASE_API_KEY",
  import.meta.env.VITE_FIREBASE_API_KEY
);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "promptpix-c4d7e.firebaseapp.com",
  projectId: "promptpix-c4d7e",
  storageBucket: "promptpix-c4d7e.appspot.com",
  messagingSenderId: "349622590058",
  appId: "1:349622590058:web:19bf7f1612eb17a83b0813",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
