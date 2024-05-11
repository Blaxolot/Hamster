let deviceToken = localStorage.getItem("DeviceToken");
if (!deviceToken) {
  deviceToken = Math.random().toString(36).substring(7);
  localStorage.setItem("DeviceToken", deviceToken);
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

count_view(deviceToken);
function count_view(id) {
  // Set the page views in the database
  database.ref("page_views/" + id).set(id);

  // Retrieve the number of views from the database
  database.ref("page_views").on("value", function (snapshot) {
    var views = snapshot.numChildren();
    console.log("hi");
    console.log("views", views);
    Users_online(views);
    if (window.innerWidth <= 500)
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState == "hidden") {
          database.ref("page_views/" + id).remove();
        }
      });
    else {
      window.onbeforeunload = function (e) {
        database.ref("page_views/" + id).remove();
      };
    }
  });
}
