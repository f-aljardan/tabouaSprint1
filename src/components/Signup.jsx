
import  { useState } from 'react';
import { db, auth,  }  from "/src/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

// Function to check if email and password exist in Firestore
async function checkCredentials(email, password) {
    const credentialsCollection = collection(db, 'staff');
    const q = query(
      credentialsCollection,
      where('email', '==', email),
      where('password', '==', password)
    );
    const querySnapshot = await getDocs(q);
  
    return !querySnapshot.empty;
  }



  
// Function to handle staff sign-up

async function handleSignUp(email, password) {
    const emailExists = await checkCredentials(email, password);
    if (emailExists) {
      try {
        // Create an authentication user with the provided email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
        // Get the UID of the newly created user
        const user = userCredential.user;
        const uid = user.uid;
  
// Update the Firestore document with the UID
// Assuming you have a collection called 'staff' and a document with the user's email
const staffCollection = collection(db, 'staff');
const q = query(staffCollection, where('email', '==', email));
const querySnapshot = await getDocs(q);

if (!querySnapshot.empty) {
  // Assuming there's only one document with a matching email
  const staffDocRef = querySnapshot.docs[0].ref;
  // Set the 'uid' field in the document
  await setDoc(staffDocRef, { uid }, { merge: true });
} else {
  // Handle the case where no document with the email is found
  console.error('No document found with the provided email.');
}
   // Successful sign-up, you can redirect the user to the main page
        navigate('/');
      } catch (error) {
        console.error('Sign-up error:', error);
      }
    } else {
      // The email and password do not exist, show an error message
      console.error('Email and password do not exist.');
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSignUp(email, password);
  };

    return(<>
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
    </>)
}