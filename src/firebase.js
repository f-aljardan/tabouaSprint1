
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; 


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
const storage = getStorage(app);

export { db, app , auth, storage};

