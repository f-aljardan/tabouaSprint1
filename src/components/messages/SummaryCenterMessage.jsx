import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  img,
  figure,
  figcaption,
  Typography,

} from "@material-tailwind/react";
import dayjs from 'dayjs';
import 'dayjs/locale/ar'; // Import the Arabic locale


export default function SummeryStaffInfo({open, handler ,formData , addMethod,handleEdit }) {

  
const handleConfirm = () => {
  // Perform any necessary actions before confirming
  addMethod();
  handler();
};

 const openingHoursData = formData.openingHours;

 const formattedWeekdaysFrom = dayjs(formData.openingHours.weekdays.from).locale('ar').format(' HH:mm A');
 const formattedWeekdaysTo = dayjs(formData.openingHours.weekdays.to).locale('ar').format('HH:mm A');
 const formattedFriFrom = dayjs(formData.openingHours.fri.from).locale('ar').format(' HH:mm A');
 const formattedFriTo = dayjs(formData.openingHours.fri.to).locale('ar').format('HH:mm A');
 const formattedSatFrom = dayjs(formData.openingHours.sat.from).locale('ar').format(' HH:mm A');
 const formattedSatTo = dayjs(formData.openingHours.sat.to).locale('ar').format('HH:mm A');






  return (
    <>
      
      <Dialog
        open={open}
        size="md"
       handler={handler}
      >
        <DialogHeader><span> معلومات المركز</span></DialogHeader>
        <DialogBody divider className="">
<div className="flex justify-center">

       
        <figure className="relative h-28 w-full">
    <img
     className="h-full w-full rounded-xl object-cover object-center"
      src={formData.logoURL} alt="center image"
    /><figcaption className="absolute top-2 right-2 bg-white bg-opacity-75 py-1 px-2 shadow-md rounded-xl border border-white">
        <Typography variant="small" color="blue-gray">
          <span>شعار المركز</span>
          </Typography>
       </figcaption>
    </figure>
       

      
        <figure className="relative h-28 w-full">
    <img
     className="h-full w-full rounded-xl object-cover object-center"
     src={formData.imageURL} alt="center image"
    /><figcaption className="absolute top-2 right-2 bg-white bg-opacity-75 py-1 px-2 shadow-md rounded-xl border border-white">
        <Typography variant="small" color="blue-gray">
          <span>صورة المركز</span>
          </Typography>
       </figcaption>
    </figure>
       


          
 </div>

        <p  className="pt-2"><span className="font-semibold">إسم المركز:</span> {formData.name}</p>
        <p  className="pt-1"><span className="font-semibold">وصف المركز:</span> {formData.description}</p>
        <p  className="pt-1"><span className="font-semibold">أنواع النفايات المستقبلة:</span>  : {formData.types.join(", ")}</p>
        <p  className="pt-1"><span className="font-semibold">ساعات العمل:</span></p>
        <ul>
        <span>-أيام الاسبوع: من {formattedWeekdaysFrom} إلى {formattedWeekdaysTo}</span>
        {/* <li>أيام الأسبوع: من { formData.openingHours.weekdays.from.toString()} إلى { formData.openingHours.weekdays.to.toString() }</li>  */}
        <li>
          -الجمعة: {openingHoursData.fri.isClosed ? 'مغلق' : `من ${formattedFriFrom} إلى ${formattedFriTo}`}
        </li>
        <li>
          -السبت: {openingHoursData.sat.isClosed ? 'مغلق' : `من ${formattedSatFrom} إلى ${formattedSatTo}`}
        </li>
      </ul>
        <p  className="pt-2"><span className="font-semibold">رقم التواصل:</span> {formData.phoneNo}</p>
        <p  className="pt-1"><span className="font-semibold">رابط الموقع الإلكتروني:</span> <a style={{color:"blue"}} href={formData.websiteURL}>{formData.websiteURL}</a></p>
        </DialogBody>
        <DialogFooter>


        

          <Button
            variant="gradient"
            style={{ background: "#97B980", color: '#ffffff' }}
            onClick={handleConfirm}
          >
            <span aria-hidden="true">تأكيد</span>
          </Button>

          
          <Button 
            variant="text"
            style={{ background: "#FE5500", color: '#ffffff' }}
            className="mr-1"
            onClick={handleEdit}
          >
            <span aria-hidden="true">تعديل</span>
          </Button>


        </DialogFooter>
      </Dialog>



      
    </>
  );
}