var firebase=require('./firebase/firebase.js');

var config = {
    apiKey: "AIzaSyA7WlsfVFuYR7xgR-5jPJRxuclqZ5Beu9Y",
    authDomain: "graffix-app.firebaseapp.com",
    databaseURL: "https://graffix-app.firebaseio.com",
    projectId: "graffix-app",
    storageBucket: "graffix-app.appspot.com",
    messagingSenderId: "313641261333"
  };
  firebase.initializeApp(config);
