
import  { useState } from 'react';
import { db, auth,  }  from "/src/firebase";
import { collection, query, where, getDocs, setDoc,} from 'firebase/firestore';
import {Card, CardBody, CardFooter, Input, Button,} from "@material-tailwind/react";
import logo from "/src/assets/tabouaNo.png";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Typography } from "@material-tailwind/react";

function Signup(){
    const [email, setEmail] = useState('');// state to store email
    const [password, setPassword] = useState(''); // state to store password
    const [errorMessage, setErrorMessage] = useState('');  // state to show error message
    const [emailError, setEmailError] = useState(null);// state to store email error
    const [passwordError, setPasswordError] = useState(null); // state to store password error
      
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



  
// Function to handle staff sign-up and authicate user
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
        navigate('/PasswordReset');
      } catch (error) {
        console.error('Sign-up error:', error);
      }
    } else {
      // The email and password do not exist, show an error message
      console.error('Email and password do not exist.');
    }
  }
  
  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSignUp(email, password);
  };


// validate user input
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



   // handle user change email
   const handleChangeEmail = async(e) => {
      
    setEmail(e.target.value);
    setEmailError('');
      
   }


   
   // hamdle user change password
   const handleChangePassword = async (e) => {

     setPassword(e.target.value);
     setPasswordError('');
   }

   // show sign up form
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
             onChange={handleChangeEmail}

             autoComplete="username"
             required
             label="البريدالالكتروني" 
             size="lg" />

{emailError && <span style={{ color: 'red' }}>{emailError}</span>}

       <Input 
       type="password"
       value={password}
       onChange={handleChangePassword}

       autoComplete="current-password"
       required
       label="كلمةالمرور"
        size="lg" />
        {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
        <Typography variant='small' className='mb-5' style={{ marginBottom: '0.5%' }}>
                <span>كلمة المرور يجب أن تكون مكونة من ٨ خانات على الأقل و تشمل حرف كبير ، حرف صغير ، رمز</span>
              </Typography>
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

       <span> تفعيل</span>
       </Button>
       <div 
       style= {{marginTop: "50px"}}
       className="font-baloo text-sm  text-center"> قد يستغرق ٦٠ ثانية لتوثيق الحساب</div>

     </CardFooter>
     </form>
   </Card>
       </div>
  
  </div>
  
      

    



    
  </> 
        );
  

    




} export default Signup;