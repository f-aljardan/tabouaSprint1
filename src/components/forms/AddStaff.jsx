
import { useState , useRef } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import emailjs from 'emailjs-com';


import { db} from "../../firebase";
import { collection, addDoc } from 'firebase/firestore';
import SummeryStaffInfo from "../viewInfo/SummeryStaffInfo";
import "@material-tailwind/react"; 
import Success from "../messages/Success"



export default function AddStaff({open , handler }){
  const [summeryStaffOpen, setSummeryStaffOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);


// handle
  const handleSummeryStaff = () =>setSummeryStaffOpen(!summeryStaffOpen); 
  const handlealert = () => setShowAlert(!showAlert);



  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
   fatherName: '',
  });

  const formRef = useRef();
  const emailRef = useRef();

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    fatherName:'',
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
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = 'اسم الأب مطلوب';
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
     
      handleSummeryStaff();

    }

  };

  const handlerForm = () => {
    // Code to close the dialog or perform other actions
  
    handler();
    // Clear the form fields
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      fatherName:'',
    });
  };

  const sendEmail =  () => {

    const templateParams = {
email: formData.email,
firstName: formData.firstName,
password: formData.password,




    };

    try {
     
      const serviceId = 'service_1voagw3';
      const templateId = 'template_zuh1son';
      const publicKey = 'ZI6WSxhnzAoQ5kF9T';
     const form = formRef.current;
     

      const response =  emailjs.send(serviceId, templateId,templateParams , publicKey);
  
      console.log('Email sent successfully:', response);
    } catch (error) {
      console.error('Email sending error:', error);
    }
  };

 const HandleAddStaff = async()=> { //add to database

  handler();

try{

  // const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
  // const user = userCredential.user;


    const docRef = await addDoc(collection(db, "staff"), {
      // uid: user.uid,
    firstName: formData.firstName,  
    fatherName:formData.fatherName,
    lastName: formData.lastName,   
    email: formData.email, 
   // password: formData.password,
    isAdmin: false,  
  });



    
  handlealert();
  sendEmail();
    setFormData({
      firstName: '',
      fatherName:'',
      lastName: '',
      email: '',
     password:'',
      
      });

      
}catch(error) {
  console.error('Authentication or Database Error:', error);
}

 }


  return (
    <>
    <Dialog open={open} onClose={handler} aria-hidden="true" >
      <form ref={formRef} id='formID'>
        <DialogHeader className="flex justify-center font-baloo text-right">إضافة موظف</DialogHeader>
        <DialogBody divider className="font-baloo text-right">
          <div className="grid gap-3">
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
              <div className="text-red-500 font-bold" >{errors.firstName}</div>
            )}

<Input
              label="اسم الأب"
              type="text"
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              required
            />
            {errors.fatherName && (
              <div className="text-red-500 font-bold" >{errors.fatherName}</div>
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
              ref={emailRef}
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
              autoComplete="current-password"
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

          <Button variant="gradient" onClick={handlerForm} style={{ background: "#FE5500", color: '#ffffff' }}>
            <span aria-hidden="true">إلغاء</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
    
 
   <SummeryStaffInfo
        open={summeryStaffOpen}
        handler={handleSummeryStaff} // Function to close SummeryStaffInfo
        formData={formData} // Pass form data to SummeryStaffInfo
        addMethod={HandleAddStaff}
      />
              <Success open={showAlert} handler={handlealert} message="تم إضافة الموظف بنجاح" />

    </>
  );
}