import React , {useState, useEffect, useRef} from 'react'
import { GoogleMap, useJsApiLoader, Marker , Circle, HeatmapLayer } from '@react-google-maps/api';
import { db } from "/src/firebase";
import { getDocs, collection} from "firebase/firestore"; 
import { Button, Card, Typography, Tooltip,  } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as TooltipChart,
    Legend,
    Colors,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    BarElement,

 } from 'chart.js';
  import { Bar , Line, Doughnut} from 'react-chartjs-2';
  import FullscreenIcon from '@mui/icons-material/Fullscreen';
  import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
  


ChartJS.register( PointElement, LineElement, CategoryScale, LinearScale, BarElement, Title, TooltipChart, Legend,Colors,ArcElement);

const reactSelectStyles = {
  container: (provided) => ({
    ...provided,
    width: "250px",
  }),
};

const reactTypeSelectStyles = {
  container: (provided) => ({
    ...provided,
    width: "450px", 
  }),
};

import ErrorAlertMessage from "../utilityComponents/messages/ErrorAlertMessageFilter"
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const googleMapsLibraries = ["visualization"];

//  constants size for the Google Map
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
    { value: 'وقت تفريغ الحاوية', label: 'وقت تفريغ الحاوية' },
    { value: "أخرى", label: "أخرى" },
  ];
  
  const statusOptions = [
    { value: "الكل", label: "الكل" },
    { value: "جديد", label: "جديد" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
    { value: 'تم التنفيذ', label: 'تم التنفيذ' },
    { value: "مرفوض", label: "مرفوض" },
  ];
  

export default function Heatmap({setDirectRoute, setDirectRouteComplaint, setTypeFilter, setStatusFilter, setDateFilter, setNeighborhoodFilter}){
  const navigate = useNavigate();

    const [map, setMap] = React.useState(null)
    const [complaints, setComplaints] = useState([]);
    const [complaintData ,SetComplaintData] = React.useState([]);
    const [selectedComplaintType, setSelectedComplaintType] = useState([]);
    const [zoom, setZoom] = useState(11); // set the initial zoom level
    const [visibleMarkers, setVisibleMarkers] = useState([]);
    const [userPosition, setUserPosition] = useState(null);
    const [showUserLocation, setShowUserLocation] = useState(false);
    const [userLocationRange, setUserLocationRange] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [todaysComplaintsCount, setTodaysComplaintsCount] = useState(0);
    const [thisMonthsComplaintsCount, setThisMonthsComplaintsCount] = useState(0);
    const [thisWeeksComplaintsCount, setThisWeeksComplaintsCount] = useState(0);
    const [showNoDataAlert, setShowNoDataAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const handleAlert = () => setShowAlert(!showAlert);
    
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState({});
    
 // all google map initilization related function starts here
  // Load Google Maps JavaScript API
  const mapRef = useRef(null);

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
          complaintData.push({ id: doc.id, location, type: data.complaintType, status: data.status ,complaintDate: data.complaintDate, responseDate: data.responseDate, inprogressDate: data.inprogressDate, localArea: data.localArea });
        });

        //  set all garbage bins
        setComplaints(complaintData);

        // Store  bin data for filtering
        SetComplaintData(complaintData);

      } catch (error) {
        console.error('Error fetching garbage bins:', error);
      }
    };

    fetchComplaints();
  }, []);




  const [averageResolutionTime, setAverageResolutionTime] = useState(0);
  
  useEffect(()=>{
    const { averageResolutionTime } = calculateComplaintsResolutionTimes(complaints);
      setAverageResolutionTime(averageResolutionTime);
  }, [complaints])




  const [typeData, setTypeData] = useState({});
  const [statusData, setStatusData] = useState({});

  const statusColors = {
    "جديد": "teal",
    "قيد التنفيذ": "#F5DA4A",
    "تم التنفيذ": "#97B980",
    "مرفوض":  "#FE5500",
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
        ],
        hoverOffset: 7
      }
    ]
  });

  let statusCounts = complaints.reduce((acc, complaint) => {
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    return acc;
  }, {});
  
  setStatusData({
    labels: Object.keys(statusCounts), 
    datasets: [{
      label: 'عدد البلاغات',
      data: Object.values(statusCounts), 
      backgroundColor: Object.keys(statusCounts).map(status => statusColors[status] || '#999'),
      borderColor: Object.keys(statusCounts).map(status => statusColors[status] || '#999'),
      borderWidth: 1,
    }]
  });
}, [complaints]);


