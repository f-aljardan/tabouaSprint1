import React , {useState, useEffect, useRef} from 'react'
import { GoogleMap, useJsApiLoader, Marker , Circle, HeatmapLayer } from '@react-google-maps/api';
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc ,getDoc, Timestamp,updateDoc } from "firebase/firestore"; 
import { Button} from "@material-tailwind/react";
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Colors
  } from 'chart.js';
  
  import { Bar } from 'react-chartjs-2';

import { CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  // Register the components you will use
  ChartJS.register(ArcElement, Tooltip, Legend, Colors);

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ErrorAlertMessage from "../utilityComponents/messages/ErrorAlertMessageFilter"
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const googleMapsLibraries = ["visualization"];

// Define constants for the Google Map
const containerStyle = {
  width: '100%', 
    height: '100%'
};
// Set the initial center for the  Google Map
const center = {
  lat: 24.7136,
  lng: 46.6753
};

//options for the select component
const typeOptions = [
    { value: "الكل", label: "الكل" },
    { value: "نظافة الحاوية", label: "نظافة الحاوية" },
    { value: "حاوية ممتلئة", label: "حاوية ممتلئة" },
    { value: 'موقع الحاوية', label: 'موقع الحاوية' },
    { value: 'مخلفات مهملة', label: 'مخلفات مهملة' },
    { value: 'مخلفات خطرة', label: 'مخلفات خطرة' },
    { value: 'وقت تفريغ الحاوية', label: 'وقت تفريغ الحاوية' },
    { value: "أخرى", label: "أخرى" },
  ];
  
  const statusOptions = [
    { value: "الكل", label: "الكل" },
    { value: "جديد", label: "جديد" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
    { value: 'تم التنفيذ', label: 'تم التنفيذ' },
    { value: "مرفوض", label: "مرفوض" },
  ];


export default function Heatmap(){

    const [map, setMap] = React.useState(null)
    const [complaints, setComplaints] = useState([]);
    const [complaintData ,SetComplaintData] = React.useState([]);
    const [selectedComplaintType, setSelectedComplaintType] = useState([]);
    const [zoom, setZoom] = useState(11); // set the initial zoom level
    const [userPosition, setUserPosition] = useState(null);
    const [showUserLocation, setShowUserLocation] = useState(false);
    const [userLocationRange, setUserLocationRange] = useState(null);
    const mapRef = useRef(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    // const [binId , setBinId] = useState();
 
    const [showAlertStreet, setShowAlertStreet] = useState(false);
    const handleAlertStreet = () => setShowAlertStreet(!showAlertStreet);
    

 // all google map initilization related function starts here
  // Load Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk",
    libraries: googleMapsLibraries
  })


// Callback function when the map loads
  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map; // Store the map object in the ref
    
  }, []);


  // Callback function when the component unmounts
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
    mapRef.current = null;
  }, [])

 

 // all google map initilization related function ends here


  // Load all complaint data from database
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "complaints"));
        const complaintData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const location = data.location || {}; // Ensure location is an object
          complaintData.push({ id: doc.id, location, type: data.complaintType, status: data.status ,complaintDate: data.complaintDate, responseDate: data.responseDate });
        });

        // Initially, set all garbage bins
        setComplaints(complaintData);

        // Store the bin data for filtering
        SetComplaintData(complaintData);

        
    

      } catch (error) {
        console.error('Error fetching garbage bins:', error);
      }
    };

    fetchComplaints();
  }, []);

  const [averageResolutionTime, setAverageResolutionTime] = useState(0);
  
  useEffect(()=>{
    const { averageResolutionTime } = calculateResolutionTimes(complaints);
      setAverageResolutionTime(averageResolutionTime);
  }, [complaints])


  const [typeData, setTypeData] = useState({});
  const [statusData, setStatusData] = useState({});
  const statusColors = {
    "جديد": "teal",
    "قيد التنفيذ": "#F5DA4A",
    "تم التنفيذ": "#97B980",
    "مرفوض":  "#FE5500",
    // Add more status colors as needed
  };
  

  useEffect(() => {

  

  const complaintTypes = complaints.reduce((acc, complaint) => {
    acc[complaint.type] = (acc[complaint.type] || 0) + 1;
    return acc;
  }, {});

setTypeData ({
    labels: Object.keys(complaintTypes),
    datasets: [
      {
        label: 'عدد البلاغات',
        data: Object.values(complaintTypes),
        backgroundColor: [
          '#FF6384', // pink
          'teal', // Blue
          '#F5DA4A', // Yellow
          '#FE5500', // red
          '#FE9B00', // orange
          '#97B980', // Light green
          '#07512D', // dark green
         
          // Make sure to adjust these colors so each complaint type has a unique color.
        ],
        hoverOffset: 7
      }
    ]
  });

  
  let statusCounts = complaints.reduce((acc, complaint) => {
    // Assuming each complaint has a 'status' property
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    return acc;
  }, {});
  
  setStatusData({
    labels: Object.keys(statusCounts), // ["New", "In Progress", "Resolved"]
    datasets: [{
      label: 'توزيع الحالات',
      data: Object.values(statusCounts), 
      backgroundColor: Object.keys(statusCounts).map(status => statusColors[status] || '#999'),
      borderColor: Object.keys(statusCounts).map(status => statusColors[status] || '#999'),
      borderWidth: 1,
    }]
  });
}, [complaints]);


  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    
  };
  



 
  // const calculateResolutionTimes = (complaints) => {
  //   const resolutionTimes = complaints.map(complaint => {
  //     const createdAt = new Date(complaint.complaintDate).getTime();
  //     const resolvedAt = new Date(complaint.responseDate).getTime();
  //     return resolvedAt - createdAt;
  //   });
    
  //   const averageResolutionTime = resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length;
    
  //   return {
  //     resolutionTimes,
  //     averageResolutionTime
  //   };
  // };
  const calculateResolutionTimes = (complaints) => {
    console.log("here")
    // Filter complaints to ensure both dates are present
    const validComplaints = complaints.filter(complaint => complaint.complaintDate && complaint.responseDate);
    console.log("here7")
    console.log(validComplaints)
    const resolutionTimes = validComplaints.map(complaint => {
    
      const createdAt = complaint.complaintDate.toDate().getTime();
      const resolvedAt = complaint.responseDate.toDate().getTime();
      // Return time in hours
      const resolutionTime = (resolvedAt - createdAt) / (1000 * 60 * 60);
      console.log(`createdAt: ${createdAt}, resolvedAt: ${resolvedAt}, resolutionTime: ${resolutionTime} hours`);
      return resolutionTime;
    });

    
    // Avoid division by zero by ensuring the array length is not zero
    const averageResolutionTime = resolutionTimes.length > 0
      ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
      : 0;
    
    return {
      resolutionTimes,
      averageResolutionTime // This is now in hours
    };
  };
  
  

