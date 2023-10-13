import React, { useState } from 'react';
import { Menu, MenuHandler, MenuList, MenuItem, Avatar, Typography, Button } from "@material-tailwind/react";
import userIcon from "/userIcon.svg";
import { getAuth, signOut, updatePassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import Confirm from "../components/messages/Confirm"
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
    setNewPassword('');
    setNewPasswordRepeat('');
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
      setPasswordChangeError('Password must contain at least one small letter, one capital letter, one special character, one number, and be at least 8 characters long.');
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
      {passwordValidationRegex.test(newPassword) ? (
        <span className="text-green-600">Password meets the requirements</span>
      ) : (
        <span className="text-red-600">Password does not meet the requirements</span>
      )}
    </div>
  );

  return (
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Change Password Modal"
        className="w-64 p-4"
      >
        <h2>تغيير كلمة المرور</h2>
        <div className="text-right">
              <button onClick={closeModal} className="absolute top-2 right-2 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <input
                type="password"
                placeholder="كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`block w-full p-2 mb-2 border ${
                  passwordValidationRegex.test(newPassword) ? 'border-green-500' : 'border-red-500'
                }`}
              />
              {passwordStrengthIndicator}
              <input
                type="password"
                placeholder="ادخل كلمة المرور مرة اخرى"
                value={newPasswordRepeat}
                onChange={(e) => setNewPasswordRepeat(e.target.value)}
                className={`block w-full p-2 mb-2 border ${
                  newPassword === newPasswordRepeat && newPassword.length > 0
                    ? 'border-green-500'
                    : 'border-red-500'
                }`}
              />
              {newPassword !== newPasswordRepeat && newPasswordRepeat.length > 0 && (
                <div className="text-xs text-red-600 mb-2">كلمة السر غير متطابقة</div>
              )}
              <div className="flex justify-center">
                <button onClick={openConfirmationModal} className="bg-green-500 text-white p-2">
                  تأكيد
                </button>
              </div>
            </div>
          </Modal>
  
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
      );
  }

          