const options = {
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false, 
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'عدد البلاغات', 
      }
    },
  },
};

const typesOptions = {
  maintainAspectRatio: false,
};

  


  const calculateComplaintsResolutionTimes = (complaints) => {
   // Filter complaints that is resolved
    const validComplaints = complaints.filter(complaint => complaint.complaintDate && complaint.responseDate);
    const resolutionTimes = validComplaints.map(complaint => {
      const createdAt = complaint.complaintDate.toDate().getTime();
      const resolvedAt = complaint.responseDate.toDate().getTime();
      
      // Calculate time in milliseconds
      return resolvedAt - createdAt;
    });

  
    if (resolutionTimes.length === 0) {
      return {
        resolutionTimes: [],
        averageResolutionTime: 'No data'
      };
    }
  
    // Calculate the average resolution time in milliseconds
    const averageResolutionTimeInMilliseconds = resolutionTimes.length > 0
  ? Math.abs(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length)
  : 0;

    // Convert milliseconds to days, hours, and minutes
    let remainingTime = averageResolutionTimeInMilliseconds;

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    remainingTime %= (1000 * 60 * 60 * 24);
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    remainingTime %= (1000 * 60 * 60);
    const minutes = Math.floor(remainingTime / (1000 * 60));

    // Construct the formatted average resolution time string
    let formattedAverageResolutionTime = [];
    if (days > 0) formattedAverageResolutionTime.push(`${days} يوم`);
    if (hours > 0) formattedAverageResolutionTime.push(`${hours} ساعة`);
    if (minutes > 0) formattedAverageResolutionTime.push(`${minutes} دقيقة`);
  
    return {
      resolutionTimes,
      averageResolutionTime: formattedAverageResolutionTime.join(', ') || 'أقل من دقيقة'
    };
  };
  

  




useEffect(() => {
  filterComplaints();
}, [selectedStatus, selectedComplaintType]); 

const filterComplaints = () => {
  let filteredComplaints = complaintData;
  let didFilter = false;

  const isAllSelected = selectedComplaintType.some(option => option.value === "الكل");
 
  if (selectedComplaintType.length === 0 || isAllSelected) {
    setComplaints(filteredComplaints);
  }

  if (selectedStatus =="" || selectedStatus == "الكل") {
    setComplaints(filteredComplaints);
  }

  if (selectedComplaintType.length > 0 && !isAllSelected) {
    filteredComplaints = filteredComplaints.filter(complaint => {
      const isTypeMatch = selectedComplaintType.some(type => {
        const match = type.value === complaint.type;
        return match;
      });
      return isTypeMatch;
    });

    didFilter = true;
  }

  setComplaints(filteredComplaints);
  
  if (selectedStatus !=="" && selectedStatus !== "الكل") {
    filteredComplaints = filteredComplaints.filter(complaint =>
      complaint.status === selectedStatus);
      didFilter = true;
  }

  setComplaints(filteredComplaints);

  if( didFilter && filteredComplaints.length === 0){
    setShowNoDataAlert(true);
  }else{
    setShowNoDataAlert(false);
  }
};

const handleComplaintTypeSelect = (selectedOptions) => {
  setSelectedComplaintType(selectedOptions || []);
};




