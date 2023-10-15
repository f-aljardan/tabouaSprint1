
import {
    Card,
    CardBody,
    CardFooter,
    Input,
    Button,
  } from "@material-tailwind/react";
  import logo from "/tabouaNo.png" ;
import { useState } from 'react';
import  { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Footer from "./Footer";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Add state for error

    const navigate = useNavigate();
    const auth = getAuth();
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect the user to the main web page on successful login
        navigate('/mainpage');
      } catch (error) {
        setError('البريد الإلكتروني أو كلمة المرور خاطئة. يرجى التحقق من بياناتك المدخلة ');
        console.error('Login error:', error);
      }
    };




    return (<>
    <div className="loginPage"> 



    <div className="welcome">
    
        <div className="font-baloo text-2xl">  أهلا بك !</div>
        <div className="font-baloo text-4xl font-bold ">سجل الدخول إلى حسابك</div>
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
        {error && <span style={{ color: 'red' }}>{error}</span>} 
        </div>
      </CardBody>
      <CardFooter className="pt-0 font-baloo">
      <div className="mt-4 text-center">
    <button 
      type="button"
      onClick={() => navigate('/forgotpassword')} 
      className="text-blue-500 hover:underline"
    >
      نسيت كلمة السر؟
    </button>
  </div>
        <Button type="submit" variant="gradient" fullWidth style={{background:"#97B980", color:'#ffffff'}} >
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