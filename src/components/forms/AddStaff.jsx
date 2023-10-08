

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
   // const animatedComponents = makeAnimated(); //animating dialog

    //Defulte values for forms
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password:'',
        isAdmin:false,
      });

      const[showSummery, setShowSummery] = useState(false);
      
      console.log("Hello fronAddStaff");
      const[ShowErrorMessage , SetError] = useState(false);

      //Called when user change input fields
      const handleChange = (e) => {
        const { name, value } = e.target;
       // console.log(name , value);
        setFormData({
          ...formData, //copy the exact data before fields
          [name]: value,//add new data updated ,name-> name of varible , Value-> updated value
        });
      };

      const handleSubmit =  (e) => {
        e.preventDefault();
        console.log("hiii sumbit22222");
        // Validate input fields
        if( formData.firstName.trim() === '' ||
        formData.lastName.trim() === '' ||
        formData.email.trim() === '' ||
        formData.password.trim() === '') {
      
          SetError(true);
        }

        else {
          method(formData);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
          });
          SetError(false);
        }
         
        
        
      };
      
      const validate = () =>{
        if (
          formData.firstName.trim() === '' ||
          formData.lastName.trim() === '' ||
          formData.email.trim() === '' ||
          formData.password.trim() === ''
        ) {
         // alert('Please fill in all fields');
         SetError(true);
        }
        else {
          handler();
        }
      };
        
      
      



      
    return(
      //<div aria-hidden="false">
 <Dialog open={open} onClose={handler} aria-hidden="true" > 
             <form onSubmit={handleSubmit} >
             <DialogHeader className="flex justify-center font-baloo text-right">إضافة مشرف</DialogHeader>
             <DialogBody divider className="font-baloo text-right">
             <div className="grid gap-6">
               
             <Input label="الاسم الأول" type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required/>

             <Input label="الاسم الأخير" type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required/>
              
              <Input label="البريد الإلكتروني" type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required/>

             <Input label="الرقم السري" type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required/>


{
  ShowErrorMessage && (
      <p className="text-red-500 font-bold">
        يرجى تعبئة جميع البيانات
      </p>
  )
  
}
             </div>

 
             </DialogBody>

             <DialogFooter className="flex gap-3 justify-center font-baloo text-right">
             <Button type = "submit" variant="gradient" style={{background:"#97B980", color:'#ffffff'}}  onClick={validate}

   >
               <span aria-hidden="true">إضافة</span>
              </Button>
             <Button variant="outlined"  onClick={handler}>
               <span aria-hidden="true">إلغاء</span>
             </Button>

            
             
            
          </DialogFooter>

            </form>

           
          
      
        </Dialog>
    //  </div>
       



    );
}


