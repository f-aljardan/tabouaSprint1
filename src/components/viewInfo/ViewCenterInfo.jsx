import { useState  , useEffect} from "react";
import Confirm from "../messages/Confirm";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { db } from "/src/firebase";
import { collection , doc ,  onSnapshot  , updateDoc} from 'firebase/firestore';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes }  from '@firebase/storage';
import { useNavigate } from 'react-router-dom';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  ListItemPrefix,
  Chip,
  List,
  ListItem,
  Input,
} from "@material-tailwind/react";
import {
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiClock,
  HiOutlineGlobeAlt,
} from "react-icons/hi";
import { FaRecycle } from 'react-icons/fa';
import { format, parseISO, set } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

const arabicDays = ['- الجمعة', '- السبت', '- ايام الاسبوع'];

const formatTimeRange = (from, to) => {
  if ( from=="" || to=="" ) {
   
    return "!مغلق"; // Handle the case where from or to are missing
  }

  const fromDate = parseISO(from);
  const toDate = parseISO(to);

 

  // Define the Arabic strings for AM and PM
  const amString = "ص";
  const pmString = "م";

  // Format the time using Arabic AM and PM
  const formattedFrom = format(fromDate, 'hh:mm', { locale: enUS }) + ` ${fromDate.getHours() >= 12 ? pmString : amString}`;
  const formattedTo = format(toDate, 'hh:mm', { locale: enUS }) + ` ${toDate.getHours() >= 12 ? pmString : amString}`;

  return `${formattedFrom} إلى ${formattedTo}`;
};

const formatOpeningHours = (centerData) => {
  if (!centerData.openingHours) {
    return "معلومات ساعات العمل غير متوفرة";
  }


  const orderedDays = ["fri", "sat", "weekdays"]; // Define the desired order of days

 
  return (
    <ul>
      {orderedDays.map((day) => {
        const dayData = centerData.openingHours[day];
       
        return (
          <li key={day}>
            <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>
              {arabicDays[orderedDays.indexOf(day)]} :
            </span>
            <span style={{ marginLeft: '8px' }}>
              {dayData.isClosed ? 'مغلق' : formatTimeRange(  dayData.from, dayData.to)}
            </span>
          </li>
        );
      })}
    </ul>
  );
};


export default function ViewCenterInfo({ open, onClose, DeleteMethod, Changelocation, center , centerID}) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showCenterLogo, setShowCenterLogo] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [time, setTime] = useState(dayjs('2022-04-17T00:00'));
  const [editButtonsVisible, setEditButtonsVisible] = useState(false);
  const [changeLocation, setChangeLocation] = useState(true);
  const [showOpeningHoursMessage, setShowOpeningHoursMessage] = useState(false);
  const [backButtonClicked, setBackButtonClicked] = useState(false);
  const [wasteListTypes, setWasteListTypes] = useState([]);
  const [showCenterTypesError, setShowCenterTypesError] = useState(false);

  
  const handleEdit = () => {
    // Toggle the visibility of the buttons when "تعديل معلومات الحاوية" is clicked
    setEditButtonsVisible(!editButtonsVisible);
  };

  const handleBackButton = async() =>{
  
  setBackButtonClicked(!backButtonClicked);// handle back button
    setEditMode(!editMode); // handle editMode
    handleChangeLocation(); // handle change button
  };

  // showing change loation button
  const handleChangeLocation = () => {
    setChangeLocation(!changeLocation);
    setShowOpeningHoursMessage(false);
    setShowCenterTypesError(false);

  } 
  
// validate websiteURL
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
 //CenetrInfo
  const [centerData, setCenterData] = useState({
    name: '',
    description: '',
    types: [],
    imageURL: '',
    logoURL: '',
    websiteURL:'',
    openingHours: {
      fri: { from: '', to: '', isClosed: false },
      weekdays: { from: '', to: '' },
      sat: { from: '', to: '', isClosed: false },
    },
    phoneNo: '',
  });
