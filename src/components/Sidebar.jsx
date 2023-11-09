import React, { useEffect } from 'react';
import { Link, useLocation , NavLink } from 'react-router-dom'; 
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
  import logo from "/src/assets/tabouaNo.png";


  function Sidebar({ authorized, showSidebar, setShowSidebar , activeItem, setActiveItem}) {
  
    const location = useLocation();

  useEffect(()=>{
    setShowSidebar(true);
  }, []);

    const [openAccordion, setOpenAccordion] = React.useState(0);
   
    const handleItemClick = (item) => {
      
      if (item === 'home') {
        // Only hide the sidebar when navigating to the 'home' page
        setShowSidebar(false);
        setActiveItem("") ;
      } else {
        // Keep the sidebar visible for other pages
       
        setActiveItem(item) ;
      }
    };

    
    
    //  an array of routes associated with each button
  const routes = {
    home: '/',
    garbage: '/garbage',
    garbagebinrequests: '/garbagebinrequests',
    recycle: '/recycle',
    complaints: '/complaints',
    heatmap: '/heatmap',
    manage: '/manage',
  };
 // Find the active item based on the current location
 const activeRoute = Object.keys(routes).find((item) => location.pathname.includes(routes[item]));

  const handleAccordionToggle = (accordionIndex) => {
    setOpenAccordion(openAccordion === accordionIndex ? 0 : accordionIndex);
  };


    return (
      <div className={`sidebar ${showSidebar ? '' : 'hidden'}`}>
          <div className='sidebar'>
      <Card className="h-[calc(122vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 "  >
        <div>
            <div className='flex justify-center'>
            <img src={logo} width={135} style={{ marginBottom: '35px' , marginTop: '25px'}}/>
            </div>
            
        <List>

          <ListItem className={`flex justify-start gap-2 items-center ${activeItem === 'home' ? 'active' : ''}`} >
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Link  to="" onClick={() => handleItemClick('home')}>الصفحة الرئيسية </Link>
          </ListItem>
          <hr />

          <Accordion
              open={openAccordion === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`  mx-auto h-5 w-5 transition-transform ${openAccordion === 1 ? "rotate-180" : ""} `}
                />
              }
            >
          <ListItem  className="p-0 " 
          selected={openAccordion === 1}>
            <AccordionHeader className="flex justify-start gap-2 items-center mr-3" onClick={() => handleAccordionToggle(1)} style={{ borderBottom: '1px solid transparent' }}>
            <ListItemPrefix>
              <TrashIcon className="h-5 w-5" />
            </ListItemPrefix>  
           <Typography className='ml-auto font-baloo'>إدارة حاويات النفايات  </Typography>
           </AccordionHeader>
          </ListItem>
          <hr />

          <AccordionBody className="py-1">
                <List className="p-0">
                <NavLink to="garbage" activeClassName="active" style={{ borderRadius: '10px' }} >
                  <ListItem  style={{ paddingRight: '30px' }}>
                  <ListItemPrefix>
              <ChevronLeftIcon className="h-3 w-3" />
            </ListItemPrefix> 
                     إضافة و حذف الحاويات 
                  </ListItem> 
                  </NavLink>
                  <hr />

                  <NavLink to="garbagebinrequests"  activeClassName="active" style={{ borderRadius: '10px' }} >
                  <ListItem style={{ paddingRight: '30px' }}>
                  <ListItemPrefix>
              <ChevronLeftIcon className="h-3 w-3" />
            </ListItemPrefix> 
               إدارة طلبات الحاويات  
                  </ListItem>
                  </NavLink>
                  <hr />

                </List>
              </AccordionBody>
            </Accordion>

          <NavLink to="recycle"  activeClassName="active" style={{ borderRadius: '10px' }} >
          <ListItem className={`flex justify-start gap-2`}>
            <ListItemPrefix>
              <FaRecycle className="h-5 w-5" />
            </ListItemPrefix>
            إدارة مراكز إعادةالتدوير 
          </ListItem>
          </NavLink>
          <hr />

          <NavLink to="complaints" activeClassName="active" style={{ borderRadius: '10px' }} >
          <ListItem className={`flex justify-start gap-2`}>
            <ListItemPrefix>
              <TbMessageReport className="h-6 w-6" />
            </ListItemPrefix>
            إدارةالبلاغات  
          </ListItem>
          </NavLink>
          <hr />


          <NavLink to="heatmap" activeClassName="active" style={{ borderRadius: '10px' }} >
          <ListItem className={`flex justify-start gap-2`}>
            <ListItemPrefix>
              <AiOutlineHeatMap className="h-5 w-5"  />
            </ListItemPrefix>
            الخريطة الحرارية  
           </ListItem>
           </NavLink>
           <hr />
         
         {authorized && 
           <NavLink to="manage" activeClassName="active" style={{ borderRadius: '10px' }} >
         <ListItem className={`flex justify-start gap-2`}>
            <ListItemPrefix>
              <MdManageAccounts className="h-6 w-6" />
            </ListItemPrefix>
            إدارة صلاحيات الموظفين  
          </ListItem>
          </NavLink>} 
            
        </List>
        </div>
      </Card>
      </div>
      </div>
      
    );
  }

  export default Sidebar;