const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "yelpcamp-93f7a.firebaseapp.com",
    projectId: "yelpcamp-93f7a",
    storageBucket: "yelpcamp-93f7a.firebasestorage.app",
    messagingSenderId: "931651142753",
    appId: "1:931651142753:web:2b1a5fa559412bd775d620",
    measurementId: process.env.MEANSUREMENTID
  };
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = {storage}