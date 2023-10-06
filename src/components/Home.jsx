
import {
    ListItem,
    ListItemPrefix,
  } from "@material-tailwind/react";
  import{PowerIcon, } from "@heroicons/react/24/solid";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function Home(){
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
    return(
        <>
     homebbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
     <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
        <button onClick={handleLogout}> تسجيل الخروج </button>
          </ListItem>
        </>
    )
}
