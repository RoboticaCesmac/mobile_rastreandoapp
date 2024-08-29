// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);