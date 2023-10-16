import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Input, Button } from '@material-tailwind/react';
import { getAuth, confirmPasswordReset } from 'firebase/auth'; // Import necessary Firebase Auth functions
import { auth } from '../firebase'; // Adjust the import path as needed

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
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
      const oobCode = window.location.search.split('oobCode=')[1];

      // Reset the password using the Firebase confirmPasswordReset function
      await confirmPasswordReset(authInstance, oobCode, newPassword);
      setMessage('تم إعادة تعيين كلمة المرور بنجاح.');
      setError('');
    } catch (error) {
      setError('حدث خطأ أثناء محاولة إعادة تعيين كلمة المرور. الرجاء المحاولة مرة أخرى.');
      setMessage('');
      console.error('Password reset error:', error);
    }
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className="resetPasswordPage flex flex-col justify-center items-center h-screen" style={{ marginBottom: '0%', marginTop: '-20%' }}>
      <div className="welcome text-center mb-2">
        <div className="font-baloo text-4xl font-bold">إعادة تعيين كلمة المرور</div>
      </div>

      <div className="resetPassword" style={{ marginTop: '-20%' }}>
        <Card className="w-96">
          <form onSubmit={handleResetPassword}>
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
      </div>
    </div>
  );
};

export default PasswordReset;
