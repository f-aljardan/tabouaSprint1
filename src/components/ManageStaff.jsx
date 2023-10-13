
import React, {useState , useEffect} from "react";
import AddStaff from "./forms/AddStaff.jsx";


import {
    Button,
    List,
  ListItem,
  ListItemSuffix,
  Card,
  IconButton,
   
  } from "@material-tailwind/react";
  import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
  } from "@heroicons/react/24/outline";
  import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid"

  import { db} from "../firebase";
  import { collection, getDocs , deleteDoc , doc } from 'firebase/firestore';




export default function ManageStaff(){
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  //const [showSummeryDialog, setShowSummeryDialog] = useState(false);
  const [staff, setStaff] = useState([]);


  // Function to fetch staff data from Firebase
  const fetchStaffData = async () => {
    try {
      // Get the staff collection from Firestore
      const staffCollection = collection(db, "staff");
      const staffSnapshot = await getDocs(staffCollection);

      const staffData = [];
      staffSnapshot.forEach((doc) => {
        staffData.push({ id: doc.id, ...doc.data() });
      });

      setStaff(staffData);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };


  const handleAddStaff = () => {
    setShowAddStaffDialog(!showAddStaffDialog);
    
  
  };

  useEffect(() => {
    // Fetch staff data when the component mounts
    fetchStaffData();
  }, []);

  
  function TrashIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="red"
        className="h-5 w-5"
        style={{ width: "1.5rem", height: "1.5rem" }} 
      >
        <path
          fillRule="evenodd"
          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <>
      <div>
        {/* Big div*/}
       

        <div>
          <Button className="flex items-center gap-3 bg-green-500 text-white" size="sm" 
          
          onClick={handleAddStaff} aria-hidden="false">
            <span>إضافة موظف</span>
            <UserPlusIcon strokeWidth={2} className="h-4 w-4" />
          </Button>
          
          <AddStaff
            open={showAddStaffDialog}
            handler={handleAddStaff}  
          />
       
        </div>
<div 

style={{
  display: "flex",
  justifyContent: "center", // Center horizontally
  alignItems: "center", // Center vertically
  height: "100vh", // Use the full viewport height
}}
>

<Card className="w-full md:w-1/2 lg:w-2/3 xl:w-3/4 p-2 m-4">
        <List>
          {staff.map((staffMember) => (
<ListItem key={staffMember.id} className="py-1 pr-1 pl-4">
<div className="flex justify-between items-center">

<div className="text-right mr-4" style={{ width: '250px' }}>
{`${staffMember.firstName} ${staffMember.lastName}`}

</div>

<div className="text-right mr-4" style={{ width: '450px' }}>
{`${staffMember.email}`}

</div>
<ListItemSuffix>
  <IconButton
    variant="text"
    className="ml-4"
    color="red"
    onClick={() => handleDeleteStaff(staffMember.id)}
  >
    <TrashIcon />
  </IconButton>
</ListItemSuffix>
</div>

</ListItem>
            
          ))}
        </List>
      </Card>
</div>
        
      </div>
    </>
  );
}