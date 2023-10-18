
import  { useState } from 'react';
import { db, auth,  }  from "/src/firebase";
import Footer from "./Footer";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';

import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import logo from "../../public/tabouaNo.png";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Signup(){
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



  const validate = async(e) => {
    setEmailError(null);
    setPasswordError(null);
 
     if (!email.trim()) {
       setEmailError('البريد الإلكتروني مطلوب');
     }else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('صيغة البريد الإلكتروني غير صحيحة') ;
    }
     if (!password.trim()) {
       setPasswordError('كلمة المرور مطلوبة');
     }
 
   };
    return(
    
    
      <>
  
  <div className="flex flex-col items-center justify-center h-screen">
<div className="welcome">
      

          <div className="font-baloo text-2xl  font-bold text-center">  تفعيل الحساب</div>
          <div className="font-baloo text-sm  text-center"> الرجاء التسجيل بالبيانات المرسلة عبر البريد الإلكتروني</div>
 

          <Card className="w-96">
      
      <div className='flex justify-center'>
           <img src={logo} className="h-40 w-40"/>
           </div>
     <form onSubmit={handleSubmit}>
     <CardBody className="flex flex-col gap-8 font-baloo">
       <Input type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             autoComplete="username"
             required
             label="البريدالالكتروني" 
             size="lg" />
       <Input 
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       autoComplete="current-password"
       required
       label="كلمةالمرور"
        size="lg" />
       <div className="-ml-2.5">
       {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
       </div>
     </CardBody>
     <CardFooter className="pt-0 font-baloo">
   
       <Button type="submit" 
       variant="gradient" 
       fullWidth style={{background:"#97B980", color:'#ffffff'}}
       
       onClick={validate}
       >
       <span> تسجيل</span>
       </Button>
     </CardFooter>
     </form>
   </Card>
       </div>
  
  </div>
  
      

    

    


    
  </> 
        );
  

    




} export default Signup;