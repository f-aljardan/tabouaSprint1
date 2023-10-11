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
  setOpenAddStaff(false);
  handler()
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
  setUpdateClicked(true);
};




  return (
    <>
      
      <Dialog
        open={open}
        size={size || "md"}
       handler={handler}
      >
        <DialogHeader>معلومات المشرف</DialogHeader>
        <DialogBody divider>

         <p> الاسم الأول : {formData.firstName}</p>{'\n'}
         <p>الاسم الأخير : {formData.lastName}</p>{'\n'}
         <p> البريد الإلكتروني : {formData.email}</p>{'\n'}
         <p>الرقم السري : {formData.password}</p>

        </DialogBody>
        <DialogFooter>


        

          <Button
            variant="gradient"
            color="green"
            onClick={handleConfirm}
          >
            <span>تأكيد</span>
          </Button>

          {!updateClicked && (<Button 
            variant="text"
            color="red"
            className="mr-1"
            onClick={handleUpdateClick}
          >
            <span>تعديل</span>
          </Button>

)}
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

{updateClicked && (
        <AddStaff
          open={true}
          handler={handleAddStaffDialogClose}
          data={formData}
        />
      )}
    </>
  );
}

