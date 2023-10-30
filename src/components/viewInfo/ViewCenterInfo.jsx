import { useState  , useEffect} from "react";
import Confirm from "../messages/Confirm";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { db } from "/src/firebase";
import { collection , doc ,  onSnapshot  , updateDoc} from 'firebase/firestore';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

const arabicDays = ['- الجمعة', '- السبت', '- ايام الاسبوع'];

const formatTimeRange = (from, to) => {
  //console.log("ceheck",editedCenterData.openingHours.fri);
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
              {console.log("days " ,day)}
            </span>
          </li>
        );
      })}
    </ul>
  );
};


export default function ViewCenterInfo({ open, onClose, DeleteMethod, center , centerID}) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showCenterLogo, setShowCenterLogo] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [time, setTime] = useState(dayjs('2022-04-17T00:00'));

  const[listOpeningHours , setListOpeningHours] = useState({
    fri:{ from: '', to: '', isClosed: false },
    weekdays:{ from: '', to: '' },
    sat: { from: '', to: '', isClosed: false },
  });


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

  const [wasteListTypes, setWasteListTypes] = useState([]);

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

   const [editedWasteTypes, setEditedWasteTypes] = useState(center.types || []);

   const options = [
    { value: 'بلاستيك', label: 'بلاستيك' },
    { value: 'ورق', label: 'ورق' },
    { value: 'زجاج', label: 'زجاج' },
    { value: 'كرتون', label: 'كرتون' },
    { value: 'معدن', label: 'معدن' },
    { value: 'إلكترونيات', label: 'إلكترونيات' },
    { value: 'أخرى', label: 'أخرى' },
  ];

  


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


  useEffect(() => {
    const centerCollection = collection(db, 'recyclingCenters');
    const unsubscribe = onSnapshot(centerCollection, (snapshot) => {
      const centerInfo = [];
  
      snapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;
        // Check if the 'isAdmin' field is explicitly set to false
        if(centerID ==id ) {

  const wasteTypes = centerData.type || [];

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
  
      setCenterData(centerInfo);// store staff information
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



  const handleEdit = () => {
 

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


 const handleSaveEdit = async () => {
  // Create a reference to the staff member's document in the database

  

  const centerUpdate = doc(db, 'recyclingCenters', centerID);
  // Prepare the data to be updated
  const updatedData = {
    name: centerData.name,
    description: centerData.description,
    websiteURL: centerData.websiteURL,
    phoneNo: centerData.phoneNo,
  };

  if (centerData.types) {
    updatedData.type = centerData.types;
  }

  if (editedCenterData.imageURL) {
    updatedData.imageURL = editedCenterData.imageURL;
  }

  if (editedCenterData.logoURL) {
    updatedData.logoURL = editedCenterData.logoURL;
  }

  // Handle the opening hours fields
 
  const centerOpeningHours = {
    fri: {
      from: centerData.openingHours.fri.isClosed ? '' : centerData.openingHours.fri.from.toDate().toISOString(),
      to: centerData.openingHours.fri.isClosed ? '' : centerData.openingHours.fri.to.toDate().toISOString(),
      isClosed: centerData.openingHours.fri.isClosed,

      },
   
    weekdays: {
      from: centerData.openingHours.weekdays.from.toDate().toISOString(),
      to: centerData.openingHours.weekdays.to.toDate().toISOString(),
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
    console.log("fri" , centerData.openingHours.fri);
    console.log("sat" , centerData.openingHours.sat);

    await updateDoc(centerUpdate, updatedData);

    // Exit edit mode and clear the edited data
    setEditMode(false);
    setCenterData(updatedData)

    // You may also want to update the staffMembers state to reflect the changes.
    // You can fetch the updated data from the database and update the state if needed.
  } catch (error) {
    console.error('Error updating document: ', error);
    // Handle the error as needed (e.g., show an error message to the user).
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

    console.log(centerData.types);
  }
 

  return (
    <>
      <Drawer placement="right" size={450} open={open} onClose={onClose} className="p-5 font-baloo overflow-y-auto">
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

        <div className="flex justify-center h-56">
          <div style={{ width: "100%", maxHeight: "100%", overflow: "hidden", textAlign: "center" }}>
            {showCenterLogo ? (
              <img src={center.logoURL} alt="Center Logo" style={{ width: "100%", height: "100%" }} />
            ) : (
              <img src={center.imageURL} alt="Center Photo" style={{ width: "100%", height: "100%" }} />
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
          <div className="flex wrap gap-2 justify-end mr-8">
          

<div className="flex wrap gap-2 justify-end mr-8">
            {wasteListTypes}
          </div>

           
          </div>
        )}
      </ul>
      </ListItem>





   

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
                                value={ centerData.openingHours.fri.to || time}
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
                    <span>إضغط هُنا</span>
                  </Typography>
                )}
              </ul>
            </ListItem>

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

       

        {editMode ? (
          <Button
            size="sm"
            className="mt-3"
            fullWidth={true}
            variant="gradient"
            style={{ background: "#97B980", color: "#ffffff" }}
            onClick={handleSaveEdit}
          >
            <span>حفظ</span>
          </Button>
        ) : (
          <Button
            size="sm"
            className="mt-3"
            fullWidth={true}
            variant="gradient"
            style={{ background: "#808080", color: "#ffffff" }}
            onClick={handleEdit}
          >
            <span>تعديل المركز</span>
          </Button>
        )}

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
      </Drawer>

      <Confirm open={deleteConfirmation} handler={handleDeleteConfirmation} method={DeleteMethod} message="   هل انت متأكد من حذف حاوية النفاية بالموقع المحدد؟" />
    </>
  );
}
