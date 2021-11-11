import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8naNDlrCDxzlxqDDbwrsoOWS1QkAhN_M",
  authDomain: "kirtan-atlanta.firebaseapp.com",
  projectId: "kirtan-atlanta",
  storageBucket: "kirtan-atlanta.appspot.com",
  messagingSenderId: "875953622458",
  appId: "1:875953622458:web:350be0dc27fd2191dba183"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
