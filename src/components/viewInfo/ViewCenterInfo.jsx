import {useState} from "react";
import Confirm from "../messages/Confirm"
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  ListItemPrefix,
  Chip,
  List,
  ListItem,
} from "@material-tailwind/react";
import {
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiClock,
  HiPhotograph,
  HiOutlineGlobeAlt,
} from "react-icons/hi";
import{FaRecycle,} from 'react-icons/fa'
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';


const arabicDays = ['- الجمعة', '- السبت','- ايام الاسبوع'  ];

const formatTimeRange = (from, to) => {
  const fromDate = parseISO(from);
  const toDate = parseISO(to);

  // Define the Arabic strings for AM and PM
  const amString = "ص";
  const pmString = "م";

  // Format the time using Arabic AM and PM
  const formattedFrom = format(fromDate, 'hh:mm', { locale: enUS })+ ` ${fromDate.getHours() >= 12 ? pmString : amString}`;
  const formattedTo = format(toDate, 'hh:mm', { locale: enUS }) + ` ${toDate.getHours() >= 12 ? pmString : amString}`;

  return `${formattedFrom} إلى ${formattedTo}`;
};

const formatOpeningHours = (center) => {
  if (!center.openingHours) {
    return 'معلومات ساعات العمل غير متوفرة';
  }

  const orderedDays = ['fri', 'sat', 'weekdays']; // Define the desired order of days
  return (
    <ul>
      {orderedDays.map((day) => {
        const dayData = center.openingHours[day];
        return (
          <li key={day}>
            <span style={{ fontWeight: 'bold', marginLeft: '8px'  }}>
              {arabicDays[orderedDays.indexOf(day)]} : 
            </span>
            <span style={{ marginLeft: '8px' }} >
               {dayData.isClosed ? 'مغلق' : formatTimeRange(dayData.from, dayData.to)}
            </span>
          </li>
        );
      })}
    </ul>
  );
};



export default function ViewCenterInfo({open, onClose , DeleteMethod, center}){

  const [deleteConfirmation , setDeleteConfirmation] = useState(false);
  const handleDeleteConfirmation = () => (setDeleteConfirmation(!deleteConfirmation));


 
  const types = center.type || [];
  const typeList = types.map((type, index) => (
    <Chip key={index} style={{ background: "#07512D", color: "#ffffff" }} value={type} />
  ));


    return(
      <>
      <Drawer
      placement="right"
      size={450}
      open={open}
      onClose={onClose}
      className="p-5 font-baloo overflow-y-auto"
      
    >
      <div className="mb-4 flex items-center justify-between ">
        <Typography variant="h5">
          <span>{center.name}</span>
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </div>
  


          <div className="flex justify-center h-56">
           
  <div> <img
                    
                  src={center.logoURL} 
                  alt="image 1"
               
      />
      </div>
      <div>
      <img
    
      src={center.imageURL} alt="image 2"
    
    />
</div> 
     


          </div>
        


<li className="centerInfo"> 
<List>
          <ListItem ripple={false}>
       <ul> 
          <ListItemPrefix className="flex mt-3 pb-2">
            <HiOutlineInformationCircle className="h-5 w-5 ml-2" />
            <span className="font-medium">عن المركز :</span>
          </ListItemPrefix>
          <Typography className="description font-baloo"> 
           <span>{center.description}</span>
           </Typography>
        </ul>
        </ListItem>


        <ListItem ripple={false}>
        <ul>
          <ListItemPrefix className="flex pb-2">
            <FaRecycle className="h-5 w-5 ml-2" />
            <span className="font-medium ">النفايات المستقبلة :</span>
          </ListItemPrefix>
        <div className="flex wrap gap-2 justify-end"> {typeList} </div>
       </ul>
      </ListItem>


       
      <ListItem ripple={false}>
 <ul className="flex flex-col gap-2 ">
  <ListItemPrefix className="flex ">
    <HiClock className="h-5 w-5 ml-2" />
    <span className="font-medium">ساعات العمل:</span>
  </ListItemPrefix>

  <div className="opening-hours">
    {center.openingHours ? formatOpeningHours(center) : 'معلومات ساعات العمل غير متوفرة'}
  </div>

</ul>
     </ListItem>


<ListItem ripple={false}>
              <ul>
                <ListItemPrefix className="flex pb-2">
                  <HiOutlineGlobeAlt className="h-5 w-5 ml-2" />
                  <span className="font-medium">رابط الموقع الإلكتروني:</span>
                </ListItemPrefix>
                <Typography  as="a"  href={center.websiteURL} color="blue-gray" className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500">
               <span>إضغط هُنا </span> 
              </Typography>
              </ul>
            </ListItem>

            {/* <ListItem ripple={false}>
              <ul className="flex gap-2">
                <ListItemPrefix className="flex pb-2">
                  <HiPhotograph className="h-5 w-5 ml-2" />
                  <span className="font-medium">شعار المركز:</span>
                </ListItemPrefix>
                <img
                  className="h-12 w-12 rounded-lg object-cover object-center"
                  src={center.logoURL} // Provide a default logo image path
                  alt="center logo"
                />
              </ul>
            </ListItem> */}

     <ListItem ripple={false}>
         <ul className="flex gap-2">
           <ListItemPrefix className="flex">
            <HiOutlinePhone className="h-5 w-5 ml-2" />
            <span className="font-medium">رقم الهاتف:</span>
          </ListItemPrefix>
            <span className="block"> {center.phoneNo}</span>
        </ul>
      </ListItem>

        </List>
        </li>
        

      <Button
        size="sm"
        className="mt-3"
        fullWidth={true}
        variant="gradient"
        style={{ background: "#FE5500", color: "#ffffff" }}
        onClick={handleDeleteConfirmation}
      >
        <span>حذف المركز </span>
      </Button>
    </Drawer>

    <Confirm  open={deleteConfirmation} handler={handleDeleteConfirmation} method={DeleteMethod}  message="   هل انت متأكد من حذف حاوية النفاية بالموقع المحدد؟"/>
    </>
    
    )
}


