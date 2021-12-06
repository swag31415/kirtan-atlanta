import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8naNDlrCDxzlxqDDbwrsoOWS1QkAhN_M",
  authDomain: "kirtan-atlanta.firebaseapp.com",
  projectId: "kirtan-atlanta",
  storageBucket: "kirtan-atlanta.appspot.com",
  messagingSenderId: "875953622458",
  appId: "1:875953622458:web:350be0dc27fd2191dba183",
  measurementId: "G-EGZ8KEP4M4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()
const analytics = getAnalytics(app);

// Login Function
$('#login').submit(e => {
  e.preventDefault()
  const data = new FormData(e.target)
  signInWithEmailAndPassword(auth, data.get('email'), data.get('password')).then(cred => {
    succ('Successfully Signed-in')
    $('#login-modal').modal('close')
  }).catch(err => fail('Invalid Login'))
})

// Preview Handlers
const events = collection(db, 'events')
$('#add-event,#mod-event').change(e => {
  const event = Object.fromEntries(new FormData(e.currentTarget).entries())
  $(e.currentTarget).find('.card-preview').empty().append(get_card({...event, id: 'preview'}))
})
// Add Event
$('#add-event').submit(e => {
  e.preventDefault()
  // This requires everything with a name in the form to be
  // essential, and have the exact same name as what you want
  // in the database
  const event = Object.fromEntries(new FormData(e.target).entries())
  toast('Adding Event...')
  addDoc(events, event).then(ref => {
    succ('Successfully added Event')
    location.reload()
  }).catch(err => fail('Something went wrong'))
})

// Load Events
toast('Loading Events...')
const query = await getDocs(events)
load_events(query.docs.map(e => ({...e.data(), id: e.id})))

// Event Deletion
$('#delete-event').click(function (e) {
  toast('Removing Event...')
  deleteDoc(doc(events, mod_event_id)).then(ref => {
    succ('Successfully deleted event')
    location.reload()
  }).catch(err => fail('Something went wrong'))
})

// Event Modification
var mod_event_id = ''
$('.mod-event').click(function (e) {
  getDoc(doc(events, this.id)).then(doc => {
    prefill($('#mod-event'), doc.data())
    mod_event_id = this.id
    $('#mod-event-modal').modal('open')
  }).catch(err => fail('Something went wrong'))
})
$('#mod-event').submit(e => {
  e.preventDefault()
  toast('Updating Event...')
  const event = Object.fromEntries(new FormData(e.target).entries())
  setDoc(doc(events, mod_event_id), event).then(ref => {
    succ('Modified Event Successfully')
    location.reload()
  }).catch(err => fail('Something went wrong'))
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