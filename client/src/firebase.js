// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-dcc03.firebaseapp.com",
  projectId: "mern-blog-dcc03",
  storageBucket: "mern-blog-dcc03.appspot.com",
  messagingSenderId: "219453643576",
  appId: "1:219453643576:web:f68286cc9b9d69c917ffcd",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
