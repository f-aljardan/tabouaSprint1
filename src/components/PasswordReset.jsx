import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Input, Button } from '@material-tailwind/react';
import { getAuth , updatePassword } from 'firebase/auth'; // Import necessary Firebase Auth functions
import { doc , updateDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [SuccessMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState(null);
  const [confirmPasswordError , setConfirmPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  
 
  const navigate = useNavigate();


  const handleChangeNewPassword = async(e) => {
      
    setNewPassword(e.target.value);
    setNewPasswordError('');
    setError('');
    setPasswordChangeError(''); 
   };

   const handleChangeConfirmedPassword = async(e) => {
      
    setConfirmPassword(e.target.value);
    setConfirmPasswordError('');
    setError('');
    setPasswordChangeError('');


   };



  const validate = async(e) => {

    if(!newPassword.trim()) {
      setNewPasswordError('الرجاء تعبئة كلمة المرور');
    }
    if(!confirmPassword.trim()) {
      setConfirmPasswordError("الرجاء تعبئة تأكيد كلمة المرور");
    }

    if(newPassword != confirmPassword &&  confirmPassword.trim() && newPassword.trim() ){
      setError("كلمة المرور غير متطابقة");
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    if( newPassword.trim() && confirmPassword.trim() && newPassword === confirmPassword && !passwordRegex.test(newPassword)) {

      setPasswordChangeError(
        'كلمة المرور يجب أن تحتوي على حرف صغير وحرف كبير وحرف خاص ورقم ويجب أن تكون مكونة من 8 أحرف على الأقل.'
      );
    }
  }

  

  const handlePassword = async(e) => {
  e.preventDefault();
  validate();
  
  if(!passwordChangeError && !newPasswordError && !confirmPasswordError && !error ) {
    const auth = getAuth();

    try {
      await updatePassword(auth.currentUser, newPassword);
      setPasswordChangeError('');
      setNewPassword('');
      setConfirmPassword('');
      //setNewPasswordRepeat('');
      setSuccessMessage("تم إعادة تعيين كلمة المرور بنجاح");
      //handleUpdate();
      navigate('/');

        
    } catch (error) {
      console.error('Password change error:', error);
    }
  }



  };





  return (
 
    <>
  
    <div className="flex flex-col items-center justify-center h-screen">
  <div className="welcome">
        
            <div className="font-baloo text-2xl  font-bold text-center">  إعادة تعيين كلمة المرور</div>
  
            <Card className="w-96">
        
        <div className='flex justify-center'>
             </div>
       <form onSubmit={handlePassword}>
       <CardBody className="flex flex-col gap-8 font-baloo">
        
       <Input 
         type="password"
         value={newPassword}
         onChange={handleChangeNewPassword}
  
         autoComplete="current-password"
         required
         label="كلمةالمرور"
          size="lg" />
  
  { newPasswordError&& <span style={{ color: 'red' }}>{newPasswordError}</span>}

         <Input 
         type="password"
         value={confirmPassword}
         onChange={handleChangeConfirmedPassword}
  
         autoComplete="current-password"
         required
         label="تأكيد كلمة المرور"
          size="lg" />
          { confirmPasswordError&& <span style={{ color: 'red' }}>{confirmPasswordError}</span>}

          
                <span variant='small' className='mb-5' style={{fontSize: '0.85rem', marginBottom: '0.5%' }}>كلمة المرور يجب أن تكون مكونة من ٨ خانات على الأقل و تشمل حرف كبير ، حرف صغير ، رمز</span>
         
       
         <div className="-ml-2.5">
         </div>
         { error&& <span style={{ color: 'red' }}>{error}</span>}
         { passwordChangeError&& <span style={{ color: 'red' }}>{passwordChangeError}</span>}
         { SuccessMessage && <span style={{ color: 'green' }}>{SuccessMessage}</span>}


       </CardBody>
       <CardFooter className="pt-0 font-baloo">
     
         <Button type="submit" 
         variant="gradient" 
         fullWidth style={{background:"#97B980", color:'#ffffff'}}
         
         onClick={validate}
         >
  
         <span> إعادة تعيين كلمة المرور</span>
         </Button>

  
       </CardFooter>
       </form>
     </Card>
         </div>
    
    </div>
    
        
  
      
  
  
  
      
    </> 
          
  );
};

export default PasswordReset;
