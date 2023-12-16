// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBe4ffLcqEEOlYYHXh-q2Ji7zNe1HteCCg",
  authDomain: "dropbox-dba45.firebaseapp.com",
  projectId: "dropbox-dba45",
  storageBucket: "dropbox-dba45.appspot.com",
  messagingSenderId: "1005467634759",
  appId: "1:1005467634759:web:7f00a49bef27008ac67562",
  measurementId: "G-K0P8YSJWWN"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export {db,storage}