useEffect(() => {
  // "today" at the start of the day for correct comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0); // reset time for consistent comparison
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  let todaysCount
  let monthsCount 
  let weeksCount

  if(selectedStatus==="قيد التنفيذ"){

    todaysCount = complaints.filter(complaint => {

      if(complaint.status==="قيد التنفيذ"){

      const complaintDate = new Date(complaint.inprogressDate.seconds * 1000);
      complaintDate.setHours(0, 0, 0, 0); 
      return complaintDate.getTime() === today.getTime();
    } } ).length;
 
     monthsCount = complaints.filter(complaint => {
      if(complaint.status==="قيد التنفيذ"){
      const complaintDate = new Date(complaint.inprogressDate.seconds * 1000);
      return complaintDate >= startOfMonth;
  }}).length;
  
     weeksCount = complaints.filter(complaint => {
      if(complaint.status==="قيد التنفيذ"){
      const complaintDate = new Date(complaint.inprogressDate.seconds * 1000);
      return complaintDate >= startOfWeek;
  }}).length;
 
  }else if(selectedStatus==="تم التنفيذ" || selectedStatus==="مرفوض"){
    todaysCount = complaints.filter(complaint => {
      if(complaint.status==="تم التنفيذ" || complaint.status==="مرفوض"){
      const complaintDate = new Date(complaint.responseDate.seconds * 1000);
      complaintDate.setHours(0, 0, 0, 0); 
      return complaintDate.getTime() === today.getTime();
  }}).length;
  
     monthsCount = complaints.filter(complaint => {
      if(complaint.status==="تم التنفيذ" || complaint.status==="مرفوض"){
      const complaintDate = new Date(complaint.responseDate.seconds * 1000);
      return complaintDate >= startOfMonth;
  }}).length;
  
     weeksCount = complaints.filter(complaint => {
      if(complaint.status==="تم التنفيذ" || complaint.status==="مرفوض"){
      const complaintDate = new Date(complaint.responseDate.seconds * 1000);
      return complaintDate >= startOfWeek;
  }}).length;

  }else{
     todaysCount = complaints.filter(complaint => {
      const complaintDate = new Date(complaint.complaintDate.seconds * 1000);
      complaintDate.setHours(0, 0, 0, 0); 
      return complaintDate.getTime() === today.getTime();
    }).length;
  
     monthsCount = complaints.filter(complaint => {
      const complaintDate = new Date(complaint.complaintDate.seconds * 1000);
      return complaintDate >= startOfMonth;
    }).length;
  
     weeksCount = complaints.filter(complaint => {
      const complaintDate = new Date(complaint.complaintDate.seconds * 1000);
      return complaintDate >= startOfWeek;
    }).length;
  
  }
  setTodaysComplaintsCount(todaysCount);
  setThisMonthsComplaintsCount(monthsCount);
  setThisWeeksComplaintsCount(weeksCount);
}, [complaints]);




const showComplaintsByMonth = (complaints, year) => {
  const complaintCounts = {};
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  complaints.forEach(complaint => {
    const complaintDate = new Date(complaint.complaintDate.seconds * 1000);
    const month = complaintDate.getMonth();
    const complaintYear = complaintDate.getFullYear();
    const yearMonthKey = `${complaintYear}-${(month + 1).toString().padStart(2, '0')}`;

    if (complaintYear === year) {
      complaintCounts[yearMonthKey] = (complaintCounts[yearMonthKey] || 0) + 1;
    }
  });

  const allMonths = Array.from({ length: 12 }, (_, i) => `${year}-${(i + 1).toString().padStart(2, '0')}`);
  const counts = allMonths.map(key => complaintCounts[key] || 0);

  const pointBackgroundColors = allMonths.map(key => {
    const [year, month] = key.split('-').map(Number);
   
    // If the year is the current year and the month is in the future, make it transparent
    if (year === currentYear && month - 1 > currentMonth) {
      return 'transparent';
    }
    // otherwise use the blue color
    return 'rgb(54, 162, 235)';
  });

  const datasets = [{
    label: 'عدد البلاغات بالشهر',
    data: counts,
    fill: false,
    backgroundColor: 'rgb(54, 162, 235)',
    borderColor: 'rgba(54, 162, 235, 0.2)',
    pointBackgroundColor: pointBackgroundColors, 
  }];

  const labels = allMonths.map(key => {
    const [year, month] = key.split('-');
    return new Date(year, month - 1).toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
  });

  return {
    labels: labels,
    datasets: datasets,
  };
};

const lineChartOptionsForMonth = {
  scales: {
    x: {
      title: {
        display: true,
        text: 'الشهر',
      },
    },
    y: {
      title: {
        display: true,
        text: 'عدد البلاغات',
      },
      beginAtZero: true,
    },
  },
};