//Center Edited info
  const [editedCenterData, setEditedCenterData] = useState({ 
    name: '',
    description: '',
    types: [],
    imageURL: '',
    logoURL: '',
    websiteURL:'',
    openingHours: {
      fri: { from: '', to: '', isClosed: false },
      weekdays: { from: '', to: '' },
      sat: { from: '', to: '', isClosed: false },
    },
    phoneNo: '',
   });

   const options = [
    { value: 'بلاستيك', label: 'بلاستيك' },
    { value: 'ورق', label: 'ورق' },
    { value: 'زجاج', label: 'زجاج' },
    { value: 'كرتون', label: 'كرتون' },
    { value: 'معدن', label: 'معدن' },
    { value: 'إلكترونيات', label: 'إلكترونيات' },
    { value: 'أخرى', label: 'أخرى' },
  ];

 ///////Handle Edit image and logo

 // Handle the upload of the center's logo
 const handleLogoChange = (e) => {
  const file = e.target.files[0];
  handleLogoUpload(file);
};


 const handleLogoUpload = async (file) => {
  if (file) {
    try {
      const logoName = Date.now().toString();
      const storageRef = ref(storage, `logos/${logoName}`);
      await uploadBytes(storageRef, file);
      const logoUrl = await getDownloadURL(storageRef);

      setCenterData((prevData) => ({
        ...prevData,
        logoURL: logoUrl,
      }));
    } catch (error) {
      console.error('Error uploading logo image:', error);
    
    }
  }
};
const handleImageChange = (e) => {
  const file = e.target.files[0];
  handleImageUpload(file);
};
const handleImageUpload = async (file) => {
  if (file) {
    try {
      const imageName = Date.now().toString();
      const storageRef = ref(storage, `images/${imageName}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      setCenterData((prevData) => ({
        ...prevData,
        imageURL: imageUrl,
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        imageURL: 'Error uploading image',
      }));
    }
  }
};


// show the center info that pass from Recyling center map
useEffect(() => {
  // Make sure that the center object exists and contains the required data
if (center && center.openingHours ) {

const wasteTypes = center.type || [];

const types = wasteTypes.map((type, index) => (

<Chip key={index} style={{ background: "#07512D", color: "#ffffff"  }} value={type} />
));
setWasteListTypes(types);


const centerHours = {
  fri: {
    from: center.openingHours.fri.isClosed ? '' : center.openingHours.fri.from,
      to: center.openingHours.fri.isClosed ? '' : center.openingHours.fri.to,
      isClosed: center.openingHours.fri.isClosed,

    },
 
  weekdays: {
    from: center.openingHours.weekdays.from,
    to: center.openingHours.weekdays.to,
  },
  sat: {
      from: center.openingHours.sat.isClosed ? '' : center.openingHours.sat.from,
      to: center.openingHours.sat.isClosed ? '' : center.openingHours.sat.to,
      isClosed: center.openingHours.sat.isClosed,
    },
 
};

    setCenterData({
      name: center.name,
      description: center.description,
      types: center.wasteListTypes,
      imageURL: center.imageURL,
      logoURL: center.logoURL,
      websiteURL: center.websiteURL,

openingHours:centerHours,

      phoneNo: center.phoneNo,
    });


  }
  

  else{
    setCenterData({
      name: '',
      description: '',
      types: [],
      imageURL: '',
      logoURL: '',
      websiteURL:'',
      openingHours: {
        fri: { from: '', to: '', isClosed: false },
        weekdays: { from: '', to: '' },
        sat: { from: '', to: '', isClosed: false },
      },
      phoneNo: '',
    });
  }
}, [center]);

// each time when Edit the cenetr info it will update it automtically
  useEffect(() => {
      const centerCollection = collection(db, 'recyclingCenters');
      const unsubscribe = onSnapshot(centerCollection, (snapshot) => {
        const centerInfo = [];
    
        snapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          if(centerID ==id ) {
  
    const wasteTypes = centerData.types || [];
  
  const types = wasteTypes.map((type, index) => (
  
  <Chip key={index} style={{ background: "#07512D", color: "#ffffff"  }} value={type} />
  
  ));
  setWasteListTypes(types);
          centerInfo.push({
            name: data.name,
            description: data.description,
            types: data.type,
            imageURL: data.imageURL,
            logoURL: data.logoURL,
            websiteURL:data.websiteURL,
            openingHours:{
              fri: {
                  from: data.openingHours.fri.isClosed ? '' : data.openingHours.fri.from,
                  to: data.openingHours.fri.isClosed ? '' : data.openingHours.fri.to,
                  isClosed: data.openingHours.fri.isClosed,
          
                },
             
              weekdays: {
                from: data.openingHours.weekdays.from,
                to: data.openingHours.weekdays.to,
              },
              sat: {
                  from: data.openingHours.sat.isClosed ? '' : data.openingHours.sat.from,
                  to: data.openingHours.sat.isClosed ? '' : data.openingHours.sat.to,
                  isClosed: data.openingHours.sat.isClosed,
                },
             
            },
            phoneNo: data.phoneNo,
  
            });
          }
        });
    
        setCenterData(centerInfo);
      });
    
      // Return the cleanup function to unsubscribe from the listener
      
      return () => {
        unsubscribe();
      };
  
  }, []);
  


  const handleDeleteConfirmation = () => setDeleteConfirmation(!deleteConfirmation);

  const types = center.type || [];
  const typeList = types.map((type, index) => (
    <Chip key={index} style={{ background: "#07512D", color: "#ffffff"  }} value={type} />
  ));

  const animatedComponents = makeAnimated();



  const handleEditCenter = () => {
 
    handleChangeLocation();

    setEditedCenterData({

      name: center.name,
      description: center.description,
  
      types: center.types,
      imageURL: center.imageURL,
      logoURL: center.logoURL,
      websiteURL:center.websiteURL,
      openingHours: center.openingHours,
      phoneNo: center.phoneNo,


    })

    setEditMode(true);
  };

  // Save new info into firebase

 const handleSaveEdit = async (e) => {

  const centerUpdate = doc(db, 'recyclingCenters', centerID);
  // Prepare the data to be updated
  const updatedData = {
    name: centerData.name,
    description: centerData.description,
    websiteURL: centerData.websiteURL,
    phoneNo: centerData.phoneNo,
    logoURL:centerData.logoURL,
  };


  if (centerData.types) {
    updatedData.type = centerData.types;
  }

  if (centerData.imageURL) {
    updatedData.imageURL = centerData.imageURL;
  }

  if (centerData.logoURL) {
    updatedData.logoURL = centerData.logoURL;
  }
 

  // Handle the opening hours fields
 
  try{
    if(centerData.openingHours.weekdays.from.toDate().toISOString() && centerData.openingHours.weekdays.to.toDate().toISOString() ){
         setShowErrorMessage(false);

    }
    
   

  }catch(error) {
    setShowOpeningHoursMessage(true);
  }
  if(!selectedOptions.length) {
    setShowCenterTypesError(true);
  }
  else{
    setShowCenterTypesError(false);


  }
  if(!centerData.name  || !centerData.phoneNo || !centerData.description ||(!centerData.websiteURL && !isValidURL(centerData.websiteURL)  )|| !selectedOptions.length) {
  
  console.log("Empty Fileds");

  } 
  else {
    const centerOpeningHours = {
      fri: {
        from: centerData.openingHours.fri.isClosed ? '' : centerData.openingHours.fri.from.toDate().toISOString(),
        to: centerData.openingHours.fri.isClosed ? '' : centerData.openingHours.fri.to.toDate().toISOString(),
        isClosed: centerData.openingHours.fri.isClosed,
  
        },
     
      weekdays: {
        from: centerData.openingHours.weekdays.from ? centerData.openingHours.weekdays.from.toDate().toISOString() :center.openingHours.weekdays.from,
        to: centerData.openingHours.weekdays.to ? centerData.openingHours.weekdays.to.toDate().toISOString() : center.openingHours.weekdays.to,
      },
      sat: {
          from: centerData.openingHours.sat.isClosed ? '' : centerData.openingHours.sat.from.toDate().toISOString(),
          to: centerData.openingHours.sat.isClosed ? '' : centerData.openingHours.sat.to.toDate().toISOString(),
          isClosed: centerData.openingHours.sat.isClosed,
        },
     
    };
   
    
  
  updatedData.openingHours =centerOpeningHours;
  
    try {
      // Update the document with the new data
     
      await updateDoc(centerUpdate, updatedData);
  
      // Exit edit mode and clear the edited data
     setEditMode(false);
      setCenterData(updatedData)
      handleChangeLocation();

     
  
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }
  
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setCenterData({
      ...centerData,
      [name]: value,
    });
    
    
  };

  const handleOpeningHoursChange = (time, day, period) => {
    
    setCenterData((prevData) => ({
      ...prevData,
      openingHours: {
        ...prevData.openingHours,
        [day]: {
          ...prevData.openingHours[day],
          [period]: time,
        },
         
      },
      
    }));

  }


  const handleDayClosedChange = (isClosed, day) => {
    setCenterData((prevData) => ({
      ...prevData,
      openingHours: {
        ...prevData.openingHours,
        [day]: {
          ...prevData.openingHours[day],
          isClosed: isClosed,
        },
      },
    }));

    
  }
  
  const handleWasteTypeChange = (selected) => {
    // Extract the values of the selected options

    const selectedTypes = selected.map((option) => option.value);

    // Update the centerData state with the selected types
    const Wastetypes = 
    selectedTypes.map((type, index) => (
      <Chip

        key={index}
        label={type}
        value={type}
        style={{ background: "#07512D", color: "#ffffff" }}
      />
    ));
    setWasteListTypes(Wastetypes);
    setCenterData({
      ...centerData,
      types: selectedTypes,
    });
    setSelectedOptions(selected);



  }
 
  

  return (
    <>
      <Drawer placement="right" size={450} open={open} onClose={onClose} className="p-5 font-baloo overflow-y-auto">
   
      {!centerData.name && !backButtonClicked && (
<Typography variant='small' style={{ color:"red" }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ paddingRight:"0.5%" }} >الرجاء تعبئة اسم المركز  </span>
              </span>
              </Typography>
            
      )}
      
        <div className="mb-4 flex items-center justify-between">
        {editMode ? (

     <Input
       id="name"
       name="name"
       value={centerData.name || ''}
        onChange={handleChange}
        className="text-3xl font-semibold"
          />

         ) : (
          
         <Typography variant="h5">

         <span>{centerData.name || ''}</span>

        </Typography>

      )}

          <IconButton variant="text" color="blue-gray" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </div>
        {!editMode ? (
<>
        <div className="flex justify-center h-56">
          <div style={{ width: "100%", maxHeight: "100%", overflow: "hidden", textAlign: "center" }}>
            {showCenterLogo ? (
              <img src={
                centerData.logoURL} alt="Center Logo" style={{ width: "100%", height: "100%" }} />
            ) : (
              <img src={centerData.imageURL} alt="Center Photo" style={{ width: "100%", height: "100%" }} />
            )}
          </div>
        </div>
         
  <div className="flex justify-between mt-3">
          {showCenterLogo && (
            <Button
              size="sm"
              variant="text"
              color="blue-gray"
              onClick={() => setShowCenterLogo(false)}
              style={{ backgroundColor: "#07512D", color: "#ffffff", marginLeft: "75%" }}
            >
              →{/* Right arrow */}
            </Button>
          )}

          {!showCenterLogo && (
            <Button
              size="sm"
              variant="text"
              color="blue-gray"
              onClick={() => setShowCenterLogo(true)}
              style={{ backgroundColor: "#07512D", color: "#ffffff", marginRight: "85%" }}
            >
              ←{/* Left arrow */}
            </Button>
          )}
        </div>

</>
        ) : (
          <>
                      <div className='flex flex-col gap-2 '>

<div className='flex items-center gap-2'>
                          <label htmlFor="logo"> شعار المركز:</label>
                          <input
                            type="file"
                            id="logo"
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                        </div>

                        <div className='flex items-center gap-2'>
                          <label htmlFor="image"> صورة المركز:</label>
                          <input
                            type="file"
                            id="image"
                            accept="image/*"
                           onChange={handleImageChange}
                          />
                        </div>
                        

                        </div>
          </>
        )}
 
       {!centerData.description && !backButtonClicked && (
<Typography variant='small' style={{ color:"red" }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ paddingRight:"0.5%" }} >الرجاء تعبئة وصف المركز  </span>
              </span>
              </Typography>
            
      )}

        <li className="centerInfo">
          <List>
            <ListItem ripple={false}>
              <ul>
                <ListItemPrefix className="flex mt-3 pb-2">
                  <HiOutlineInformationCircle className="h-5 w-5 ml-2" />
                  <span className="font-medium">عن المركز :</span>
                </ListItemPrefix>
                {editMode ? (
                  <Input
                  id="description"
                    name="description"
                    value={centerData.description || ''}
                    onChange={handleChange}
                    className="description font-baloo mr-8"
                  />
                ) : (
                  <Typography className="description font-baloo mr-8">
                    <span>{centerData.description || ''}</span>
                  </Typography>
                )}
              </ul>
            </ListItem>

            {showOpeningHoursMessage  && (
<Typography variant='small' style={{ color:"red" }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ paddingRight:"0.5%" }} >الرجاء تعبئة ساعات العمل  </span>
              </span>
              </Typography>
            
      )}

<ListItem ripple={false}>
              <ul className="flex flex-col gap-2">
                <ListItemPrefix className="flex ">
                  <HiClock className="h-5 w-5 ml-2" />
                  <span className="font-medium">ساعات العمل:</span>
                </ListItemPrefix>
                 
                <div className="flex flex-col gap-2">
                  {editMode && centerData.openingHours
                    ? (
          
                      <>
                      <div className="flex gap-2 items-center">
                        <span>أيام الأسبوع:</span>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            className='w-32'
                            views={['hours']}
                            label="من"
                            value={time}
                            onChange={(time) => handleOpeningHoursChange(time, 'weekdays', 'from')} />
                          <TimePicker
                            className='w-32'
                            views={['hours']}
                            label="إلى"
                            value={time}
                            onChange={(time) => handleOpeningHoursChange(time, 'weekdays', 'to')} />
                        </LocalizationProvider>
                      </div>
                      
                      <div className="flex gap-8 items-center">
                          <span>الجمعة:</span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex  gap-2">
                              <TimePicker
                                className='w-32'
                                views={['hours']}
                                label="من"
                                value={ time}
                                onChange={(time) => handleOpeningHoursChange(time, 'fri', 'from')} />
                              <TimePicker
                                className='w-32'
                                views={['hours']}
                                label="إلى"
                                value={ time}
                                onChange={(time) => handleOpeningHoursChange(time, 'fri', 'to')} />
                              <div className='flex gap-1 items-center'>
                                <input
                                  type="checkbox"
                                  checked={centerData.openingHours.fri.isClosed }
                                  onChange={(e) => handleDayClosedChange(e.target.checked, 'fri')} />
                                <span>مغلق الجمعة</span>
                              </div>
                            </div>
                          </LocalizationProvider>
                        </div><div className="flex gap-9 items-center">
                          <span>السبت:</span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex  gap-2">

                              <TimePicker
                                className='w-32'
                                views={['hours']}
                                label="من"
                                value={ time}
                                onChange={(time) => handleOpeningHoursChange(time, 'sat', 'from')} />
                              <TimePicker
                                className='w-32'
                                views={['hours']}
                                label="إلى"
                                value={ centerData.openingHours.sat.to || time}
                                onChange={(time) => handleOpeningHoursChange(time, 'sat', 'to')} />
                              <div className='flex gap-1 items-center'>
                                <input
                                  type="checkbox"
                                  checked={centerData.openingHours.sat.isClosed }
                                  onChange={(e) => handleDayClosedChange(e.target.checked, 'sat')} />
                                <span>مغلق السبت</span>
                              </div>
                            </div>
                          </LocalizationProvider>
                        </div>
                        
                        </>
                     ):(
                      <ListItem ripple={false}>

                      <ul className="flex flex-col gap-2">
                      
                     
                      
                      <div className="opening-hours mr-8">
                      
                      {centerData.openingHours ? formatOpeningHours(centerData) : "معلومات ساعات العمل غير متوفرة"}
                      
                      </div>
                      
                      </ul>
                      
                      </ListItem>
                   )}    
                </div>
              </ul>
            </ListItem>

{showCenterTypesError&& (
<Typography variant='small' style={{ color:"red" }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ paddingRight:"0.5%" }} >الرجاء تحدبد البيانات المستقبلة  </span>
              </span>
              </Typography>
            
      )}


         
   <ListItem ripple={false}>
 
 <ul>
   <ListItemPrefix className="flex pb-2">
     <FaRecycle className="h-5 w-5 ml-2" />
     <span className="font-medium">النفايات المستقبلة:</span>
   </ListItemPrefix>
   {editMode ? (
     // Display the Select component in edit mode
     <>
     <Select
      placeholder="أنواع النفايات المستقبلة..."
       closeMenuOnSelect={false}
       isMulti
       components={animatedComponents}
       options={options}
       value={selectedOptions}  
       onChange={handleWasteTypeChange}
     />
     <div className="flex wrap gap-2 justify-end mr-8">
     {selectedOptions.map((option, index) => (
 <span key={index}>{option.label}</span>
))}
   </div>
     </>
     
   ) : (
     // Display the selected waste types when not in edit mode
     <div className="flex wrap gap-2 justify-end mr-8">{/* div to show design of waste types */}
     

<div className="flex wrap gap-2 justify-end mr-8">
       {wasteListTypes}
     </div>

      
     </div>
   )}
 </ul>
 </ListItem>
 { (!centerData.websiteURL ||!isValidURL(centerData.websiteURL) )&& !backButtonClicked && (
<Typography variant='small' style={{ color:"red" }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ paddingRight:"0.5%" }}>الرجاء إدخال الموقع الإلكتروني</span>
              </span>
              </Typography>
            
      )}

            <ListItem ripple={false}>
              <ul>
                <ListItemPrefix className="flex pb-2">
                  <HiOutlineGlobeAlt className="h-5 w-5 ml-2" />
                  <span className="font-medium">رابط الموقع الإلكتروني:</span>
                </ListItemPrefix>
                {editMode ? (
                  <Input
                    name="websiteURL"
                    value={centerData.websiteURL || ''}
                    onChange={handleChange}
                    className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500 mr-11"
                  />
                ) : (
                  <Typography as="a" href={centerData.websiteURL || ''} color="blue-gray" className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500 mr-11">
                    <span>اضغط هُنا</span>
                  </Typography>
                )}
              
              </ul>
            </ListItem>
            
            {(!centerData.phoneNo|| !(/^\d{10}$/).test(centerData.phoneNo))&& !backButtonClicked && (
<Typography variant='small' style={{ color:"red" }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ paddingRight:"0.5%" }}>الرجاء إدخال رقم الهاتف</span>
              </span>
              </Typography>
            
      )}
            <ListItem ripple={false}>
              <ul className="flex gap-2">
                <ListItemPrefix className="flex pb-2">
                  <HiOutlinePhone className="h-5 w-5 ml-2" />
                  <span className="font-medium ">رقم الهاتف:</span>
                </ListItemPrefix>
                {editMode ? (
                  <Input
                    name="phoneNo"
                    value={centerData.phoneNo || ''}
                    onChange={handleChange}
                    className="block"
                  />
                ) : (
                  <span className="block"> {centerData.phoneNo || ''}</span>
                )}
              </ul>
            </ListItem>
          </List>
        </li>

       
{editButtonsVisible ? (
          <>
           <div className="flex flex-col gap-2">
         {changeLocation ? ( 
         <Button
              className="mt-3"
              size="md"
              fullWidth={true}
              onClick={() => {Changelocation(centerID); handleEdit();} }
              variant="gradient"
              style={{ background: '#97B980', color: '#ffffff' }}
            >
              <span>تعديل موقع المركز</span>
            </Button> ): null}
        
            {editMode ? (
              <>
          <Button
            size="sm"
            className="mt-3"
            fullWidth={true}
            variant="gradient"
            style={{ background: "#97B980", color: "#ffffff"  }}
            onClick={handleSaveEdit}
          >
            <span>حفظ</span>
          </Button>

          <Button
         size="sm"
        className="mt-3"
        fullWidth={true}
      variant="gradient"
      style={{ background: "#979797", color: "#ffffff" }}
      onClick={handleBackButton}
    >
      <span>رجوع</span>
    </Button>
    </>

        ) : (
          <>
           <Button
          size="md"
            className="mt-3"
            fullWidth={true}
            variant="gradient"
            style={{ background: '#97B980', color: '#ffffff' , marginTop: '0' }}
            onClick={handleEditCenter}
          >
            <span>تعديل معلومات المركز</span>
          </Button>
          </>
         
        )}

            {changeLocation ? (  <Button
              size="md"
              fullWidth={true}
              onClick={handleEdit}
              variant="gradient"
              style={{ background: '#979797', color: '#ffffff' }}
            >
              <span>رجوع</span>
            </Button>) : null}
            </div>
          </>
        ) : ( 
<div className="flex flex-col gap-2">
           <Button
            size="md"
            fullWidth={true}
            onClick={handleEdit}
            variant="gradient"
            style={{ background: '#97B980', color: '#ffffff' }}
          >
            <span>تعديل  </span>
          </Button>
        <Button
          size="sm"
          className="mt-3"
          fullWidth={true}
          variant="gradient"
          style={{ background: "#FE5500", color: "#ffffff" }}
          onClick={handleDeleteConfirmation}
        >
          <span>حذف المركز</span>
        </Button>
        </div>
        )}
      </Drawer>

      <Confirm open={deleteConfirmation} handler={handleDeleteConfirmation} method={DeleteMethod} message="   هل انت متأكد من حذف المركز بالموقع المحدد؟" />
    </>
  );
}
