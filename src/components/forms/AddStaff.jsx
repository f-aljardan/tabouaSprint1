import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { db , app , auth } from "../../firebase";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import SummeryStaffInfo from "../viewInfo/SummeryStaffInfo";


import makeAnimated from 'react-select/animated';

export default function AddStaff({ open, handler}){
   // const animatedComponents = makeAnimated(); //animating dialog

    //Defulte values for forms
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password:'',
        isAdmin:false,
      });

      const [ShowAddForm , setAddForm] = useState(true);
      const[showSummery, setShowSummery] = useState(false);
      

      
      console.log("Hello fronAddStaff");
      
      const [error, setError] = useState('');

      //Called when user change input fields
      const handleChange = (e) => {
        const { name, value } = e.target;
       // console.log(name , value);
        setFormData({
          ...formData, //copy the exact data before fields
          [name]: value,//add new data updated ,name-> name of varible , Value-> updated value
        });
      };



//Prevnt Defalut submit , and clear fields after sumbit


//const handleSubmit = async (e) => {
//  e.preventDefault();
 // console.log(e.email);
  // Call the callback function to add the recycling center
   
  
    
    //const auth = getAuth(app);
    //console.log(auth);
  //  console.log("before");

  /*
  await createUserWithEmailAndPassword(auth, formData.email, formData.password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error);

  });

 */


/*
    
    const userDoc = {
      uid: user.uid,
      firstName,
      lastName,
      email: user.email,
      password, // Note: Storing passwords directly like this is not recommended. Consider using Firebase Authentication instead.
      isAdmin: false,
    };

    const userDocRef = await addDoc(collection(db, 'users'), userDoc);

    console.log('User document added with ID:', userDocRef.id);

     // Clear form inputs
     setFormData({
       firstName: '',
       lastName: '',
       email: '',
       password:'',
   });
   */
  

//}; // sumbit---------------------------------------------------------

const handleClose = () => {

  handler(false); // Call the handler function passed as a prop with the argument `false` to close the dialog

};

const handleInfo = async(e) => {
  //const { name, value } = e.target;

 // console.log(formData.email);
  
//<SummeryStaffInfo firstName={formData.firstName} lastName ={formData.lastName} email={formData.email} password={formData.password} />
e.preventDefault();

//setShowSummery(true);


//setAddForm(false);
//handleClose();
};




function validate(){
  if(!formData.size){
  setShowValidationMessage(true);
  }else{
      handler();
  }
}



/*
      const handleSubmit = async (e) => {
        e.preventDefault();
        // Call the callback function to add the recycling center
        method(formData);
        // Clear the form fields after submission
        setFormData({
            FirstName: '',
            LastName: '',
            Email: '',
            Password:'',
        });
    };
    */
    
    ///////////////

      
    return(
      //<div aria-hidden="false">
 <Dialog open={open} handler={handleClose} aria-hidden="true" > 
             <form onSubmit={handleInfo} >
             <DialogHeader className="flex justify-center font-baloo text-right">إضافة مشرف</DialogHeader>
             <DialogBody divider className="font-baloo text-right">
             <div className="grid gap-6">
               
             <Input label="الاسم الأول" type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required/>

             <Input label="الاسم الأخير" type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required/>
              
              <Input label="البريد الإلكتروني" type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required/>

             <Input label="الرقم السري" type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required/>

             </div>
             </DialogBody>

             <DialogFooter className="flex gap-3 justify-center font-baloo text-right">
             <Button type = "submit" variant="gradient" style={{background:"#97B980", color:'#ffffff'}} onClick={() =>setShowSummery(true)}>
               <span aria-hidden="true">إضافة</span>
              </Button>
             <Button variant="outlined"  onClick={handler}>
               <span aria-hidden="true">إلغاء</span>
             </Button>
              
          </DialogFooter>

            </form>

{console.log(showSummery)}
           
           {(<SummeryStaffInfo
         openWindow = {showSummery}
          firstName={formData.firstName}
          lastName={formData.lastName}
          email={formData.email}
          password={formData.password}
        />)}
      
        </Dialog>
    //  </div>
       



    );
}
