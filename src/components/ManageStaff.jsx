
import React, {useState} from "react";
import AddStaff from "./forms/AddStaff.jsx";


import {
    Button,
   
  } from "@material-tailwind/react";


export default function ManageStaff(){
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showSummeryDialog, setShowSummeryDialog] = useState(false);
  const [staffData, setStaffData] = useState(null);
  



  const handleAddStaff = () => {
    setShowAddStaffDialog(!showAddStaffDialog);
  
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
          <Button className="float-left" onClick={handleAddStaff} aria-hidden="false">
            <span>إضافة موظف</span>
          </Button>
          
          <AddStaff
            open={showAddStaffDialog}
            handler={handleAddStaff}  
          />
       
        </div>
      </div>
    </>
  );
}