const updateChartForYear = (selectedYear) => {
  const filteredComplaints = complaints.filter(complaint => {
    const complaintDate = new Date(complaint.complaintDate.seconds * 1000);
    return complaintDate.getFullYear() === selectedYear;
  });

  const updatedChartData = showComplaintsByMonth(filteredComplaints, selectedYear);
  setChartData(updatedChartData);
};

useEffect(() => {
  updateChartForYear(selectedYear);
}, [selectedYear, complaints]);

// Function to handle year selection change
const handleYearChange = (selectedOption, setSelectedYear) => {
  setSelectedYear(selectedOption.value);
};

const uniqueYears = [...new Set(complaints.map(complaint => new Date(complaint.complaintDate.seconds * 1000).getFullYear()))];
uniqueYears.sort();



const arabicMonthToNumber = {
  "يناير": "1", "فبراير": "2", "مارس": "3", "أبريل": "4",
  "مايو": "5", "يونيو": "6", "يوليو": "7", "أغسطس": "8",
  "سبتمبر": "9", "أكتوبر": "10", "نوفمبر": "11", "ديسمبر": "12"
};

const convertArabicNumerals = (arabicYear) => {
  const arabicToWestern = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' };
  return arabicYear.split('').map(char => arabicToWestern[char] || char).join('');
};

const convertYearMonthNameToNumber = (label) => {
  // Split the label into month and year
  const [monthName, arabicYear] = label.trim().split(' ');

  // Convert the Arabic year to a english year
  const westernYear = convertArabicNumerals(arabicYear);

  // Map the Arabic month name to a month number
  const monthNumber = arabicMonthToNumber[monthName];

  return westernYear + "-" + monthNumber;
};



const extractNeighborhood = (localArea) => {
  // Check if localArea starts with a postal code 
  const postalCodeRegex = /^\d+\s*,\s*/;
  if (postalCodeRegex.test(localArea)) {
    // Extract the part after the postal code 
    return localArea.replace(postalCodeRegex, '').trim();
  } else {
    // Extract the first part 
    return localArea.split(',')[0].trim();
  }
};


const combineComplaintsByNeighborhood = (complaints) => {
  const complaintsByNeighborhood = {};

  complaints.forEach(complaint => {
    const neighborhood = extractNeighborhood(complaint.localArea);
    complaintsByNeighborhood[neighborhood] = (complaintsByNeighborhood[neighborhood] || 0) + 1;
  });

  return complaintsByNeighborhood;
};


