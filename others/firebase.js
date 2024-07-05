let id = localStorage.getItem("DeviceToken");
if (!id) {
  id = Math.random().toString(36).substring(7);
  localStorage.setItem("DeviceToken", id);
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb5wWE6RUBGf7906Cj0Yt_LqxIvYwFZb0",
  authDomain: "blaxolot-hamster-game.firebaseapp.com",
  databaseURL:
    "https://blaxolot-hamster-game-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "blaxolot-hamster-game",
  storageBucket: "blaxolot-hamster-game.appspot.com",
  messagingSenderId: "1040643858295",
  appId: "1:1040643858295:web:ab61f32313af9de8884b72",
  measurementId: "G-1VJYQLRPR8",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
firebase.analytics(app);
// Get a reference to the Firebase Realtime Database
const database = firebase.database();

database.ref(id).onDisconnect().remove();
window.onbeforeunload = function () {
  database.ref(id).remove();
  console.log("Out...");
};

// Retrieve the number of views from the database
database.ref().on("value", snapshot => {
  var views = snapshot.numChildren();
  Users_online(views);
  console.log("views", views);
});


var eventName;
var visible = true;
var propName = "hidden";
if (propName in document) eventName = "visibilitychange";
else if ((propName = "msHidden") in document) eventName = "msvisibilitychange";
else if ((propName = "mozHidden") in document) eventName = "mozvisibilitychange";
else if ((propName = "webkitHidden") in document) eventName = "webkitvisibilitychange";
if (eventName) document.addEventListener(eventName, handleChange);

if ("onfocusin" in document) document.onfocusin = document.onfocusout = handleChange; // IE 9
window.onpageshow = window.onpagehide = window.onfocus = window.onblur = handleChange;  // Changing tab with alt+tab

// Initialize state if Page Visibility API is supported
if (document[propName] !== undefined) handleChange({ type: document[propName] ? "blur" : "focus" });

function handleChange(evt) {
  evt = evt || window.event;
  if (visible && (["focusout", "pagehide"].includes(evt.type) || (this && this[propName]))) {
    visible = false;
    database.ref(id).remove();
    console.log("Out...");
  }
  else if (!visible && (["focusin", "pageshow"].includes(evt.type) || (this && !this[propName]))) {
    visible = true;
    database.ref(id).set("");
    console.log("In...");
  }
}

// Set the page views in the database
database.ref(id).set("");