import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Input, Button } from '@material-tailwind/react';
import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth'; // Import necessary Firebase Auth functions
import { auth } from '../firebase'; // Adjust the import path as needed

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      const authInstance = getAuth();

      // Use fetchSignInMethodsForEmail to check if the email exists
      const methods = await fetchSignInMethodsForEmail(authInstance, email);
      console.log('Methods for email:', methods);

      if (methods && methods.length > 0) {
        // User exists, send a password reset email
        await sendPasswordResetEmail(authInstance, email);
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
        setError('');
      } else {
        // User does not exist, show an error message
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
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
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
