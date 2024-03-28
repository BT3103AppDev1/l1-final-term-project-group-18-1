// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
// import firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";
// import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNI5dmL0HAbDVZvKP3tz7LJLzUX9gpVn4",
  authDomain: "bt3103-f3486.firebaseapp.com",
  projectId: "bt3103-f3486",
  storageBucket: "bt3103-f3486.appspot.com",
  messagingSenderId: "418474568916",
  appId: "1:418474568916:web:7f13a8b66c5f5896d35f41"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
// firebase.initializeApp(firebaseConfig);

// init services
// const projectFirestore = firebase.firestore();
// const projectAuth = firebase.auth();
// const projectStorage = firebase.storage();

// export { projectFirestore, projectAuth, projectStorage };


export default firebaseApp;
export {db};