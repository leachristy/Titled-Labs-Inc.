// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBHhS9hpMfLr00rsComSVi45v5TsQWCoFg',
  authDomain: 'untilt-db.firebaseapp.com',
  projectId: 'untilt-db',
  storageBucket: 'untilt-db.firebasestorage.app',
  messagingSenderId: '107390636595',
  appId: '1:107390636595:web:edd76d764de6e344d18946',
  measurementId: 'G-T30NTC7G79',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
