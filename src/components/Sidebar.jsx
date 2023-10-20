
import React, { useEffect } from 'react';
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


  function Sidebar({ authorized, showSidebar, setShowSidebar , activeItem, setActiveItem}) {
  
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

    const handleLogout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    
    
 
  const handleAccordionToggle = (accordionIndex) => {
    setOpenAccordion(openAccordion === accordionIndex ? 0 : accordionIndex);
  };


    return (
      <div className={`sidebar ${showSidebar ? '' : 'hidden'}`}>
          <div className='sidebar'>
      <Card className="h-[calc(105vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 "  >
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
                  <ListItem className={activeItem === 'garbage' ? 'active' : ''}>
                  <ListItemPrefix>
              <ChevronLeftIcon className="h-3 w-3" />
            </ListItemPrefix> 
                  <Link to="garbage"  onClick={() => handleItemClick('garbage')}> إضافة و حذف الحاويات  </Link>
                  </ListItem>
                  <hr />

                  <ListItem className={activeItem === 'requestedgarbage' ? 'active' : ''}>
                  <ListItemPrefix>
              <ChevronLeftIcon className="h-3 w-3" />
            </ListItemPrefix> 
                    <Link to="requestedgarbage" onClick={() => handleItemClick('requestedgarbage')}>إدارة طلبات الحاويات  </Link>
                  </ListItem>
                  <hr />

                </List>
              </AccordionBody>
            </Accordion>
          <ListItem className={`flex justify-start gap-2  ${activeItem === 'recycle' ? 'active' : ''}`}>
            <ListItemPrefix>
              <FaRecycle className="h-5 w-5" />
            </ListItemPrefix>
            <Link to="recycle" onClick={() => handleItemClick('recycle')}> إدارة مراكز إعادةالتدوير  </Link>
          </ListItem>
          <hr />

          <ListItem className={`flex justify-start gap-2 ${activeItem === 'complaints' ? 'active' : ''}`}>
            <ListItemPrefix>
              <TbMessageReport className="h-6 w-6" />
            </ListItemPrefix>
            <Link to="complaints" onClick={() => handleItemClick('complaints')}> إدارةالبلاغات  </Link>
          </ListItem>
          <hr />


          <ListItem className={`flex justify-start gap-2 ${activeItem === 'heatmap' ? 'active' : ''}`}>
            <ListItemPrefix>
              <AiOutlineHeatMap className="h-5 w-5"  />
            </ListItemPrefix>
            <Link to="heatmap" onClick={() => handleItemClick('heatmap')}>الخريطة الحرارية  </Link> 
           </ListItem>
           <hr />
         
         {authorized && <ListItem className={`flex justify-start gap-2 ${activeItem === 'manage' ? 'active' : ''}`}>
            <ListItemPrefix>
              <MdManageAccounts className="h-6 w-6" />
            </ListItemPrefix>
            <Link to="manage" onClick={() => handleItemClick('manage')}> إدارة صلاحيات الموظفين  </Link> 
          </ListItem>} 
            
        </List>
        </div>
      </Card>
      </div>
      </div>
      
    );
  }

  export default Sidebar;