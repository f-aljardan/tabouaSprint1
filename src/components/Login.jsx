
import {Card,CardBody, CardFooter, Input, Button,} from "@material-tailwind/react";
import logo from "/src/assets/tabouaNo.png" ;
import { useState } from 'react';
import  { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs , } from 'firebase/firestore';
import { db} from "../firebase";
import { useNavigate } from 'react-router-dom';
import Footer from "./Footer";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState(null); // Add state for error

    const [emailError, setEmailError] = useState(null); // state to email error
    const [passwordError, setPasswordError] = useState(null); // state to  password error

    
    const navigate = useNavigate(); // define user navigation
    const auth = getAuth(); // define authentication function from firebase  


    // validate user inputs
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
 
     
    const handleLogin = async (e) => {

      e.preventDefault();
      const emailExists = await checkEmailExists(email); // check if email exists in firebase

      // if email exist in firebase , call signIn function from firebase to check uf correct email and password
      if(emailExists) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          // Redirect the user to the main web page on successful login
          navigate('/mainpage');
        } catch (error) {
          setError('البريد الإلكتروني أو كلمة المرور خاطئة. يرجى التحقق من بياناتك المدخلة');
          console.error('Login error:', error);
        }
      }
      else{
        setError('لا توجد لك صلاحيات على النظام');

      } 
    };



    // handle email changes
    const handleChangeEmail = async(e) => {
      
       setEmail(e.target.value);
       setEmailError('');
       }


    // handle password chnages
    const handleChangePassword = async (e) => {

      setPassword(e.target.value);
      setPasswordError('');
    }


    // function will check if email exist in database or not
    const checkEmailExists = async (email) => {
      const emailsCollection = collection(db, 'staff'); 
  
      try {
        const querySnapshot = await getDocs(emailsCollection);
  
        return querySnapshot.docs.some((doc) => doc.data().email === email);
      } catch (error) {
        console.error('Error checking email existence:', error);
        return false; // Default to not allowing login if there's an error
      }
    };



    // show login form
    return (<>
    <div className="loginPage"> 

    <div className="welcome">
        <div className="font-baloo text-2xl font-bold">  أهلا بك !</div>
        <div className="font-baloo text-4xl  ">سجل الدخول إلى حسابك</div>
     </div>
        <div className="login">
        <Card className="w-96">
    
       <div className='flex justify-center'>
            <img src={logo} className="h-40 w-40"/>
            </div>
      <form onSubmit={handleLogin}>
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

       
      </CardBody>
      {error && < div style={{ color: 'red'  ,  textAlign: 'right' ,margin:"20px" }}>{error}</div>}

      <CardFooter className="pt-0 font-baloo"
      >
      <div className="mt-4 text-center">
    <button 
      type="button"
      onClick={() => navigate('/forgotpassword')} 
      className="text-blue-500 hover:underline"
    >
      نسيت كلمة المرور؟
    </button>
  </div>
        <Button
         type="submit" variant="gradient" 
         onClick={validate}
         fullWidth style={{background:"#97B980", color:'#ffffff'}} >
        <span>تسجيل الدخول</span>
        </Button>
      </CardFooter>
      </form>
    </Card>
     </div>

     

     </div>
     <Footer/>
     </>

      );

    };
    
    export default Login;