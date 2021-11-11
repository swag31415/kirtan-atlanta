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

// Login Function
document.getElementById('login').addEventListener('submit', e => {
  e.preventDefault()
  const data = new FormData(e.target)
  signInWithEmailAndPassword(auth, data.get('email'), data.get('password')).then(cred => {
    succ('Sucessfully Signed-in')
    document.getElementById('close-login-modal').click()
  }).catch(err => {
    fail('Invalid Login')
  })
})