import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, collection, doc, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

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

// Add Event
const events = collection(db, 'events')
document.getElementById('add-event').addEventListener('submit', async (e) => {
  e.preventDefault()
  toast('Processing...')
  const data = new FormData(e.target)
  let image = await read_image(data.get('image'))
  if (image.length > 10**6) {
    fail('Image too big (greater than 1 mb)')
  } else {
    let event = {
      name: data.get('name'),
      date: data.get('date'),
      desc: data.get('desc'),
      link: data.get('link'),
      stream: data.get('stream'),
      location: data.get('location'),
      address: data.get('address'),
      image: image
    }
    console.log([...data.keys()])
    if (e.submitter && e.submitter.name == "update") {
      $('#card-preview').empty().append(get_card({...event, id: 'preview'}))
    } else {
      toast('Adding Event...')
      try {
        const docRef = await addDoc(events, event)
        succ('Successfully added Event')
        location.reload()
      } catch (e) {
        fail('Something went wrong')
      }
    }
  }
})

// Load Events
toast('Loading Events...')
const query = await getDocs(events)
load_events(query.docs.map(e => ({...e.data(), id: e.id})))

// Event Deletion
$('.delete-event').click(function (e) {
  deleteDoc(doc(events, this.id)).then(ref => {
    succ('Successfully deleted event')
    location.reload()
  }).catch(err => {
    fail('Something went wrong')
  })
})

// Admin Controls
onAuthStateChanged(auth, user => {
  if (user) $('.super').removeClass('super').addClass('super-active')
  else $('.super-active').removeClass('super-active').addClass('super')
})

$('#logout').click(e => {
  auth.signOut()
  succ('Successfully Signed-out')
})