// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
// import firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";
// import "firebase/storage";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
// firebase.initializeApp(firebaseConfig);

// init services
// const projectFirestore = firebase.firestore();
// const projectAuth = firebase.auth();
// const projectStorage = firebase.storage();

// export { projectFirestore, projectAuth, projectStorage };

const auth = getAuth(firebaseApp);

export default firebaseApp;
export {db, auth};