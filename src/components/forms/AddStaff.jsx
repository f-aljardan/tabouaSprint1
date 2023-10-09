

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";


import { db , app , auth } from "../../firebase";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import SummeryStaffInfo from "../viewInfo/SummeryStaffInfo";
import "@material-tailwind/react";

import makeAnimated from 'react-select/animated';

export default function AddStaff({open , handler , method }){
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error message when user starts typing
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validate = async(e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'الاسم الأخير مطلوب';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'الرقم السري مطلوب';
    }

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) {
      setErrors(newErrors);
    } else {
      // No errors, you can handle the submission here
      console.log("Form data is valid:", formData);
      handler(); // Close the dialog or perform any other desired action
    }
  };

  return (
    <Dialog open={open} onClose={handler} aria-hidden="true" >
      <form onSubmit={validate}>
        <DialogHeader className="flex justify-center font-baloo text-right">إضافة مشرف</DialogHeader>
        <DialogBody divider className="font-baloo text-right">
          <div className="grid gap-6">
            <Input
              label="الاسم الأول"
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstName && (
              <div className="text-red-500 font-bold">{errors.firstName}</div>
            )}

            <Input
              label="الاسم الأخير"
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {errors.lastName && (
              <div className="text-red-500 font-bold">{errors.lastName}</div>
            )}

            <Input
              label="البريد الإلكتروني"
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <div className="text-red-500 font-bold">{errors.email}</div>
            )}

            <Input
              label="الرقم السري"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <div className="text-red-500 font-bold">{errors.password}</div>
            )}
          </div>
        </DialogBody>

        <DialogFooter className="flex gap-3 justify-center font-baloo text-right">
          <Button type="submit" variant="gradient" style={{ background: "#97B980", color: '#ffffff' }} onClick={validate}>
            <span aria-hidden="true">إضافة</span>
          </Button>
          <Button variant="outlined" onClick={handler}>
            <span aria-hidden="true">إلغاء</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}