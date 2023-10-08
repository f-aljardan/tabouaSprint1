
import React, {useState} from "react";
import AddStaff from "./forms/AddStaff.jsx";
import SummeryStaffInfo from "./viewInfo/SummeryStaffInfo.jsx";

import {
    Button,
   
  } from "@material-tailwind/react";


export default function ManageStaff(){
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showSummeryDialog, setShowSummeryDialog] = useState(false);
  const [staffData, setStaffData] = useState(null);

  const handleAddStaffClick = (formData) => {
    // Handle your add staff logic here
    console.log(formData);
    setShowAddStaffDialog(false); // Dismiss the AddStaff dialog after adding
    setShowSummeryDialog(true); // Open the SummeryStaffInfo dialog
    setStaffData(formData); // Set the staff data entered in the AddStaff component
  };

  const handleAddStaffDialogOpen = () => {
    setShowAddStaffDialog(true);
    setShowSummeryDialog(false); // Close the SummeryStaffInfo dialog
  };

  const handleAddStaffDialogClose = () => {
    setShowAddStaffDialog(false);
    setShowSummeryDialog(false); // Close the SummeryStaffInfo dialog
  };

  return (
    <>
      <div>
        {/* Big div*/}
        <div>
          {/* div for hold all staff*/}
          <div>{/* div for one staff*/}</div>
        </div>

        <div>
          <Button className="float-left" onClick={handleAddStaffDialogOpen} aria-hidden="false">
            إضافة مشرف
          </Button>
          <AddStaff
            open={showAddStaffDialog}
            handler={handleAddStaffDialogClose}
            method={handleAddStaffClick}
          />
          {showSummeryDialog && staffData && (
            <SummeryStaffInfo
              openSummary={showSummeryDialog}
              handler={() => setShowSummeryDialog(false)}
              staffData={staffData} // Pass the staff data to the SummeryStaffInfo component
            />
          )}
        </div>
      </div>
    </>
  );
}