
import React, {useState , useEffect} from "react";
import AddStaff from "./forms/AddStaff.jsx";
import Confirm from "../components/messages/Confirm"
import Success from "./messages/Success";

import {
    Button,
  Card,
  IconButton,
  Typography,
  Tooltip,
  Input,
   
  } from "@material-tailwind/react";
 
  import { UserPlusIcon } from "@heroicons/react/24/solid"

  import { db} from "../firebase";
  import { collection, getDocs , deleteDoc , doc ,  onSnapshot } from 'firebase/firestore';
  import { getAuth, deleteUser } from 'firebase/auth';




export default function ManageStaff(){
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null); // State to store staff member to be deleted
  const [showAlert, setShowAlert] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 





  const handleAddStaff = () => {
    setShowAddStaffDialog(!showAddStaffDialog);
  
  };

  const handlealert = () => setShowAlert(!showAlert);


  const handleConfirm  = async (id) => {
    setShowConfirmAlert(!showConfirmAlert);
    setStaffToDelete(id);
console.log("id = " , id);
  };


  useEffect(() => {
    const staffCollection = collection(db, 'staff');
    const unsubscribe = onSnapshot(staffCollection, (snapshot) => {
      const staffData = [];
  
      snapshot.forEach((doc) => {
        const data = doc.data();
  
        // Check if the 'isAdmin' field is explicitly set to false
        if (data.isAdmin === false) {
          staffData.push({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            id: doc.id,
          });
        }
      });
  
      setStaffMembers(staffData);
    });
  
    // Return the cleanup function to unsubscribe from the listener
    return () => {
      unsubscribe();
    };
  }, []);
  
  const filteredStaff = staffMembers.filter((staffMember) => // Step 2
  `${staffMember.firstName} ${staffMember.lastName}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);

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

    const handleDelete = async (staffMember) =>{

      try {
        // Delete the document from the "staff" collection
        await deleteDoc(doc(db, "staff", staffToDelete));
        // Remove the deleted staff member from the state
        setStaffMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== staffToDelete)
        );
        // Clear the staffToDelete state
        setStaffToDelete(null);
        handlealert();

      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    };
    



  return (
<>

    <div
    
    style={{
       display: "flex",
      flexDirection: "column",
      justifyContent: "center",
       alignItems: "center",
      height: "100vh"
    }}
    
    >

      {/* <div  style={{ display: "flex", alignItems: "start" , justifyContent: "flex-start" }}> */}
<div className="flex  items-start justify-end gap-10">
      <Button
        className="flex items-center gap-3 text-white text-sm"
        size="md"
        onClick={handleAddStaff}
        aria-hidden="false"
        style={{ marginTop: "65px", backgroundColor: "#97B980"}}>
        <span>إضافة موظف</span>
        <UserPlusIcon strokeWidth={2} className="h-5 w-5" />
      </Button>
      
      <AddStaff open={showAddStaffDialog} handler={handleAddStaff} />
     
{/* <div style={{ overflowX: "auto",  maxWidth: "800px",  margin: "0 auto", maxHeight: "90vh",}}> */}
<div style={{ overflowX: "auto",  maxWidth: "800px",  maxHeight: "100vh",}}>

<Card className="max-w-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">قائمة الموظفين</h2> 


 <Input
          type="text"
          label="البحث عن اسم الموظف"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />

<table className="w-full min-w-max table-auto text-left mt-4">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70 text-right"
              >
               <span>الاسم</span> 
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70 text-right"
              >
                <span>البريد الإلكتروني</span>
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
             
            </th>
          </tr>
          
        </thead>
        {/* <tbody>
          {staffMembers.map((staffMember, index) => (
            <tr key={index}>
              <td className="p-4 border-b border-blue-gray-50 text-right">
                <Typography variant="small" color="blue-gray" className="font-normal">
                <span> {`${staffMember.firstName} ${staffMember.lastName}`}</span> 
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-right">
                <Typography variant="small" color="blue-gray" className="font-normal">
                 <span> {`${staffMember.email}`}</span>
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-right">
              <Tooltip content="Delete User">
                      <IconButton variant="text" onClick={() => handleConfirm(staffMember.id)}>
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </IconButton>
                    </Tooltip>
              </td>
            </tr>
          ))}    
        </tbody> */}
        <tbody>
  {filteredStaff.map((staffMember, index) => (
    <tr key={index}>
      <td className="p-4 border-b border-blue-gray-50 text-right">
        <Typography variant="small" color="blue-gray" className="font-normal">
          <span>{`${staffMember.firstName} ${staffMember.lastName}`}</span>
        </Typography>
      </td>
      <td className="p-4 border-b border-blue-gray-50 text-right">
        <Typography variant="small" color="blue-gray" className="font-normal">
          <span>{`${staffMember.email}`}</span>
        </Typography>
      </td>
      <td className="p-4 border-b border-blue-gray-50 text-right">
        <Tooltip content="حذف الموظف"  className="bg-white font-baloo text-md text-gray-600">
          <IconButton variant="text" onClick={() => handleConfirm(staffMember.id)}>
            <TrashIcon className="h-4 w-4 text-red-500" />
          </IconButton>
        </Tooltip>
      </td>
    </tr>
  ))}
</tbody>

      </table>
  
    </Card>
  
    </div>

    </div>
    </div>
    <Confirm open={showConfirmAlert} handler={handleConfirm} method= {handleDelete} message="هل أنت متأكد من حذف الموظف؟" />
              <Success open={showAlert} handler={handlealert} message="تم حذف الموظف بنجاح"/>

</>
    
    
    
    
  );
}