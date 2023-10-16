import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Input, Button } from '@material-tailwind/react';
import { Link } from 'react-router-dom'; // Import Link to navigate to the login page
import { getAuth, sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth'; // Import necessary Firebase Auth functions
import { auth } from '../firebase'; // Adjust the import path as needed

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);

  const sendPasswordResetEmail = async (e) => {
    e.preventDefault();

    // Send a password reset email to the user's email address
    try {
      const authInstance = getAuth();
      await sendPasswordResetEmail(authInstance, email);
      setIsSent(true); // Email sent successfully
      setError('');
    } catch (error) {
      setError('حدث خطأ أثناء محاولة إرسال البريد الإلكتروني. الرجاء التحقق من البريد الإلكتروني.');
      setMessage('');
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين.');
      setMessage('');
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setError('كلمة المرور يجب أن تحتوي على ما لا يقل عن 8 أحرف وتتضمن أحرف كبيرة وصغيرة وأرقام.');
      setMessage('');
      return;
    }

    try {
      const authInstance = getAuth();
      // Reset the password using Firebase
      await confirmPasswordReset(authInstance, newPassword);
      setMessage('تم إعادة تعيين كلمة المرور بنجاح.');
      setError('');
    } catch (error) {
      setError('حدث خطأ أثناء محاولة إعادة تعيين كلمة المرور. الرجاء المحاولة مرة أخرى.');
      setMessage('');
    }
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className="resetPasswordPage flex flex-col justify-center items-center h-screen">
      {isSent ? (
        // Display the reset password form if the email is successfully sent
        <div className="resetPassword">
          <Card className="w-96">
            <form onSubmit={resetPassword}>
              <CardBody className="flex flex-col gap-1 font-baloo">
                <label htmlFor="newPassword" className="font-semibold text-center mb-2">كلمة المرور الجديدة</label>
                <Input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  size="lg"
                />

                <label htmlFor="confirmPassword" className="font-semibold text-center mb-2">تأكيد كلمة المرور</label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
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
                  <span>إعادة تعيين كلمة المرور</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
          <div className="text-center mt-4">
            <Link to="/login">تسجيل الدخول</Link>
          </div>
        </div>
      ) : (
        // Display the send password reset email form
        <div className="welcome text-center mb-2">
          <div className="font-baloo text-4xl font-bold">نسيت كلمة المرور؟</div>
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
          <div className="text-center mt-4">
            <Link to="/Login">تسجيل الدخول</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;
