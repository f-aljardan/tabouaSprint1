import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Input, Button } from '@material-tailwind/react';
import emailjs from 'emailjs-com'; // Import the EmailJS library

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendPasswordResetEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      user_email: email,
    };
    
    const serviceId = 'service_1voagw3'; // Replace with your EmailJS Service ID
    const templateId = 'template_ozk73zq'; // Replace with your EmailJS Template ID
    const publicKey = 'ZI6WSxhnzAoQ5kF9T'; // Replace with your EmailJS Public Key

    // Use the EmailJS service to send the password reset email
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent:', response);
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
        setError('');
      })
      .catch((error) => {
        console.error('Email send error:', error);
        setError('حدث خطأ أثناء محاولة إرسال رابط إعادة تعيين كلمة المرور. الرجاء التحقق من بريدك الإلكتروني.');
        setMessage('');
      });
  };

  return (
    <div className="forgotPasswordPage flex flex-col justify-center items-center h-screen" style={{ marginBottom: '0%', marginTop: '-20%' }}>
      <div className="welcome text-center mb-2">
        <div className="font-baloo text-4xl font-bold">نسيت كلمة المرور؟</div>
      </div>

      <div className="forgotPassword" style={{ marginTop: '-20%' }}>
        <Card className="w-96">
          <form onSubmit={sendPasswordResetEmail}>
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
