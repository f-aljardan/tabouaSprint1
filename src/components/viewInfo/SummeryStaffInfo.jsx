import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import AddStaff from "../forms/AddStaff";
import {useNavigate} from "react-router-dom"
 
export default function SummeryStaffInfo({openWindow,firstName , lastName , email, password  ,handler }) {
  const [size, setSize] = React.useState(null);
  //console.log("hellp summery");

  const handleOpen = (value) => setSize(value);
  const [openViewInfo , handleOpeing] = useState(false);
const [update , SetUpdate] = useState(true);
//console.log(firstName , lastName , email , password);
 

const navigate = useNavigate();
const onUpdate  =() => {
console.log("inside addstaf");

};

const handleAddStaffDialogClose = () => {
  SetUpdate(false);
};
  return (
    <>
      
      <Dialog
        open={openWindow}
        size={size || "md"}
       handler={handler}
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
            onClick={() => <AddStaff open={openWindow} handler={handler}></AddStaff>}
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

