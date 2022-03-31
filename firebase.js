// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSKcZXI46cOVqoNxdJoxTfQwK-BCtSrxA",
  authDomain: "tiktok-app-cc060.firebaseapp.com",
  databaseURL: "https://tiktok-app-cc060-default-rtdb.firebaseio.com",
  projectId: "tiktok-app-cc060",
  storageBucket: "tiktok-app-cc060.appspot.com",
  messagingSenderId: "95541763666",
  appId: "1:95541763666:web:ac10b63a48e1c815ac898b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
