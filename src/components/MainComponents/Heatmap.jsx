import React , {useState, useEffect, useRef} from 'react'
import { GoogleMap, useJsApiLoader, Marker , Circle, HeatmapLayer } from '@react-google-maps/api';
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc ,getDoc, Timestamp,updateDoc } from "firebase/firestore"; 
import { Button, Card, Typography} from "@material-tailwind/react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
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



ChartJS.register( PointElement, LineElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,Colors,ArcElement);



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
    const [todaysComplaintsCount, setTodaysComplaintsCount] = useState(0);
    const [thisMonthsComplaintsCount, setThisMonthsComplaintsCount] = useState(0);
    const [thisWeeksComplaintsCount, setThisWeeksComplaintsCount] = useState(0);
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
          complaintData.push({ id: doc.id, location, type: data.complaintType, status: data.status ,complaintDate: data.complaintDate, responseDate: data.responseDate, localArea: data.localArea });
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


// const calculateTodaysComplaints = () => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Reset time to start of the day

//   const todaysComplaints = complaints.filter(complaint => {
//     const complaintDate = new Date(complaint.complaintDate.seconds * 1000); // Assuming `complaintDate` is a Timestamp object
//     complaintDate.setHours(0, 0, 0, 0); // Reset time to start of the day for comparison

//     return complaintDate.getTime() === today.getTime();
//   });

//   return todaysComplaints.length;
// };


// const todaysComplaintsCount = calculateTodaysComplaints();

useEffect(() => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  
  const todaysCount = complaints.filter(complaint => {
    const complaintDate = new Date(complaint.complaintDate.seconds * 1000);
    return complaintDate.toDateString() === today.toDateString();
  }).length;

  const monthsCount = complaints.filter(complaint => {
    const complaintDate = new Date(complaint.complaintDate.seconds * 1000);
    return complaintDate >= startOfMonth;
  }).length;

  const weeksCount = complaints.filter(complaint => {
    const complaintDate = new Date(complaint.complaintDate.seconds * 1000);
    return complaintDate >= startOfWeek;
  }).length;

  // Calculate average resolution time here and update setAverageResolutionTime

  setTodaysComplaintsCount(todaysCount);
  setThisMonthsComplaintsCount(monthsCount);
  setThisWeeksComplaintsCount(weeksCount);
}, [complaints]);




const complaintsOverTimeByMonth = () => {
  const complaintCounts = {}; // Object to hold month-year: count pairs

  complaints.forEach(complaint => {
    const complaintDate = new Date(complaint.complaintDate.seconds * 1000);
    // Format date as "Month Year" string
    const monthString = complaintDate.toLocaleString('ar-EG', { month: 'long' });
    const year = complaintDate.getFullYear();
    const dateString = `${monthString} ${year}`;

    complaintCounts[dateString] = (complaintCounts[dateString] || 0) + 1;
  });

  // Split the object into arrays of month-year strings and counts
  const dates = Object.keys(complaintCounts).sort((a, b) => new Date(a) - new Date(b));
  const counts = dates.map(date => complaintCounts[date]);

  return { dates, counts };
};

const { dates, counts } = complaintsOverTimeByMonth();

