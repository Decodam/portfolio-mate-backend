import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyChC_XbG089VCo_q-sHjvtOKBKzhwJVMc8",
    authDomain: "portfolio-mate-profile.firebaseapp.com",
    projectId: "portfolio-mate-profile",
    storageBucket: "portfolio-mate-profile.appspot.com",
    messagingSenderId: "528399848288",
    appId: "1:528399848288:web:d184e9e12eed9040544405",
    measurementId: "G-0E0648TBGM"
};
  


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export {db, auth, provider };