// const filterComplaints = (types) => {
//   // Check if "الكل" is among the selected types or if the array is empty
//   if (types.includes('الكل') || types.length === 0) {
//     // If "الكل" is selected or no types are selected, show all complaints
//     setComplaints(complaintData);
//   } else {
//     // Filter complaints to include only those with a type in the selected types
//     const filteredComplaints = complaintData.filter((comp) => types.includes(comp.type));
//     setComplaints(filteredComplaints);
//   }
// };

useEffect(() => {
  filterComplaints();
}, [selectedStatus, selectedComplaintType]); // Re-run filter when these dependencies change


const filterComplaints = () => {
  let filteredComplaints = complaintData;

  // Filter by selected complaint types (if applicable)
  if (selectedComplaintType.length > 0 && !selectedComplaintType.includes("الكل")) {
    filteredComplaints = filteredComplaints.filter(comp => selectedComplaintType.includes(comp.type));
  }

  // Filter by selected status (if not 'all')
  if (selectedStatus !== "الكل") {
    filteredComplaints = filteredComplaints.filter(comp => comp.status === selectedStatus);
  }
 
  setComplaints(filteredComplaints);
  
};


// const handleComplaintTypeSelect = (selectedOption) => {
//   setSelectedComplaintType(selectedOption.value);
//   filterComplaints(selectedOption.value);
// };

// Handle selection changes for complaint type
const handleComplaintTypeSelect = (selectedOptions) => {
  const selectedTypes = selectedOptions ? selectedOptions.map(option => option.value) : [];

  setSelectedComplaintType(selectedTypes);
  filterComplaints();
  // No need to pass selectedTypes since filterComplaints accesses state directly
};





  // Function to get the user's location
  const handleUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition({ lat: latitude, lng: longitude });
        setShowUserLocation(true);
        setUserLocationRange({ lat: latitude, lng: longitude, radius: 5 });

        if (mapRef.current) {
          const map = mapRef.current;

          // Set the center of the map to the user's location
          map.setCenter(userPosition);


 // Directly set the zoom level of the map
setZoom(18);
          
        }
      });
    } else {
      alert('Geolocation is not available in your browser.');
    }
  };

  

