// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
// import firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";
// import "firebase/storage";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
// firebase.initializeApp(firebaseConfig);

// init services
// const projectFirestore = firebase.firestore();
// const projectAuth = firebase.auth();
// const projectStorage = firebase.storage();

// export { projectFirestore, projectAuth, projectStorage };

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { db };

export default firebaseApp;

export { auth };

