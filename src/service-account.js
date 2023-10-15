//import { initializeApp } from 'firebase-admin/app';
import { Credential  } from 'firebase-admin/app';
import credentials from "../credentials.json";
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase/auth';

//const app = initializeApp(credentials);


const app = admin.initializeApp({

credential: admin.credential.cert(credentials),
});

const adminAuth = getAuth(app);

export{adminAuth};

