// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//import { initializeApp } from 'firebase/app';
//import { getAuth } from 'firebase/auth';



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB01U8Uql8axosZZxhRixGQGd2UKbOHTY0",
  //apiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk",
  authDomain: "taboua-937dc.firebaseapp.com",
  projectId: "taboua-937dc",
  storageBucket: "taboua-937dc.appspot.com",
  messagingSenderId: "1085521095687",
  appId: "1:1085521095687:web:3d412b59d4aef7f04e4ea2",
  measurementId: "G-XD4LT60ZQZ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, app , auth};

