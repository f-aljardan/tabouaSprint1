import {
  Drawer,
  Button,
  Typography,
  IconButton,
  ListItemPrefix,
  Chip,

} from "@material-tailwind/react";
import {
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiClock,
} from "react-icons/hi";
import{FaRecycle,} from 'react-icons/fa'
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

const arabicDays = ['الجمعة', 'السبت','ايام الاسبوع'  ];

const formatTimeRange = (from, to) => {
  const fromDate = parseISO(from);
  const toDate = parseISO(to);
  const formattedFrom = format(fromDate, 'hh:mm a', { locale: enUS });
  const formattedTo = format(toDate, 'hh:mm a', { locale: enUS });
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
            <span style={{ fontWeight: 'bold' }}>
              {arabicDays[orderedDays.indexOf(day)]}:
            </span>
            <span style={{ marginLeft: '8px' }}>
              {dayData.isClosed ? 'مغلق' : formatTimeRange(dayData.from, dayData.to)}
            </span>
          </li>
        );
      })}
    </ul>
  );
};



export default function ViewCenterInfo({open, onClose , Deletemethod, center}){

  


console.log(center.openingHours )
 
  const types = center.type || [];
  const typeList = types.map((type, index) => (
    <Chip key={index} style={{ background: "#FE9B00", color: "#ffffff" }} value={type} />
  ));


    return(
      <Drawer
      placement="right"
      size={400}
      open={open}
      onClose={onClose}
      className="p-4 font-baloo overflow-y-auto"
      
    >
      <div className="mb-4 flex items-center justify-between ">
        <Typography variant="h5" color="blue-gray">
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
  
          <div className="flex justify-center">
    <img
      className="h-36 w-full rounded-lg object-cover object-center"
      src={center.imageURL} alt="nature image"
    />
          </div>
        

<li className="centerInfo"> 

       <ul> 
          <ListItemPrefix className="flex mt-3">
            <HiOutlineInformationCircle className="h-5 w-5 ml-2" />
            <span className="font-medium">عن المركز :</span>
          </ListItemPrefix>
          <div className="descriotion"> 
           {center.description}
           </div>
        </ul>

        <ul>
          <ListItemPrefix className="flex">
            <FaRecycle className="h-5 w-5 ml-2" />
            <span className="font-medium">النفايات المستقبلة :</span>
          </ListItemPrefix>
        <div className="flex wrap gap-2 justify-end"> {typeList} </div>
       </ul>
    
      


       

 <ul className="flex gap-2">
  <ListItemPrefix className="flex">
    <HiClock className="h-5 w-5 ml-2" />
    <span className="font-medium">ساعات العمل:</span>
  </ListItemPrefix>
  {/* <div className="opening-hours">
    {center.openingHours
      ? Object.keys(center.openingHours).map((day) => {
          const dayData = center.openingHours[day];
          return (
            <div key={day}>
              {day}: {dayData.isClosed ? "مغلق" : `من ${dayData.from} إلى ${dayData.to}`}
            </div>
          );
        })
      : 'Opening hours information not available'}
  </div> */}
  <div className="opening-hours">
    {center.openingHours ? formatOpeningHours(center) : 'معلومات ساعات العمل غير متوفرة'}
  </div>
</ul>




         <ul className="flex gap-2">
           <ListItemPrefix className="flex">
            <HiOutlinePhone className="h-5 w-5 ml-2" />
            <span className="font-medium">رقم الهاتف:</span>
          </ListItemPrefix>
            <span className="block"> {center.phoneNo}</span>
        </ul>

        </li>
      <Button
        size="sm"
        className="mt-3"
        fullWidth={true}
        variant="gradient"
        style={{ background: "#FE5500", color: "#ffffff" }}
        onClick={Deletemethod}
      >
        <span>حذف المركز </span>
      </Button>
    </Drawer>
    
    )
}



// <Dialog size="md" open={open} handler={handler} >
                    
// <DialogHeader className="flex justify-center font-baloo text-center"> {center.name}</DialogHeader>

// <DialogBody divider className="font-baloo text-right">
// {center.description}
// <br/>
// <br/>
// <div className="flex gap-2 justify-end">
// {typeList}
// </div>
// </DialogBody>

// <DialogFooter  className="flex gap-3 justify-center ">

// <Button variant="outlined"  onClick={handler}>
//     <span>إغلاق</span>
//   </Button>

//   <Button variant="gradient"  style={{background:"#FE5500", color:'#ffffff'}}  onClick={Deletemethod}>
//     <span>حذف</span>
//   </Button>
// </DialogFooter>
// </Dialog>
