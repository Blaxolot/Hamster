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
    "blaxolot-hamster-game-default-rtdb.europe-west1.firebasedatabase.app",
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

// Set the page views in the database
database.ref(id).set("");

// Retrieve the number of views from the database
database.ref().on("value", snapshot => {
  var views = snapshot.numChildren();
  console.log("views", views);
  Users_online(views);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState == "hidden") {
    database.ref().child(id).remove();
  } else {
    database.ref(id).set("");
  }
});
