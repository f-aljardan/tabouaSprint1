
import React from 'react';
import { Link } from 'react-router-dom'; 
import {
    Card,
    List,
    ListItem,
    ListItemPrefix,
  } from "@material-tailwind/react";
  import {
   HomeIcon,
    TrashIcon,
    PowerIcon, 
  } from "@heroicons/react/24/solid";
  import { FaRecycle,
 } from 'react-icons/fa';
 import { 
    TbMessageReport,
 } from 'react-icons/tb';
 import { 
    AiOutlineHeatMap,
 } from 'react-icons/ai';
 import { 
  MdManageAccounts,
 } from 'react-icons/md';
import logo from "/tabouaNo.png" ;
import  { getAuth,  signOut} from "firebase/auth";
import { useNavigate } from 'react-router-dom';

   function Sidebar({authorized}) {

    const [activeItem, setActiveItem] = React.useState(null);
    const navigate = useNavigate();

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
    
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Sign the user out
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
 


    return (
        <div className="sidebar">
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5"  >
        <div>
            <div className='pr-10'>
            <img src={logo} className="h-40 w-40"/>
            </div>
            
        <List>
          <ListItem className={activeItem === 'home' ? 'active' : ''}>
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Link  to="" onClick={() => handleItemClick('home')}>الرئيسية </Link>
          </ListItem>
          <ListItem  className={activeItem === 'garbage' ? 'active' : ''}>
            <ListItemPrefix>
              <TrashIcon className="h-5 w-5" />
            </ListItemPrefix>  
            <Link to="/mainpage/garbage" onClick={() => handleItemClick('garbage')}>إدارة حاويات النفايات</Link>
          </ListItem>
          <ListItem className={activeItem === 'recycle' ? 'active' : ''}>
            <ListItemPrefix>
              <FaRecycle className="h-5 w-5" />
            </ListItemPrefix>
            <Link to="/mainpage/recycle" onClick={() => handleItemClick('recycle')}> إدارة مراكز إعادةالتدوير</Link>
          </ListItem>
          <ListItem className={activeItem === 'complaints' ? 'active' : ''}>
            <ListItemPrefix>
              <TbMessageReport className="h-6 w-6" />
            </ListItemPrefix>
            <Link to="/mainpage/complaints" onClick={() => handleItemClick('complaints')}> إدارةالبلاغات</Link>
          </ListItem>
          <ListItem className={activeItem === 'heatmap' ? 'active' : ''}>
            <ListItemPrefix>
              <AiOutlineHeatMap className="h-5 w-5"  />
            </ListItemPrefix>
            <Link to="/mainpage/heatmap" onClick={() => handleItemClick('heatmap')}>الخريطة الحرارية</Link> 
           </ListItem>
         
         {authorized && <ListItem className={activeItem === 'manage' ? 'active' : ''}>
            <ListItemPrefix>
              <MdManageAccounts className="h-6 w-6" />
            </ListItemPrefix>
            <Link to="/mainpage/manage" onClick={() => handleItemClick('manage')}> إدارة صلاحيات المشرفين</Link> 
          </ListItem>} 
            
          <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
        <button onClick={handleLogout}> تسجيل الخروج </button>
          </ListItem>
        </List>
        </div>
      </Card>
      </div>
      
    );
  }

// function Sidebar() {
//     return (
//       <div className="sidebar">
//         <ul className="sidebar-nav">

//           <li><Link to="/">Home</Link></li>
//           <li><Link to="/garbage">Garbage Bins</Link></li>
//           <li><Link to="/RecyclingCenters">RecyclingCenters</Link></li>
//           <li><Link to="/complaints">Complaints</Link></li>
   
//         </ul>
//       </div>
//     );
//   }
  
  export default Sidebar;