const lineChartDataForMonth = {
  labels: dates,
  datasets: [
    {
      label: 'عدد البلاغات بالشهر',
      data: counts,
      fill: false,
      backgroundColor: 'rgb(54, 162, 235)',
      borderColor: 'rgba(54, 162, 235, 0.2)',
    },
  ],
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




const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const complaintsOverTimeByWeek = () => {
  const complaintCounts = {}; // Object to hold year-week: count pairs

  complaints.forEach(complaint => {
    const complaintDate = new Date(complaint.complaintDate.seconds * 1000);
    const year = complaintDate.getFullYear();
    const weekNumber = getWeekNumber(complaintDate);
    const weekYearString = `اسبوع ${weekNumber}, ${year}`;

    complaintCounts[weekYearString] = (complaintCounts[weekYearString] || 0) + 1;
  });

  // Split the object into arrays of week-year strings and counts
  const weeks = Object.keys(complaintCounts).sort();
  const countss = weeks.map(week => complaintCounts[week]);

  return { weeks, countss };
};

const { weeks, countss } = complaintsOverTimeByWeek();

const lineChartDataForWeeks = {
  labels: weeks,
  datasets: [
    {
      label: 'عدد البلاغات بالأسبوع',
      data: countss,
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
    },
  ],
};

const lineChartOptionsForWeeks = {
  scales: {
    x: {
      
      title: {
        display: true,
        text: 'الاسبوع',
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



const extractNeighborhood = (localArea) => {
  // Check if localArea starts with a postal code (sequence of digits followed by a comma)
  const postalCodeRegex = /^\d+\s*,\s*/;
  if (postalCodeRegex.test(localArea)) {
    // Extract the part after the postal code and comma
    return localArea.replace(postalCodeRegex, '').trim();
  } else {
    // Assume the first part before any comma is the neighborhood name
    return localArea.split(',')[0].trim();
  }
};

const aggregateComplaintsByNeighborhood = (complaints) => {
  const complaintsByNeighborhood = {};

  complaints.forEach(complaint => {
    const neighborhood = extractNeighborhood(complaint.localArea);
    complaintsByNeighborhood[neighborhood] = (complaintsByNeighborhood[neighborhood] || 0) + 1;
  });

  return complaintsByNeighborhood;
};


const { labels, data } = Object.entries(aggregateComplaintsByNeighborhood(complaints))
  .sort((a, b) => b[1] - a[1])
  .reduce((acc, [neighborhood, count]) => {
    acc.labels.push(neighborhood);
    acc.data.push(count);
    return acc;
  }, { labels: [], data: [] });


  const NeighborhoodComplaintsChart = ({ labels, data }) => {
    const chartData = {
      labels,
      datasets: [
        {
          label: 'عدد البلاغات',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      indexAxis: 'y', // Horizontal bar chart
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        // title: {
        //   display: true,
        //   text: 'أكثر الأحياء تقديمًا للبلاغات',
        // },
      },
    };
    return <Bar data={chartData} options={options} />;
  }
const complaintsByNeighborhood = aggregateComplaintsByNeighborhood(complaints);

const sortedNeighborhoods = Object.entries(complaintsByNeighborhood)
  .sort((a, b) => b[1] - a[1]);







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

<div className="flex items-center justify-center py-2 px-2 bg-white rounded-lg shadow">
      <span className="text-xs font-medium ml-2">اكثر</span>
      <div className="w-32 h-4 rounded-full bg-gradient-to-r from-green-300 via-yellow-300 to-red-500"></div>
      <span className="text-xs font-medium mr-2">اقل</span>
    </div>

</div>

{complaints.length==0?(     
   <div style={{  marginTop:10,  width: '100%', height: '100%'}}>
        <ErrorAlertMessage open={true} handler={handleAlertStreet}
         message="لا يوجد بيانات بهذا التصنيف" /> </div>
         ): null
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
            mapTypeControl: false, // This hides the map/satellite view control
            
          
          }}
     
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


{complaints.length==0? null:(


<div className='flex-col'>

<div style={{ overflowX: "auto", maxHeight: "280vh", marginTop:"10px" }}>
            <Card className="max-w-4xl m-auto mb-10">

            <div className=" pr-8 py-2 " style={{backgroundColor:'#07512D', color: "white" , borderRadius: "5px"}}>
            <Typography className="font-baloo text-right text-xl font-bold ">
                   تحليل  البلاغات 
                  </Typography>
                  </div>
                      <hr/>
                      <div className="flex flex-col gap-5  p-8">

                      <div className='flex justify-around'>

  <Card variant="filled" color="blue-grey" className=" p-4 shadow-lg">
  <Typography className=" font-baloo font-bold"> إجمالي البلاغات:</Typography>
                 <Typography> <span className="font-baloo text-right text-lg font-bold text-gray-700">{complaints.length} بلاغ</span></Typography>   
          
        </Card>

        {(selectedStatus!="جديد" && selectedStatus!="قيد التنفيذ") && (
        <Card variant="filled" color="blue-grey" className=" p-4 shadow-lg">
          <Typography className=" font-baloo font-bold">
        متوسط مدة حل البلاغ الواحد:
                    </Typography>
                    
                    <Typography> <span className="font-baloo text-right text-lg font-bold text-gray-700">{averageResolutionTime.toFixed(2)} ساعة</span></Typography>   
        </Card>
 )}

<Card variant="filled" color="blue-grey" className=' p-4 shadow-lg flex'>

<Typography className="font-baloo font-bold"><span>عدد البلاغات:</span></Typography>

        <div className='flex justify-around gap-5'>

          <div className='flex items-center gap-2'>
          <Typography className="text-lg font-semibold"><span>اليوم:</span></Typography>
          <Typography> <span className="font-baloo text-right text-lg font-bold text-gray-700">{todaysComplaintsCount} بلاغ</span></Typography>
          </div>

          <div className='flex items-center gap-2'>
          <Typography className="text-lg font-semibold"> <span>الأسبوع:</span></Typography>
          <Typography> <span className="font-baloo text-right text-lg font-bold text-gray-700">{thisWeeksComplaintsCount} بلاغ</span></Typography>
          </div>

          <div className='flex items-center gap-2'>
          <Typography className="text-lg font-semibold"><span>الشهر:</span></Typography>
          <Typography> <span className="font-baloo text-right text-lg font-bold text-gray-700">{thisMonthsComplaintsCount} بلاغ</span></Typography>
          </div>

          </div>
    
  </Card>
</div>


<div className='flex  justify-around'>
  <Card className='p-4 shadow-lg '>
  <Typography className=" font-baloo font-bold"> انواع البلاغ :</Typography>
  <div style={{ width: '100%', height: '300px' }}>
    <Doughnut data={typeData} options={{ maintainAspectRatio: false }}/>
    {/* options={{ maintainAspectRatio: false }} */}
  </div>
  </Card>

  <Card className='p-4 shadow-lg '>
  <Typography className=" font-baloo font-bold"> حالات البلاغ :</Typography>
  <div style={{ width: '100%', height: '300px' }}>
    <Bar data={statusData} options={{ ...options, maintainAspectRatio: false }}  />
    {/* options={{ ...options, maintainAspectRatio: false }} */}
  </div>
  </Card>
    </div>



    <div className="flex justify-around">
   <Card className=' p-4 shadow-lg' >
   <Typography className=" font-baloo font-bold"> عدد البلاغات في الشهر:</Typography>
    <div style={{width: '100%', height: '200px' }}>
      <Line data={lineChartDataForMonth} options={{...lineChartOptionsForMonth, maintainAspectRatio: false}} />
      </div>
      </Card>
      <Card className='p-4 shadow-lg' >
      <Typography className=" font-baloo font-bold"> عدد البلاغات في الاسبوع:</Typography>
      <div style={{width: '100%', height: '200px' }}>
      <Line data={lineChartDataForWeeks} options={{...lineChartOptionsForWeeks, maintainAspectRatio: false}} />
      </div>
      </Card>
    </div>


    <Card className='p-4 shadow-lg'>
    <Typography className=" font-baloo font-bold"> اكثرالاحياء تقديمًا للبلاغات:</Typography>
   <div>
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
  