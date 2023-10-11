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
 
export default function SummeryStaffInfo({open,handler ,formData }) {
  const [size, setSize] = React.useState(null);
  //console.log("hellp summery");

  const handleOpen = (value) => setSize(value);
  
//console.log(firstName , lastName , email , password);
const [openAddStaff, setOpenAddStaff] = useState(false);
const [updateClicked, setUpdateClicked] = useState(false);
const navigate = useNavigate();


const handleAddStaffDialogClose = () => {
  handler();
  setOpenAddStaff(false);
  updateClicked(false);
}

const handleConfirm = () => {
  // Perform any necessary actions before confirming
  console.log("inside handleConfirm");

  // Close the dialog
  handler();

  // Navigate to another page if needed
  navigate("/another-page");
};


const handleUpdateClick = () => {
  handler();
  setOpenAddStaff(true);
  //setUpdateClicked(true);
};




  return (
    <>
      
      <Dialog
        open={open}
        size={size || "md"}
       handler={handler}
       aria-hidden="true"
      >
        <DialogHeader>معلومات المشرف</DialogHeader>
        <DialogBody divider>

         <p aria-hidden="true"> الاسم الأول : {formData.firstName}</p>{'\n'}
         <p aria-hidden="true">الاسم الأخير : {formData.lastName}</p>{'\n'}
         <p aria-hidden="true"> البريد الإلكتروني : {formData.email}</p>{'\n'}
         <p aria-hidden="true">الرقم السري : {formData.password}</p>

        </DialogBody>
        <DialogFooter>


        

          <Button
            variant="gradient"
            color="green"
            onClick={handleConfirm}
          >
            <span aria-hidden="true">تأكيد</span>
          </Button>

          <Button 
            variant="text"
            color="red"
            className="mr-1"
            onClick={handleUpdateClick}
          >
            <span aria-hidden="true">تعديل</span>
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

{/* Open AddStaff */}
{openAddStaff && (
        <AddStaff
          open={openAddStaff}
          handler={() => setOpenAddStaff(false)} // Close the AddStaff dialog
          data={formData}
        />
      )}
      
    </>
  );
}

