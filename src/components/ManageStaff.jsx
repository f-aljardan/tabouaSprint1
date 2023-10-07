
import React, {useState} from "react";
import AddStaff from "./forms/AddStaff.jsx";

import {
    Button,
   
  } from "@material-tailwind/react";


export default function ManageStaff(){

  // to show add staff as popup window

    const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);

    

      const handleAddStaffClick = (formData) => {
        // Handle your form submission logic here
        console.log(formData);
      };
    
      const handleAddStaffDialogOpen = () => {
        setShowAddStaffDialog(true);
      };
    
      const handleAddStaffDialogClose = () => {
        setShowAddStaffDialog(false);
      };

    return(
    <>
    <div> {/* Big div*/}

<div> {/* div for hold all staff*/}
  <div>{/* div for one staff*/}
  </div>
</div>

<div>
{<Button className="float-left" onClick={handleAddStaffDialogOpen} aria-hidden="false" >إضافة مشرف</Button> }
{<AddStaff open={showAddStaffDialog} handler={handleAddStaffDialogClose} method={handleAddStaffClick} />} 
    </div>

    </div>

    </>
    
    );
}
