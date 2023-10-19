import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

 
export default function SummeryStaffInfo({open, handler ,formData , addMethod }) {

  
const handleConfirm = () => {
  // Perform any necessary actions before confirming
  addMethod();
  handler();
};







  return (
    <>
      
      <Dialog
        open={open}
        size="md"
       handler={handler}
       aria-hidden="true"
      >
        <DialogHeader><span>بيانات الموظف</span></DialogHeader>
        <DialogBody divider>

         <p aria-hidden="true"> الاسم الأول : {formData.firstName}</p>{'\n'}
         <p aria-hidden="true"> اسم الأب : {formData.fatherName}</p>{'\n'}
         <p aria-hidden="true">الاسم الأخير : {formData.lastName}</p>{'\n'}
         <p aria-hidden="true"> البريد الإلكتروني : {formData.email}</p>{'\n'}

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
            onClick={handler}
          >
            <span aria-hidden="true">تعديل</span>
          </Button>


        </DialogFooter>
      </Dialog>



      
    </>
  );
}

