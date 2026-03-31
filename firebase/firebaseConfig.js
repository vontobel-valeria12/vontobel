// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importante para o Login
import { getFirestore } from "firebase/firestore"; // Importante para os Produtos
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCgKcReJb60Vj7l3AfdH_MED6dJyLRCW4o",
  authDomain: "kreative-naeharbeiten.firebaseapp.com",
  projectId: "kreative-naeharbeiten",
  storageBucket: "kreative-naeharbeiten.firebasestorage.app",
  messagingSenderId: "272039511432",
  appId: "1:272039511432:web:2dce5cac204b3e0938263d",
  measurementId: "G-WW1Z53XYCY"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as ferramentas que vamos usar nos outros componentes
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;