
import {useState , useEffect} from "react";
import AddStaff from "../utilityComponents/forms/AddStaff.jsx";
import Confirm from "../utilityComponents/messages/Confirm.jsx"
import Success from "../utilityComponents/messages/Success.jsx";
import {Button,Card,IconButton,Typography,Tooltip,Input,} from "@material-tailwind/react";
import { UserPlusIcon } from "@heroicons/react/24/solid"
import { db} from "../../firebase.js";
import { collection,  deleteDoc , doc ,  onSnapshot  , updateDoc} from 'firebase/firestore';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function ManageStaff(){
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false); // state to show add staff form
  const [showConfirmAlert, setShowConfirmAlert] = useState(false); // state to show confirm alert 
  const [staffToDelete, setStaffToDelete] = useState(null); // State to store staff member to be deleted
  const [showAlert, setShowAlert] = useState(false); // state to show success message
  const [staffMembers, setStaffMembers] = useState([]); // to store staff infromation
  const [searchTerm, setSearchTerm] = useState(""); // state to search staff name
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedStaffData, setEditedStaffData] = useState({
    id: null,
    firstName: '',
    fatherName: '',
    lastName: '',
    email: '',
  });
const [errors, setErrors] = useState({});


  //change state of add staff form
  const handleAddStaff = () => {
    setShowAddStaffDialog(!showAddStaffDialog);
  
  };
  // change state of sucess message
  const handlealert = () => setShowAlert(!showAlert);