const { labels, data } = Object.entries(combineComplaintsByNeighborhood(complaints))
  .sort((a, b) => b[1] - a[1])
  .reduce((acc, [neighborhood, count]) => {
    acc.labels.push(neighborhood);
    acc.data.push(count);
    return acc;
  }, { labels: [], data: [] });


  const NeighborhoodComplaintsChart = ({ labels, data }) => {

    const handleClickOnChart = (evt, element) => {
      if (element.length > 0) {
        const index = element[0].index;
        const neighborhoodName = labels[index];
        
        setTypeFilter('');
        setStatusFilter("");
        setDateFilter("");
        setNeighborhoodFilter(neighborhoodName); 
        setDirectRoute(true);
        navigate(`/mainpage/complaints`); 

      }
    };

    const heightPerNeighborhood = 25;
    const displayedLabels = labels
    const displayedData = data
 
    const chartData = {
      labels: displayedLabels,
      datasets: [
        {
          label: 'عدد البلاغات',
          data: displayedData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    }; 
    
    const options = {
      onClick: handleClickOnChart,
      plugins: {
        legend: {
          display: false, 
        },
        title: {
          display: false, 
        }
      },
      indexAxis: 'y', 
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      maintainAspectRatio: false, 
      scales: {
        x: {
          title: {
            display: true,
            text: 'عدد البلاغات',
          }
        },
      },
    };

  const chartHeight = Math.max(labels.length * heightPerNeighborhood, 50); // Ensure a minimum height

    return (<div>
      <div style={{ height: `${chartHeight}px` }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>) 
  }



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
          setZoom(18);
        }
      });
    } else {
      alert('Geolocation is not available in your browser.');
    }
  };

  
  const showComplaintDetails = (complaintId) => {
    setDirectRouteComplaint(true);
    navigate(`/mainpage/complaints/${complaintId}`);
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const onZoomChanged = () => {
    const currentZoom = mapRef.current.getZoom();
      if (currentZoom >= 15) { 
        setVisibleMarkers(complaints);
      } else {
        setVisibleMarkers([]);
      }
    };

    mapRef.current.addListener('zoom_changed', onZoomChanged);
    return () => {
      if (mapRef.current) {
        window.google.maps.event.clearListeners(mapRef.current, 'zoom_changed');
      }
    };
  }, [complaints]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch((err) => {
        alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Detect fullscreen change to update the isFullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement;
      setIsFullscreen(!!fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);



return isLoaded ? (
    <div style={{ position: 'relative', width: '100%', height: '100%' }} ref={mapContainerRef}>
 
        <div className="flex gap-5 p-4 mr-12 z-10" style={{ position: 'absolute' }}>
          <div className='flex-col'>
    <div className='flex gap-5'>
    <Button
          style={{ background: '#FE9B00', color: '#ffffff' }}
          size="sm"
          onClick={handleUserLocation}>
          <span>عرض الموقع الحالي</span>
        </Button>


<Select
  isMulti
  placeholder="تصفية حسب نوع البلاغ..."
  closeMenuOnSelect={false}
  components={animatedComponents}
  options={typeOptions}
  value={selectedComplaintType}
  onChange={handleComplaintTypeSelect}
  styles={reactTypeSelectStyles}
/>


<Select
   placeholder="تصفية حسب حالة البلاغ..."
   closeMenuOnSelect={false}
   components={animatedComponents}
  options={statusOptions}
  value={statusOptions.find(option => option.value === selectedStatus)}
  onChange={ option =>{
    setSelectedStatus(option.value)
  }
}
  styles={reactSelectStyles}
/>

</div>

{showNoDataAlert ?
         ( <div style={{  marginTop:10,  width: '100%', height: '100%'}}>
             <ErrorAlertMessage open={true} handler={handleAlert}
              message="لا يوجد بيانات بهذا التصنيف" /> </div> 
         )
         : null
         } 

          </div>
          </div>
       
        <GoogleMap
         mapContainerStyle={containerStyle}
         center={userPosition || center}
         zoom={zoom}
         onLoad={onLoad}
          ref={mapRef}
          onUnmount={onUnmount} 
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
  
          <HeatmapLayer
            data={complaints.map(comp => new google.maps.LatLng(comp.location._lat, comp.location._long))}
            options={{radius: 25, opacity: 0.7, }}
            /> 
            
            {visibleMarkers.map((complaint) => (
              <Marker
                key={complaint.id}
                position={{ lat: complaint.location._lat, lng: complaint.location._long }}
                onClick={() => showComplaintDetails(complaint.id)}
                icon={{
                  url: "/complaintMarker.png",
                  scaledSize: new window.google.maps.Size(45, 45),
                }}
              />
            ))}

        
      {showUserLocation && userPosition && (
            <Marker position={userPosition} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#4285F4', fillOpacity: 0.8, strokeColor: '#4285F4' }}>
              <Circle center={userLocationRange} options={{ radius: userLocationRange.radius, strokeColor: '#4285F4', fillColor: '#4285F4', fillOpacity: 0.2 }} />
            </Marker>
          )}
  
           </GoogleMap>

      <button
        onClick={toggleFullscreen}
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: 'none', border: 'none' }}
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullscreen ? <FullscreenExitIcon fontSize="large" /> : <FullscreenIcon fontSize="large" />}
      </button>

<div  style={{ position: 'absolute', bottom: 10, zIndex: 10, left: '50%', transform: 'translateX(-50%)'}} className='flex justify-center'>
<div className="flex items-center justify-center  bg-white rounded-lg shadow p-2">
      <span className="text-xs font-medium ml-1">اكثر بلاغات</span>
      <div className="w-24 h-4 rounded-full bg-gradient-to-r from-green-300 via-yellow-300 to-red-500"></div>
      <span className="text-xs font-medium mr-1">اقل بلاغات</span>
    </div>
</div>
      

