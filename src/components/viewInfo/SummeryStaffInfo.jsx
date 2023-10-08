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
 
export default function SummeryStaffInfo({openSummary,handler ,staffData }) {
  const [size, setSize] = React.useState(null);
  //console.log("hellp summery");

  const handleOpen = (value) => setSize(value);
  const [openViewInfo , handleOpeing] = useState(false);
const [update , SetUpdate] = useState(true);
//console.log(firstName , lastName , email , password);
const [openAddStaff, setOpenAddStaff] = useState(false);

const navigate = useNavigate();

const [formData, setFormData] = useState({
  firstName: firstName,
  lastName: lastName,
  email: email,
  password: password,
  isAdmin:false,
});

const handleAddStaffDialogClose = () => {
  setOpenAddStaff(false);
}

const handleConfirm = () => {
  // Perform any necessary actions before confirming
  console.log("inside handleConfirm");

  // Close the dialog
  handler();

  // Navigate to another page if needed
  navigate("/another-page");
};
  return (
    <>
      
      <Dialog
        open={openSummary}
        size={size || "md"}
       handler={handler}
      >
        <DialogHeader>معلومات المشرف</DialogHeader>
        <DialogBody divider>

         <p> الاسم الأول : {staffData.firstName}</p>{'\n'}
         <p>الاسم الأخير : {staffData.lastName}</p>{'\n'}
         <p> البريد الإلكتروني : {staffData.email}</p>{'\n'}
         <p>الرقم السري : {password}</p>

        </DialogBody>
        <DialogFooter>


          <Button
            variant="text"
            color="red"
            className="mr-1"
          >
            <span>تعديل</span>
          </Button>



          <Button
            variant="gradient"
            color="green"
            onClick={handleConfirm}
          >
            <span>تأكيد</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/*}
      {openAddStaff && (
        <AddStaff
          open={openAddStaff}
          handler={handleAddStaffDialogClose}
          formData={{
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
          }}
        />)}
        */}
    </>
  );
}

