import { Drawer, Button, Typography, IconButton, List, ListItem, ListItemPrefix,} from "@material-tailwind/react"; 
import {TrashIcon,} from "@heroicons/react/24/solid";
import{MdOutlineDateRange}from 'react-icons/md';
import{HiOutlineHashtag}from 'react-icons/hi';
import Confirm from "../messages/Confirm"
import { useState, useEffect } from "react";
import { db } from "/src/firebase";
import { doc , Timestamp, updateDoc } from "firebase/firestore";




export default function ViewGarbageInfo({ open, onClose, DeleteMethod, Changelocation, bin, binId }) {
  const [maintenanceDate, setMaintenanceDate] = useState(null);
  const [editingMaintenanceDate, setEditingMaintenanceDate] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [editButtonsVisible, setEditButtonsVisible] = useState(false);
  const [changeLocation, setChangeLocation] = useState(true);


  const handleEdit = () => {
    // Toggle the visibility of the buttons when "تعديل معلومات الحاوية" is clicked
    setEditButtonsVisible(!editButtonsVisible);
  };
  const handleDeleteConfirmation = () => setDeleteConfirmation(!deleteConfirmation);
  const handleEditMaintenanceDate = () => { setEditingMaintenanceDate(!editingMaintenanceDate); handleChangeLocation();}
  const handleChangeLocation = () =>  setChangeLocation(!changeLocation);


  // Use a useEffect to set the initial value of maintenanceDate
  useEffect(() => {
    setMaintenanceDate(bin.maintenanceDate ? bin.maintenanceDate.toDate() : null);
  }, [bin.maintenanceDate]);

  const handleMaintenanceDateChange = (e) => {
    // Parse the input value to a Date
    const newDate = new Date(e.target.value);
    setMaintenanceDate(newDate);
  
  };

  const saveMaintenanceDate = async () => {
    try {
      const binRef = doc(db, "garbageBins", binId);
      const maintenanceDateTimestamp = Timestamp.fromDate(maintenanceDate);

      await updateDoc(binRef, {
        maintenanceDate: maintenanceDateTimestamp,
      });

      // Update the local state with the new maintenance date
      bin.maintenanceDate = maintenanceDateTimestamp;

      // Close the maintenance date editing input
      setEditingMaintenanceDate(false);
      handleEditMaintenanceDate();
    } catch (error) {
      console.error("Error updating maintenance date:", error);
    }
  };

  // Convert Firestore Timestamp to JavaScript Date
  const formattedDate = bin.date && bin.date.toDate().toLocaleDateString(); // Format the date
  const formattedMaintenanceDate = maintenanceDate ? maintenanceDate.toLocaleDateString() : 'Not set'; // Format maintenanceDate

  return (
    <>
      <Drawer
        placement="right"
        open={open}
        onClose={onClose}
        className="p-4 font-baloo"
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            <span>معلومات الحاوية</span>
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>

        <List>
          <ListItem ripple={false}>
            <ListItemPrefix>
              <HiOutlineHashtag className="h-5 w-5 ml-2" />
            </ListItemPrefix>
            <div>
              <span className="font-medium">رمز الحاوية:</span>
              <span className="block">{bin.serialNumber}</span> {/* display here the serial number instead of the bin id */}
            </div>
          </ListItem>

          <ListItem ripple={false}>
            <ListItemPrefix>
              <MdOutlineDateRange className="h-5 w-5 ml-2" />
            </ListItemPrefix>
            <div>
              <span className="font-medium"> تاريخ إضافة الحاوية: </span>
              <span className="block"> {formattedDate}</span> {/* Use block to create a line break */}
            </div>
          </ListItem>

          <ListItem ripple={false}>
            <ListItemPrefix>
              <MdOutlineDateRange className="h-5 w-5 ml-2" />
            </ListItemPrefix>
            <div>
              <span className="font-medium">تاريخ أخر صيانة:</span>
              {editingMaintenanceDate ? ( // Conditionally render input or text
                <>
                  <input
                    type="date"
                    value={maintenanceDate ? maintenanceDate.toISOString().substring(0, 10) : ''}
                    onChange={handleMaintenanceDateChange}
                  />
                  <Button
                    size="sm"
                    className=""
                    variant="gradient"
                    style={{ background: '#97B980', color: '#ffffff' }}
                    onClick={saveMaintenanceDate}
                  >
                    <span>حفظ</span>
                  </Button>
                </>
              ) : (
                <span className="block">{formattedMaintenanceDate}</span>
              )}
            </div>
            
          </ListItem>

          <ListItem ripple={false}>
            <ListItemPrefix>
              <TrashIcon className="h-5 w-5 ml-2" />
            </ListItemPrefix>
            <div>
              <span className="font-medium">  نوع الحاوية: </span>
              <span className="block"> {bin.size}</span>
            </div>
          </ListItem>
        </List>

        {editButtonsVisible ? (
          <>
           <div className="flex flex-col gap-2">
         {changeLocation ? ( <Button
              size="md"
              fullWidth={true}
              onClick={() => {Changelocation(binId); handleEdit();} }
              variant="gradient"
              style={{ background: '#97B980', color: '#ffffff' }}
            >
              <span>تعديل موقع الحاوية</span>
            </Button> ): null}
        
            <Button // Button to toggle editing
            size="md"
              fullWidth={true}
              variant="gradient"
              style={{ background: '#97B980', color: '#ffffff' }}
              onClick={handleEditMaintenanceDate}
            >
              <span>{editingMaintenanceDate ? 'إلغاء' : ' تعديل تاريخ الصيانة'}</span>
            </Button>

            {changeLocation ? (  <Button
              size="md"
              fullWidth={true}
              onClick={handleEdit}
              variant="gradient"
              style={{ background: '#979797', color: '#ffffff' }}
            >
              <span>رجوع</span>
            </Button>) : null}
            </div>
          </>
        ) : ( <>
      
         <div className="flex flex-col gap-2">
           <Button
            size="md"
            fullWidth={true}
            onClick={handleEdit}
            variant="gradient"
            style={{ background: '#97B980', color: '#ffffff' }}
          >
            <span>تعديل معلومات الحاوية</span>
          </Button>

<Button size="md" fullWidth={true} variant="gradient" style={{ background: "#FE5500", color: "#ffffff" }} onClick={handleDeleteConfirmation}>
<span>حذف الحاوية </span>
</Button>
</div>
</>
        )}

         

      
        
      </Drawer>

      <Confirm open={deleteConfirmation} handler={handleDeleteConfirmation} method={DeleteMethod} message="   هل انت متأكد من حذف حاوية النفاية بالموقع المحدد؟" />
    </>
  );
}
