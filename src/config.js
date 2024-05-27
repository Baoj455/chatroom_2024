import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBrK36tYiN8nAcU_X6ipkJ9JAh5NhUBrw",
  authDomain: "midterm-ef4fb.firebaseapp.com",
  databaseURL: "https://midterm-ef4fb-default-rtdb.firebaseio.com",
  projectId: "midterm-ef4fb",
  storageBucket: "midterm-ef4fb.appspot.com",
  messagingSenderId: "547125007130",
  appId: "1:547125007130:web:18f75668275d5cd99e52a3",
  measurementId: "G-25QY3MMEMC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const googleAuth = new GoogleAuthProvider(); 