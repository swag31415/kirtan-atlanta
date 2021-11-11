import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

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
const db = getFirestore()

// Login Function
document.getElementById('login').addEventListener('submit', e => {
  e.preventDefault()
  const data = new FormData(e.target)
  signInWithEmailAndPassword(auth, data.get('email'), data.get('password')).then(cred => {
    succ('Successfully Signed-in')
    document.getElementById('close-login-modal').click()
  }).catch(err => {
    fail('Invalid Login')
  })
})

// Admin Controls
onAuthStateChanged(auth, user => {
  if (user) $('.super').show()
  else $('.super').hide()
})

$('#logout').click(e => {
  auth.signOut()
  succ('Successfully Signed-out')
})

// Add Event
const events = collection(db, 'events')
document.getElementById('add-event').addEventListener('submit', async (e) => {
  e.preventDefault()
  toast('Adding Event...')
  const data = new FormData(e.target)
  let image = await read_image(data.get('image'))
  if (image.length > 10**6) {
    fail('Image too big (greater than 1 mb)')
  } else {
    try {
      const docRef = await addDoc(events, {
        name: data.get('name'),
        date: data.get('date'),
        desc: data.get('desc'),
        link: data.get('link'),
        image: image
      })
      succ('Successfully added Event')
    } catch (e) {
      fail('Something went wrong')
    }
  }
})

// Load Events
const query = await getDocs(events)
load_events('upcoming', query.docs.map(e => e.data()))