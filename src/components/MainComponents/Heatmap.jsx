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
  
  // Register the components you will use
  ChartJS.register(ArcElement, Tooltip, Legend, Colors);

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    // const [binId , setBinId] = useState();
   

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
          complaintData.push({ id: doc.id, location, type: data.complaintType, date: data.complaintDate.toDate() });
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


  const complaintTypes = complaintData.reduce((acc, complaint) => {
    acc[complaint.type] = (acc[complaint.type] || 0) + 1;
    return acc;
  }, {});

  const data = {
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
          '#07512D' // dark green
     
          // Make sure to adjust these colors so each complaint type has a unique color.
        ],
        hoverOffset: 7
      }
    ]
  };

  // Function to filter garbage bins based on type
//   const filterComplaints = (type) => {
//     if (type === 'الكل') {
//       // If no type is selected, show all bins
//       setComplaints(complaintData);
//     } else {
//       // Filter bins based on the selected type
//       const filteredComplaints = complaintData.filter((comp) => comp.type === type);
//       setComplaints(filteredComplaints);
//     }
//   };
// Call filterComplaints function whenever selectedComplaintType, startDate or endDate changes



const filterComplaints = () => {
    let updatedComplaints = complaintData;
  
    // Filter by complaint type if necessary
    if (selectedComplaintType.length > 0 && !selectedComplaintType.includes("الكل")) {
      updatedComplaints = updatedComplaints.filter(comp => selectedComplaintType.includes(comp.type));
    }
  
    // Filter by date range
    updatedComplaints = updatedComplaints.filter(comp => {
      const complaintDate = comp.date; // Assuming `date` is a JavaScript Date object
      return (!startDate || complaintDate >= startDate) && (!endDate || complaintDate <= endDate);
    });
  
    setComplaints(updatedComplaints);
  };


// const filterComplaints = (types) => {
//     if (types.length === 0 || types.includes("الكل")) {
//       // If no types are selected or "الكل" is selected, show all complaints
//       setComplaints(complaintData);
//     } else {
//       // Filter complaints to include only those with a type in the selected types
//       const filteredComplaints = complaintData.filter(comp => types.includes(comp.type));
//       setComplaints(filteredComplaints);
//     }
//   };
  
// Function to handle the selection of a bin size
// const handleComplaintTypeSelect = (selectedOption) => {
//   setSelectedComplaintType(selectedOption.value);
//   filterComplaints(selectedOption.value);
// };

// When user selects a different type, apply filters
const handleComplaintTypeSelect = (selectedOptions) => {
    // Map selected options to their values
    const selectedTypes = selectedOptions.map(option => option.value);
    setSelectedComplaintType(selectedTypes);
  
    // Here you call filterComplaints to apply both type and date filters
    filterComplaints();
  };
  
  // When user selects a different date range, apply filters
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    
    // Apply filter with the new date range
    filterComplaints();
  };

// const handleComplaintTypeSelect = (selectedOptions) => {
//     // Map selected options to their values
//     const selectedTypes = selectedOptions.map(option => option.value);
//     setSelectedComplaintType(selectedTypes);
//     filterComplaints(selectedTypes);
//   };
  



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
    
        <Button
          style={{ background: '#FE9B00', color: '#ffffff' }}
          size="sm"
          onClick={handleUserLocation}>
          <span>عرض الموقع الحالي</span>
        </Button>

        
        <DatePicker
  selectsRange={true}
  startDate={startDate}
  endDate={endDate}
  onChange={handleDateChange}
  isClearable={true}
/>

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
  value={typeOptions.filter(option => selectedComplaintType.includes(option.value))}
  onChange={(selectedOptions) => handleComplaintTypeSelect(selectedOptions)}
  required
/>

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

<div className='flex ' style={{ width: '100%', maxWidth: '300px', height: 'auto', aspectRatio: '1' }}>
<Doughnut data={data} options={{ maintainAspectRatio: true }}/>

 </div>

      </div>
    ) : <></>
  }
  