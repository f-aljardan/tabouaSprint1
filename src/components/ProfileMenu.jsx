import { useState } from 'react';
import { Menu, MenuHandler, MenuList, MenuItem, Avatar, Typography, Button, Input } from "@material-tailwind/react";
import userIcon from "/src/assets/userIcon.svg";
import { getAuth, signOut, updatePassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import Confirm from "../components/messages/Confirm";
import Success from "./messages/Success";

export default function ProfileMenu({ userData }) {
  const navigate = useNavigate();
  const [passwordChangeError, setPasswordChangeError] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

  const passwordValidationRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

  const openModal = () => {
    setIsChangingPassword(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setIsChangingPassword(false);
    setModalOpen(false);
    setPasswordChangeError(null);
  };

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleChangePassword = () => {
    openModal();
  };

  const validatePassword = () => {
    if (!passwordValidationRegex.test(newPassword)) {
      setPasswordChangeError(
        'كلمة المرور يجب أن تحتوي على حرف صغير وحرف كبير ورمز ورقم ويجب أن تكون مكونة من 8 أحرف على الأقل.'
      );
      return false;
    } else {
      setPasswordChangeError(null);
      return true;
    }
  };

  const confirmChangePassword = async () => {
    if (newPassword === newPasswordRepeat) {
      if (validatePassword()) {
        const auth = getAuth();
        try {
          await updatePassword(auth.currentUser, newPassword);
          setPasswordChangeError(null);
          setSuccessModalOpen(true); // Open the success modal
          setNewPassword('');
          setNewPasswordRepeat('');
        } catch (error) {
          setPasswordChangeError(error.message);
          console.error('Password change error:', error);
        }
      }
    } else {
      setPasswordChangeError('كلمة المرور غير متطابقة');
    }
  };

  const passwordStrengthIndicator = (
    <div className="text-xs mb-2">
      
      {newPassword !== '' ? (
    passwordValidationRegex.test(newPassword) ? (
      <span className="text-green-600">كلمة المرور تلبي المتطلبات</span>
    ) : (
      <span className="text-red-600">كلمة المرور لا تلبي المتطلبات</span>
    )
  ) : null}
  
     
    </div>
  );

  return (
    <>
      <div className="ProfileMenu flex justify-right px-8">
        <Menu placement="bottom-end">
          <div className="flex justify-center items-center gap-3">
            <MenuHandler>
              <Avatar
                size="md"
                alt="avatar"
                variant="circular"
                className="mt-1 mb-1 cursor-pointer border border-green-500 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30"
                src={userIcon}
              />
            </MenuHandler>
            <div className="flex flex-col items-center text-white">
              <Typography variant="h6">
                <span>{`${userData.firstName} ${userData.lastName}`}</span>
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                <span>{userData.isAdmin ? "مشرف" : "موظف"}</span>
              </Typography>
            </div>
          </div>

          <Button
              className="flex items-center gap-1 h-9"
              size="sm"
              variant="gradient"
              style={{ background: "#FE5500", color: "#ffffff" , marginRight:'78%'  , marginTop:'10px' }}
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
              <span>تسجيل الخروج</span>
            </Button>
          
          
          <MenuList>
            <MenuItem className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span onClick={handleChangePassword}>تغيير كلمة المرور</span>
            </MenuItem>
            <hr className="my-2 border-blue-gray-50" />
            <Button
              className="flex items-center gap-3"
              size="sm"
              fullWidth={true}
              variant="gradient"
              style={{ background: "#FE5500", color: "#ffffff" }}
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
              <span>تسجيل الخروج</span>
            </Button>
          </MenuList>
        </Menu>

        <Dialog size="md" open={isModalOpen} handler={closeModal}>
          <DialogHeader className="font-baloo flex justify-center">تغيير كلمة المرور</DialogHeader>
          <DialogBody divider className="font-baloo text-right">
            <div className="text-right">
              <Typography variant='small' className='mb-5'>
                <span>كلمة المرور يجب أن تكون مكونة من ٨ خانات على الأقل و تشمل حرف كبير ، حرف صغير ، ورمز</span>
              </Typography>
              <Input
                type="password"
                label="كلمة المرور الجديدة"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`block w-full p-2 mb-2 border ${passwordValidationRegex.test(newPassword) ? 'border-green-500' : 'border-red-500'}`}
              />
              {passwordStrengthIndicator}
              <Input
                type="password"
                label="أعد إدخال كلمة المرور"
                required
                value={newPasswordRepeat}
                onChange={(e) => setNewPasswordRepeat(e.target.value)}
                className={`block w-full p-2 mb-2 border ${newPassword === newPasswordRepeat && newPassword.length > 0 ? 'border-green-500' : 'border-red-500'}`}
              />
              {newPassword !== newPasswordRepeat && newPasswordRepeat.length > 0 && (
                <div className="text-xs text-red-600 mb-2">كلمة المرور غير متطابقة</div>
              )}
            </div>
          </DialogBody>
          <DialogFooter className="flex gap-3 justify-center">
            <Button
              variant="gradient"
              onClick={openConfirmationModal}
              style={{ background: "#97B980", color: '#ffffff' }}
              disabled={!newPassword || !newPasswordRepeat || newPassword !== newPasswordRepeat || !passwordValidationRegex.test(newPassword)}
            >
              <span>تأكيد</span>
            </Button>
            <Button
              variant="gradient"
              style={{ background: "#FE5500", color: '#ffffff' }}
              onClick={closeModal}
              className="mr-1"
            >
              <span>إلغاء</span>
            </Button>
          </DialogFooter>
        </Dialog>

        <Confirm
          open={isConfirmationModalOpen}
          handler={closeConfirmationModal}
          method={confirmChangePassword}
          message="هل أنت متأكد من تغيير كلمة المرور؟"
        />

        <Success
          open={isSuccessModalOpen}
          handler={() => setSuccessModalOpen(false)}
          message="تم تغيير كلمة المرور بنجاح"
        />
      </div>
    </>
  );
}
