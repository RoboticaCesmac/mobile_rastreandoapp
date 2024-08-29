// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Adicionando Firestore

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

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app); // Inicializando o Auth
const db = getFirestore(app); // Inicializando o Firestore

export { auth, db };