return isLoaded ? (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
 
 

        <div className="flex gap-5 p-4 mr-12 z-10" style={{ position: 'absolute' }}>
          <div className='flex-col'>
    <div className='flex gap-5'>
        <Button
          style={{ background: '#FE9B00', color: '#ffffff' }}
          size="sm"
          onClick={handleUserLocation}>
          <span>عرض الموقع الحالي</span>
        </Button>

        
        {/* <DatePicker
  selectsRange={true}
  startDate={startDate}
  endDate={endDate}
  onChange={handleDateChange}
  isClearable={true}
/> */}

          {/* <Select
            placeholder="تصفية حسب حجم الحاوية..."
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={typeOptions}
            value={selectedComplaintType !== null ? typeOptions.find((option) => option.value === selectedComplaintType) : null}
            onChange={(value) => handleComplaintTypeSelect(value)}
            required
           
          /> */}
<Select
  isMulti
  placeholder="تصفية حسب نوع البلاغ..."
  closeMenuOnSelect={false}
  components={animatedComponents}
  options={typeOptions}
  value={selectedComplaintType ? typeOptions.filter(option => selectedComplaintType.includes(option.value)) : []}
  // onChange={handleComplaintTypeSelect}
  onChange={handleComplaintTypeSelect}
  
/>

<Select
   placeholder="تصفية حسب حالة البلاغ..."
   closeMenuOnSelect={false}
   components={animatedComponents}
  options={statusOptions}
  value={statusOptions.find(option => option.value === selectedStatus)}
  onChange={option => {
    setSelectedStatus(option.value);
    filterComplaints();
  }}
 
/>
</div>

{complaints.length==0?(     
   <div style={{  marginTop:10,  width: '100%', height: '100%'}}>
        <ErrorAlertMessage open={true} handler={handleAlertStreet}
         message="لا يوجد بيانات بهذا التصنيف" /> </div>
         ): null} 
  </div>


        </div>
      

        <GoogleMap
          mapContainerStyle={containerStyle}
         center={userPosition || center}
         zoom={zoom}
         onLoad={onLoad}
          ref={mapRef}
          onUnmount={onUnmount} // Callback function that gets executed when the component unmounts.
        //   onClick={onMapClick}
        >
  
  
  {complaints.length > 0 && (
        //   <HeatmapLayer
        //     data={complaints.map(comp => new google.maps.LatLng(comp.location._lat, comp.location._long))}
        //   />
          <HeatmapLayer
  data={complaints.map(comp => new google.maps.LatLng(comp.location._lat, comp.location._long))}
  options={{radius: 25, opacity: 0.7}}
/>

        )}
        
      
  
      {showUserLocation && userPosition && (
            <Marker position={userPosition} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#4285F4', fillOpacity: 0.8, strokeColor: '#4285F4' }}>
              <Circle center={userLocationRange} options={{ radius: userLocationRange.radius, strokeColor: '#4285F4', fillColor: '#4285F4', fillOpacity: 0.2 }} />
            </Marker>
          )}
  
      
  
           </GoogleMap>
{/* 
<div className='flex' style={{ width: '100%', maxWidth: '300px', height: 'auto', aspectRatio: '1' }}>
<Doughnut data={data} options={{ maintainAspectRatio: true }}/>
<Bar data={statusData} options={options} />
 </div> */}

{complaints.length==0? null:(
  <div className='flex' style={{ width: '100%', justifyContent: 'space-around' }}>
  
  <div style={{ width: '300px', height: '300px' }}>
    <Doughnut data={typeData} options={{ maintainAspectRatio: false }}/>
  </div>
  <div style={{ width: '300px', height: '300px' }}>
    <Bar data={statusData} options={{ ...options, maintainAspectRatio: false }} />
  </div>

  {(selectedStatus==="تم التنفيذ" || selectedStatus==="مرفوض") && (
    <div>
    <h2>متوسط مدة حل البلاغ:</h2>
    <p> {averageResolutionTime.toFixed(2)} ساعة</p>
  </div>
  )}
    
    
</div>
) }


      </div>
    ) : <></>
  }
  