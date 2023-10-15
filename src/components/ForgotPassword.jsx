import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import { sendPasswordResetEmail } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Footer from "./Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const auth = getAuth();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
      setError('');
    } catch (error) {
      setError('حدث خطأ أثناء محاولة إرسال رابط إعادة تعيين كلمة المرور. الرجاء التحقق من بريدك الإلكتروني.');
      setMessage('');
      console.error('Password reset error:', error);
    }
  };

  return (
    <>
      <div className="forgotPasswordPage">
        <div className="welcome">
          <div className="font-baloo text-4xl font-bold">نسيت كلمة المرور؟</div>
        </div>

        <div className="forgotPassword">
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
      <Footer />
    </>
  );
};

export default ForgotPassword;
