import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
 
export default function SummeryStaffInfo({open,firstName , lastName , email, password }) {
  const [size, setSize] = React.useState(null);
  console.log("hellp summery");

  const handleOpen = (value) => setSize(value);
  const [openViewInfo , handleOpeing] = useState(false);

console.log(firstName , lastName , email , password);
 
  return (
    <>
      
      <Dialog
        open={
          /*
          size === "xs" ||
          size === "sm" ||
          size === "md" ||
          size === "lg" ||
          size === "xl" ||
          size === "xxl" ||
          */
          
          open
        }
        size={size || "md"}
        handler={openViewInfo}
      >
        <DialogHeader>معلومات المشرف</DialogHeader>
        <DialogBody divider>

         <p> الاسم الأول : {firstName}</p>{'\n'}
         <p>الاسم الأخير : {lastName}</p>{'\n'}
         <p> البريد الإلكتروني : {email}</p>{'\n'}
         <p>الرقم السري : {password}</p>

        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => handleOpeing(true)}
            className="mr-1"
          >

            
            <span>تعديل</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => handleOpeing(false)}
          >
            <span>تأكيد</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

