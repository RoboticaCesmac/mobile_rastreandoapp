// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importação do Storage

const firebaseConfig = {
  apiKey: "AIzaSyBu4VwzbBEdwxyjQG22ZNDEWv_jHtkmRH4",
  authDomain: "rastreando-app.firebaseapp.com",
  projectId: "rastreando-app",
  storageBucket: "rastreando-app.appspot.com",
  messagingSenderId: "824374445447",
  appId: "1:824374445447:web:5c43bedac9e13877403f22",
  measurementId: "G-88P95B1R5M"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa a autenticação com persistência em React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

auth.languageCode = 'pt';

// Inicializa o Firestore
const db = getFirestore(app);

// Inicializa o Storage
const storage = getStorage(app); // Adição do Storage

export { auth, db, storage };
