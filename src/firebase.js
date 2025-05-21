// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVuxbmyS6e7Bjk2fKPn9hV97K1vzv3q9s",
  authDomain: "fir-vue-ja.firebaseapp.com",
  projectId: "fir-vue-ja",
  storageBucket: "fir-vue-ja.appspot.com",
  messagingSenderId: "145858606261",
  appId: "1:145858606261:web:39c5819c101b09ab077afc",
  measurementId: "G-9G3X3RBNWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };