import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Input, Button } from '@material-tailwind/react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, where, query, getDocs } from 'firebase/firestore';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  


  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Check if the email is empty
  if (!newEmail.trim()) {
    setError(''); 
    return;
  }

 // Check the email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('صيغة البريد الإلكتروني غير صحيحة');
      return ;
    } else {
      setError('');
    }
  };



  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return;
    } else {
      setError('');
    }

   
    
    
    try {

      const authInstance = getAuth();
      const db = getFirestore();

      // Create a reference to the "staff" collection
      const staffRef = collection(db, 'staff');

      // Create a query to check if the email exists in the "staff" collection
      const emailQuery = query(staffRef, where('email', '==', email));

      // Execute the query
      const querySnapshot = await getDocs(emailQuery);

      if (querySnapshot.size > 0) {
        // User email exists in the "staff" collection, send a password reset email
        await sendPasswordResetEmail(authInstance, email);
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
        setError('');
      } else {
        // User email not found in the "staff" collection, show an error message
        setError('البريد الإلكتروني غير مسجل. الرجاء التحقق من البريد الإلكتروني.');
        setMessage('');
      }
    } catch (error) {
      setError('حدث خطأ أثناء محاولة إرسال رابط إعادة تعيين كلمة المرور. الرجاء التحقق من بريدك الإلكتروني.');
      setMessage('');
      console.error('Password reset error:', error);
    }
  };

  return (
    <div className="forgotPasswordPage flex flex-col justify-center items-center h-screen" style={{ marginBottom: '0%', marginTop: '-20%' }}>
      <div className="welcome text-center mb-2">
        <div className="font-baloo text-4xl font-bold">نسيت كلمة المرور؟</div>
      </div>

      <div className="forgotPassword" style={{ marginTop: '-20%' }}>
        <Card className="w-96">
          <form onSubmit={handlePasswordReset}>
            <CardBody className="flex flex-col gap-1 font-baloo">
              <label htmlFor="email" className="font-semibold text-center mb-2">البريد الإلكتروني</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="username"
                size="lg"
              />
              {message && <span style={{ color: 'green' }}>{message}</span>}
              {error && <span style={{ color: 'red' }}>{error}</span>}
            </CardBody>
            <CardFooter className="pt-0 font-baloo">
              <Button
                type="submit"
                variant="gradient"
                fullWidth
                style={{ background: '#97B980', color: '#ffffff' }}
              >
                <span>إرسال رابط إعادة تعيين كلمة المرور</span>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
