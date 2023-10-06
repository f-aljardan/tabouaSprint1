
import React, {useState} from "react";
import AddStaff from "./forms/AddStaff.jsx";
import {
    Button,
   
  } from "@material-tailwind/react";

import "@material-tailwind/react";

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
    
    <div> {/* Big div*/}

<div> {/* div for hold all staff*/}
  <div>{/* div for one staff*/}
  </div>
</div>

<div>
<Button className="float-left" onClick={handleAddStaffDialogOpen} style={{background:"#97B980", color:'#ffffff'} }>إضافة مشرف</Button>
{showAddStaffDialog && <AddStaff open={true} handler={handleAddStaffDialogClose} method={handleAddStaffClick} />}
    </div>

    </div>

    );
}