{complaints.length==0? null:(


<div className='flex-col'>

<div style={{ overflowX: "auto", maxHeight: "380vh", marginTop:"10px" }}>
            <Card className="max-w-4xl m-auto mb-10">

            <div className=" pr-8 py-2 " style={{backgroundColor:'#07512D', color: "white" , borderRadius: "5px"}}>
            <Typography className="font-baloo text-right text-xl font-bold ">
                 تحليل  البلاغات 
                  </Typography>
                  </div>
                      <hr/>
                      <div className="flex flex-col gap-5  p-8">

                      <div className='flex justify-around'>

  <Card variant="filled"  className=" flex flex-col items-center p-4 shadow-lg">
    <div>
       
    <Typography className="font-baloo  text-xs font-bold mb-2"> إجمالي البلاغات</Typography>
  <hr/>
  </div>
 <Typography className='flex items-center justify-center gap-1'> <span className="font-baloo text-lg font-bold text-gray-700 mt-2">{complaints.length} بلاغ</span> 
  <Tooltip  className="bg-white shadow-lg " content={
        <div className="w-80">
         <Typography color="black" className="font-medium ">
        <span>   إجمالي البلاغات</span>
          </Typography>
          <Typography
            variant="small"
            color="black"
            className="font-normal opacity-80"
          >
          <span> يشير هذا العدد إلى إجمالي البلاغات التي تم تقديمها واستلامها حتى الآن. يعكس هذا الرقم مدى تفاعل المواطنين واهتمامهم بمحيطهم الحضري وجودة الخدمات المقدمة. </span> </Typography>
        </div>
      }>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3 w-3 cursor-pointer text-blue-gray-500 mt-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
      </Tooltip></Typography>  

  
    </Card>

        {(selectedStatus!="جديد" && selectedStatus!="قيد التنفيذ") && (
        <Card variant="filled"  className=" flex flex-col items-center p-4 shadow-lg">
          <div>
          <Typography className=" font-baloo text-xs font-bold mb-2"> متوسط مدة حل البلاغ الواحد </Typography>
          <hr/>
  </div>     
    <Typography className='flex items-center justify-center gap-1'> <span className="font-baloo text-lg font-bold text-gray-700 mt-2">{averageResolutionTime}</span>
    <Tooltip  className="bg-white shadow-lg " content={
        <div className="w-80">
          <Typography color="black" className="font-medium font-baloo">
          متوسط مدة حل البلاغ الواحد 
          </Typography>
          <Typography
            variant="small"
            color="black"
            className="font-normal font-baloo opacity-80"
          >
         يعبر هذا الرقم عن المدة الزمنية المتوسطة التي تستغرقها الشكاوى من لحظة استلامها حتى إغلاقها أو حلها نهائيًا. يُستخدم هذا المتوسط لتقييم فعالية وسرعة استجابة الفريق المعني بمعالجة البلاغات.
          </Typography>
        </div>
      }>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3 w-3 cursor-pointer text-blue-gray-500 mt-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
      </Tooltip></Typography>   
        </Card>
 )}

<Card variant="filled"  className=" flex flex-col items-center gap-1 p-2 shadow-lg">
<div>
          <Typography className=" font-baloo text-xs font-bold "> عدد البلاغات</Typography>
        
</div>    



<div className='flex justify-around gap-3'>

<Card variant="filled"  className=" flex flex-col items-center p-2 shadow-lg">
          <div>
          <Typography className=" font-baloo text-xs font-bold "> هذا اليوم</Typography>
          <hr/>
  </div>     
  <Typography className='flex items-center justify-center gap-1'> <span className="font-baloo text-right text-lg font-bold text-gray-700">{todaysComplaintsCount} بلاغ</span>
          <Tooltip  className="bg-white shadow-lg " content={
        <div className="w-80">
          <Typography color="black" className="font-medium font-baloo">
          عدد البلاغات هذا اليوم
          </Typography>
          <Typography
            variant="small"
            color="black"
            className="font-normal opacity-80 font-baloo"
          >
        يعبر هذا الرقم عن عدد البلاغات التي تم تقديمها اليوم. هذا المؤشر يُساعد في مراقبة الأنشطة اليومية.
    </Typography>
        </div>
      }>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3 w-3 cursor-pointer text-blue-gray-500 mt-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
      </Tooltip> </Typography> 
        </Card>

        <Card variant="filled"  className=" flex flex-col items-center p-2  shadow-lg">
          <div>
          <Typography className=" font-baloo text-xs font-bold "> هذا الاسبوع</Typography>
          <hr/>
  </div>     
  <Typography className='flex items-center justify-center gap-1'> <span className="font-baloo text-right text-lg font-bold text-gray-700">{thisWeeksComplaintsCount} بلاغ</span>
          <Tooltip  className="bg-white shadow-lg " content={
        <div className="w-80">
          <Typography color="black" className="font-medium font-baloo ">
          عدد البلاغات هذا الاسبوع
          </Typography>
          <Typography
            variant="small"
            color="black"
            className="font-normal opacity-80 font-baloo"
          >
يعبر هذا الرقم عن العدد الإجمالي للبلاغات التي تم استقبالها خلال الأسبوع الحالي. هذا الرقم مهم لتقييم الأداء الأسبوعي.

          </Typography>
        </div>
      }>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3 w-3 cursor-pointer text-blue-gray-500 mt-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
      </Tooltip></Typography>
        </Card>


        <Card variant="filled"  className=" flex flex-col items-center p-2  shadow-lg">
          <div>
          <Typography className=" font-baloo text-xs font-bold"> هذا الشهر</Typography>
          <hr/>
  </div>     
  <Typography className='flex items-center justify-center gap-1'> <span className="font-baloo text-right text-lg font-bold text-gray-700">{thisMonthsComplaintsCount} بلاغ</span>
          <Tooltip  className="bg-white shadow-lg " content={
        <div className="w-80">
          <Typography color="black" className="font-medium font-baloo">
          عدد البلاغات هذا الشهر
          </Typography>
          <Typography
            variant="small"
            color="black"
            className="font-normal opacity-80 font-baloo"
          >
يعبر هذا الرقم عن العدد الإجمالي للبلاغات التي تم استقبالها خلال الشهر الحالي. هذا الرقم مهم لتقييم الأداء الشهري.
          </Typography>
        </div>
      }>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3 w-3 cursor-pointer text-blue-gray-500 mt-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
      </Tooltip></Typography>
        </Card>

</div>
</Card>

</div>


<div className='flex  justify-around'>
  <Card className='p-4 shadow-lg '>
  <Typography className='font-baloo  text-xs font-bold mb-2 flex items-center justify-center gap-1 '> <span>عدد البلاغات لكل نوع</span>
  <Tooltip  className="bg-white shadow-lg " content={
        <div className="w-80">
          <Typography color="black" className="font-medium font-baloo ">
        عدد البلاغات لكل نوع
          </Typography>
          <Typography
            variant="small"
            color="black"
            className="font-normal opacity-80 font-baloo"
          >
            توضح هذه الدائرة النسبية لأنواع الشكاوى المختلفة. كل لون يمثل نوعًا محددًا من البلاغات، مما يسهل على المسؤولين تحديد الأنواع الأكثر شيوعًا والتركيز على تحسين الخدمات ذات الصلة.
          </Typography>
        </div>
      }>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3 w-3 cursor-pointer text-blue-gray-500 "
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
      </Tooltip></Typography>
  <hr/>
  <div style={{ width: '100%', height: '300px' }}>
  
  <Doughnut 
  data={typeData} 
  options={{
    ...typesOptions, 
    onClick: function(evt, elements, chart) {
      if (elements.length > 0) {
      
        const index = elements[0].index;
        const labelClicked = chart.data.labels[index];
        
        setStatusFilter("");
        setDateFilter("");
        setNeighborhoodFilter(""); 
        setTypeFilter(labelClicked);
        setDirectRoute(true);
        navigate(`/mainpage/complaints`); 
      }
    }
  }} 
/>

  
  </div>
  </Card>

  <Card className='p-4 shadow-lg '>
  <Typography className='font-baloo  text-xs font-bold mb-2 flex items-center justify-center gap-1 '> <span>توزيع البلاغات بحسب الحالة </span>
  <Tooltip  className="bg-white shadow-lg "
   content={
        <div className="w-80">
          <Typography color="black" className="font-medium font-baloo">
        توزيع البلاغات بحسب الحالة 
          </Typography>
          <Typography
            variant="small"
            color="black"
            className="font-normal opacity-80 font-baloo "
          >
يعرض هذا الرسم البياني بالأعمدة توزيع البلاغات بحسب حالتها، مما يوفر رؤية واضحة لفعالية استجابة الخدمة.
          </Typography>
        </div>
      }>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3 w-3 cursor-pointer text-blue-gray-500 "
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
      </Tooltip></Typography>
  <hr/>
  <div style={{ width: '100%', height: '300px' }}>

    <Bar data={statusData} 
    options={{ ...options, maintainAspectRatio: false , 
    onClick: function(evt, elements, chart) {
      if (elements.length > 0) {
        const index = elements[0].index;
        const labelClicked = chart.data.labels[index];
        
        setTypeFilter('');
        setDateFilter("");
        setNeighborhoodFilter(""); 
        setStatusFilter(labelClicked); 
        setDirectRoute(true);
        navigate(`/mainpage/complaints`); 
      }
    }}}  />

  </div>
  </Card>
    </div>



    <div className="">
   <Card className=' p-4 shadow-lg' >
   <Typography  className='font-baloo  text-xs font-bold mb-2 flex items-center justify-center gap-1 '>
   <Tooltip  className="bg-white shadow-lg "
   content={
        <div className="w-80">
          <Typography color="black" className="font-medium font-baloo">
          <span>توزيع البلاغات خلال السنة</span>
          </Typography>
          <Typography
            variant="small"
            color="black"
            className="font-normal opacity-80 font-baloo"
          >
يوضح هذا الرسم البياني الخطي عدد البلاغات خلال السنة ، ويظهر كيف تتغير أعداد البلاغات من شهر لآخر، مما يساعد في التخطيط والاستجابة المستقبلية.
          </Typography>
        </div>
      }>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3 w-3 cursor-pointer text-blue-gray-500 "
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
      </Tooltip>
      
    <span>توزيع البلاغات خلال سنة :</span> 
  
      <Select
      onChange={(selectedOption) => handleYearChange(selectedOption, setSelectedYear)}
      options={uniqueYears.map(year => ({ value: year, label: year }))}
      value={{ value: selectedYear, label: selectedYear }}
    />
      </Typography>
   <hr/>

      <Line data={chartData} options={{...lineChartOptionsForMonth, 
      onClick: (evt, element) => {
        if (element.length > 0) {
          const index = element[0].index;
          const label = chartData.labels[index];
          const yearMonthNumber = convertYearMonthNameToNumber(label);
        
          setTypeFilter('');
          setStatusFilter("");
          setNeighborhoodFilter(""); 
          setDateFilter(yearMonthNumber);
          setDirectRoute(true);
          navigate(`/mainpage/complaints`); 
        }}
      }} />

      </Card>

    </div>


    <Card className='p-4 shadow-lg'>
    <Typography className='font-baloo  text-xs font-bold mb-2 flex items-center justify-center gap-1 '> <span> توزيع البلاغات بحسب الاحياء  </span>
    <Tooltip  className="bg-white shadow-lg "
   content={
        <div className="w-80">
          <Typography color="black" className="font-medium font-baloo">
          <span> توزيع البلاغات بحسب الاحياء </span> 
          </Typography>
          <Typography
            variant="small"
            color="black"
            className="font-normal opacity-80 font-baloo"
          >
يعرض هذا الرسم البياني بالأعمدة الأفقية عدد البلاغات لكل حي، مما يسلط الضوء على المناطق التي تحتاج إلى اهتمام أكثر في جهود التحسين والصيانة.
          </Typography>
        </div>
      }>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3 w-3 cursor-pointer text-blue-gray-500 "
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
      </Tooltip></Typography>
    <hr/>
   <div >
  <NeighborhoodComplaintsChart labels={labels} data={data} />
  </div>
  </Card>
  </div>

  </Card>
</div>
</div>
) }
      </div>
    ) : <></>
  }
  