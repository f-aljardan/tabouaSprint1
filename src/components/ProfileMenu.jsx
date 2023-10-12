import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Typography,
    Button,
  } from "@material-tailwind/react";
  import userIcon from "/userIcon.svg"
  import { getAuth, signOut } from "firebase/auth";
import {  useNavigate } from 'react-router-dom';

  export default function ProfileMenu({userData}) {
    const navigate = useNavigate();


    const handleLogout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth); // Sign the user out
        navigate('/'); // Redirect to the login page
      } catch (error) {
        console.error('Logout error:', error);
      }
    };


    const handleChangePassword = async() =>{
console.log("paswword")
    }


    return (
      <div className="ProfileMenu flex justify-right  px-8 "> 
        <Menu placement="bottom-end" >
          <div className="flex justify-center items-center gap-3">
        <MenuHandler>
          <Avatar
           size="md"
           alt="avatar"
            variant="circular"
            className="mt-1 mb-1 cursor-pointer border border-green-500 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30"
            src={userIcon}
              />
        </MenuHandler>
        <div className="flex flex-col items-center text-white">
        <Typography variant="h6"><span>{`${userData.firstName} ${userData.lastName}`}</span></Typography>
          <Typography variant="small" color="gray" className="font-normal"><span>
          {userData.isAdmin? "مشرف" : "موظف"}
          </span></Typography>
        </div>
       
        </div>
        <MenuList>
          <MenuItem className=" flex items-center gap-2" onClick={handleChangePassword}>
            <svg xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            strokeWidth={2}
              stroke="currentColor"
            className="w-4 h-4">
           <path fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
           clipRule="evenodd" />
         </svg>
        
           <span>تغيير كلمةالمرور</span> 
           
          </MenuItem>
     

          
         
          <hr className="my-2 border-blue-gray-50" />
         
           
            
              <Button 
              className="flex items-center gap-3"
              size="sm"
              fullWidth={true}
              variant="gradient"
              style={{ background: "#FE5500", color: "#ffffff" }} 
              onClick={handleLogout}> 
                <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
              />
            </svg>
            <span>تسجيل الخروج </span> 
             </Button>
              
          
        </MenuList>
      </Menu>
      </div>
    );
  }