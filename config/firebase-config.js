// Import the functions you need from the SDKs you needrr
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu4VwzbBEdwxyjQG22ZNDEWv_jHtkmRH4",
  authDomain: "rastreando-app.firebaseapp.com",
  projectId: "rastreando-app",
  storageBucket: "rastreando-app.appspot.com",
  messagingSenderId: "824374445447",
  appId: "1:824374445447:web:5c43bedac9e13877403f22",
  measurementId: "G-88P95B1R5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