//change comfiram message state and store staff id to delete
  const handleConfirm  = async (id) => {
    setShowConfirmAlert(!showConfirmAlert);
    setStaffToDelete(id);
  };


  // get all staff infromation from database except admins
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
            fatherName: data.fatherName,
            lastName: data.lastName,
            email: data.email,
            id: doc.id,
          });
        }
      });
  
      setStaffMembers(staffData);// store staff information
    });
  
    // Return the cleanup function to unsubscribe from the listener
    return () => {
      unsubscribe();
    };

  }, []);
  
  // Define filteredStaff here before using , search by first name , father name , last name 
  const filteredStaff = staffMembers.filter((staffMember) =>
    `${staffMember.firstName} ${staffMember.fatherName} ${staffMember.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );


  const handleEdit = (id , email , firstName , lastName , fatherName) => {
    setEditedStaffData({
      id: id,
      firstName: firstName,
      fatherName: fatherName,
      lastName: lastName,
      email: email,
    });
    setIsEditMode(true);

  }


  const handleEditChange = (e) => {
    const { name, value } = e.target;
  
    setEditedStaffData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const handleSaveEdit = async () => {
    // Initialize errors object
    const newErrors = {};
  
    // Validate each field
    if (editedStaffData.firstName.trim() === '') {
      newErrors.firstName = 'يرجى إدخال الاسم الأول.';
    }
  
    if (editedStaffData.fatherName.trim() === '') {
      newErrors.fatherName = 'يرجى إدخال اسم الأب.';
    }
  
    if (editedStaffData.lastName.trim() === '') {
      newErrors.lastName = 'يرجى إدخال اسم العائلة.';
    }
  
    if (editedStaffData.email.trim() === '') {
      newErrors.email = 'يرجى إدخال البريد الإلكتروني.';
    }
    else if (!/^\S+@\S+\.\S+$/.test(editedStaffData.email)){
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة.';

    }
  
    // Update the state with errors using the callback function
    setErrors(newErrors);
      // Check if any field has an error message
      if (Object.values(newErrors).some((error) => error.trim() !== '')) {
        // At least one field is empty, do not proceed with the update
        console.log('Update blocked due to errors.');
        return;
      }
  
  
      // Create a reference to the staff member's document in the database
      const staffDocRef = doc(db, 'staff', editedStaffData.id);
  
      // Prepare the data to be updated
      const updatedData = {
        firstName: editedStaffData.firstName,
        fatherName: editedStaffData.fatherName,
        lastName: editedStaffData.lastName,
        email: editedStaffData.email,
      };
  
      try {
        // Update the document with the new data
        updateDoc(staffDocRef, updatedData);
  
        // Exit edit mode and clear the edited data
        setIsEditMode(false);
        setEditedStaffData({
          id: null,
          firstName: '',
          fatherName: '',
          lastName: '',
          email: '',
        });

  
      } catch (error) {
        console.error('Error updating document: ', error);
      }
  };
  


// define trash icon for delete staff
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


    function PenIcon() {
return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
</svg>

)
    

    }



    // handle delete staff from database
    const handleDeleteStaff = async () =>{

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
    


    
    // to show staff information table
  return (
<>
    <div
    
    style={{
       display: "flex",
      flexDirection: "column",
      justifyContent: "center",
       alignItems: "center",
     
    }}
    className="m-5"
    >

<div className="flex  items-start justify-end gap-10 ">
     
 <AddStaff open={showAddStaffDialog} handler={handleAddStaff} />
     
<div style={{ overflowX: "auto",   maxHeight: "110vh",}}>

<Card className="max-w-2xl p-8   "> 
        <h2 className="text-2xl font-semibold mb-4">قائمة الموظفين</h2> 

       
       
        {/* button to show add staff form */}
        <Button
        className="flex items-center gap-3 text-white text-sm"
        size="md"
        onClick={handleAddStaff}
        aria-hidden="false"
        style={{ marginTop: "50px", backgroundColor: "#97B980" ,  marginBottom: "25px"}}>
        <span>إضافة موظف</span>
        <UserPlusIcon strokeWidth={2} className="h-5 w-5" />
      </Button>
     
     
     
      {/* input to add staff name for search */}
       <Input
          type="text"
         icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          placeholder= "البحث عن اسم الموظف"
          className="custom-placeholder"
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
                component={'span'}
              >
               <span>الاسم</span> 
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70 text-right"
                component={'span'}
              >
                <span>البريد الإلكتروني</span>
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
            >
            </th>

            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
            >   
            </th>
          </tr>
          
        </thead>
        
        <tbody>
        {filteredStaff.length > 0 ? (
  filteredStaff.map((staffMember, index) => (
    <tr key={index}>
      <td className="p-4 border-b border-blue-gray-50 text-right">
          {isEditMode && editedStaffData.id === `${staffMember.id}` ? (
          
            <>
            <div className="mb-2">
              
            </div>
              <Input
                type="text"
                name="firstName"
                value={editedStaffData.firstName}
                onChange={handleEditChange}
              />
              
              
                           {errors.firstName && (
  <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>
)}
          
 

               <Input
                type="text"
                name="fatherName"
                value={editedStaffData.fatherName}
                onChange={handleEditChange}
              />
              {errors?.fatherName && (
  <div className="text-red-500 text-sm mt-1">{errors.fatherName}</div>
)}

              

               <Input
                type="text"
                name="lastName"
                value={editedStaffData.lastName}
                onChange={handleEditChange}
              />
              {errors?.lastName && (
  <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>
)}

              

            </>
          ) : (
            // Render the staff data when not in edit mode
            <span>{`${staffMember.firstName} ${staffMember.fatherName} ${staffMember.lastName}`}</span>
          )}
      </td>
      <td className="p-4 border-b border-blue-gray-50 text-right">
          {isEditMode && editedStaffData.id === `${staffMember.id}` ? (
            // Render the edited email when in edit mode
            <>
              <Input
                type="text"
                name="email"
                value={editedStaffData.email}
                onChange={handleEditChange}
              />
              {errors.email && (
  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
)}

            
            </>
          ) : (
            // Render the staff email when not in edit mode
            <span>{`${staffMember.email}`}</span>
          )}
      </td>
      <td className="p-4 border-b border-blue-gray-50 text-right">
        <Tooltip content="حذف الموظف" className="bg-white font-baloo text-md text-gray-600">
          <IconButton variant="text" onClick={() => handleConfirm(staffMember.id)}>
            <TrashIcon className="h-4 w-4 text-red-500" />
          </IconButton>
        </Tooltip>
      </td>
      <td className="p-4 border-b border-blue-gray-50 text-right">
        <Tooltip content="تعديل بيانات الموظف" className="bg-white font-baloo text-md text-gray-600">
          {isEditMode && editedStaffData.id === staffMember.id ? (
            // Save button in edit mode
            <Button
              type="button"
              variant="text"
              onClick={handleSaveEdit}
            >
              حفظ
            </Button>
          ) : (
            // Edit button when not in edit mode
            <IconButton variant="text" onClick={() => handleEdit(staffMember.id ,staffMember.email ,staffMember.firstName , staffMember.lastName ,staffMember.fatherName)}>
              <PenIcon className="w-6 h-6 text-blue-500" />
            </IconButton>
          )}
        </Tooltip>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td className="p-4 border-b border-blue-gray-50 text-center" colSpan="3">
      <Typography variant="small" color="red" className="font-bold">
       <span>لا يوجد موظفين بهذا الاسم</span> 
      </Typography>
    </td>
  </tr>
)}

</tbody>

      </table>
  
    </Card>
  
    </div>

    </div>
    </div>
    
    <Confirm open={showConfirmAlert} handler={handleConfirm} method= {handleDeleteStaff} message="هل أنت متأكد من حذف الموظف؟"  // to show confirm message  staff delete 
    
    />
    <Success open={showAlert} handler={handlealert} message="تم حذف الموظف بنجاح" // to show success message when add staff
    
    />

</>
    
    
    
    
  );
}