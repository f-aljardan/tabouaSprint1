
import React from 'react';
import { Link } from 'react-router-dom'; 
import {
    Card,
    List,
    ListItem,
    ListItemPrefix,
    Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  } from "@material-tailwind/react";
  import {
   HomeIcon,
    TrashIcon,
    ChevronDownIcon,
    ChevronLeftIcon
  } from "@heroicons/react/24/solid";
  import { FaRecycle } from 'react-icons/fa';
  import { TbMessageReport } from 'react-icons/tb';
  import { AiOutlineHeatMap } from 'react-icons/ai';
  import { MdManageAccounts } from 'react-icons/md';
  import logo from "/tabouaNo.png";


   function Sidebar({authorized}) {

    const [activeItem, setActiveItem] = React.useState(null);
    const [openAccordion, setOpenAccordion] = React.useState(0);
   

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
    
 
  const handleAccordionToggle = (accordionIndex) => {
    setOpenAccordion(openAccordion === accordionIndex ? 0 : accordionIndex);
  };


    return (
     
          <div className='sidebar'>
      <Card className="h-[calc(105vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 "  >
        <div>
            <div className='flex justify-center'>
            <img src={logo} width={135}/>
            </div>
            
        <List>

          <ListItem className={activeItem === 'home' ? 'active' : ''}>
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Link  to="" onClick={() => handleItemClick('home')}>الرئيسية </Link>
          </ListItem>

          <Accordion
              open={openAccordion === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-5 w-5 transition-transform ${openAccordion === 1 ? "rotate-180" : ""}`}
                />
              }
            >
          <ListItem  className="p-0"
          selected={openAccordion === 1}>
            <AccordionHeader onClick={() => handleAccordionToggle(1)}>
            <ListItemPrefix>
              <TrashIcon className="h-5 w-5" />
            </ListItemPrefix>  
           <Typography className='ml-auto font-baloo'>إدارة حاويات النفايات</Typography>
           </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem className={activeItem === 'garbage' ? 'active' : ''}>
                  <ListItemPrefix>
              <ChevronLeftIcon className="h-3 w-3" />
            </ListItemPrefix> 
                  <Link to="/mainpage/garbage" onClick={() => handleItemClick('garbage')}> إضافة و حذف الحاويات</Link>
                  </ListItem>
                  <ListItem>
                  <ListItemPrefix>
              <ChevronLeftIcon className="h-3 w-3" />
            </ListItemPrefix> 
                    <Link to="/mainpage/requestedgarbage">إدارة طلبات الحاويات</Link>
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
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