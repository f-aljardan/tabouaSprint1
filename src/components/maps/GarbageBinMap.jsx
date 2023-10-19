import React , {useState, useEffect, useRef} from 'react'
import { GoogleMap, useJsApiLoader, Marker , OverlayView } from '@react-google-maps/api';
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc ,getDoc, Timestamp } from "firebase/firestore"; // Import the necessary Firestore functions
import { Button , Tooltip, Option} from "@material-tailwind/react";
import Confirm from '../messages/Confirm';
import Success from "../messages/Success"
import GarbageBinForm from "../forms/GarbageBinForm"
import ViewGarbageInfo from "../viewInfo/ViewGarbageInfo"
import AlertMessage from "../messages/AlertMessage"
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const containerStyle = {
  width: '100%', // Set a width as needed
    height: '100%'
};

const center = {
  lat: 24.7136,
  lng: 46.6753
};


const binSizeOptions = [
  { value: '', label: 'جميع الاحجام' },
  { value: 'حاوية كبيرة', label: 'حاوية كبيرة' },
  { value: 'حاوية صغيرة', label: 'حاوية صغيرة' },
];



function Map() {

  const [zoom, setZoom] = useState(10); // set the initial zoom level
  const [userPosition, setUserPosition] = useState(null);
  const [garbageBins, setGarbageBins] = useState([]);
  const [binData ,SetBinData] = React.useState([]);
  const [binId , setBinId] = useState();
  const [formVisible, setFormVisible] = useState(false);// To control confirmation message visibility
  const [newGarbageBinLocation, setNewGarbageBinLocation] = useState(null);
  const [showAlertStreet, setShowAlertStreet] = useState(false);
  const [showAlertZoom, setShowAlertZoom] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAlertDeletion, setShowAlertDeletion] = useState(false);
  const [viewInfo, setViewInfo] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState(false);
  const [selectedBinSize, setSelectedBinSize] = useState(null);
  const [binsData, setBinsData] = useState([]);

  const openInfoDrawer = () => setViewInfo(true);
  const closeInfoDrawer = () => setViewInfo(false);
  const handleForm = () => setFormVisible(!formVisible);
  const handleAlertStreet = () => setShowAlertStreet(!showAlertStreet);
  const handleAlertZoom = () => setShowAlertZoom(!showAlertZoom);
  const handleSuccessAlert = () => setShowSuccessAlert(!showSuccessAlert);
  const handlealertDeletion = () => setShowAlertDeletion(!showAlertDeletion);


 // Define the acceptable zoom level range
 const minZoomLevel = 18;
 const currentZoomLevelRef = useRef(null);
 const mapRef = useRef(null);









  // Function to filter garbage bins based on type
  const filterGarbageBins = (size) => {
    if (size === '') {
      // If no type is selected, show all bins
      setGarbageBins(binsData);
    } else {
      // Filter bins based on the selected type
      const filteredBins = binsData.filter((bin) => bin.size === size);
      setGarbageBins(filteredBins);
    }
  };

  // Load the garbage bin data from Firestore
  useEffect( ()=>{
      const fetchGarbageBins = async () => {
      try {
      const querySnapshot = await getDocs(collection(db, "garbageBins"));
      const binsData = [];
      querySnapshot.forEach((doc) => {
          const data = doc.data();
          const location = data.location || {}; // Ensure location is an object
          binsData.push({ id: doc.id, location, size: data.size }); 
           });

       // Initially, set all garbage bins
       setGarbageBins(binsData);

      // Store the bin data for filtering
       setBinsData(binsData);
        } catch (error) {
          console.error('Error fetching garbage bins:', error);
        }
      };
  
      fetchGarbageBins();
    }, []);
 
 // Function to handle the selection of a bin type for filtering
//  const handleBinSizeSelect = (size) => {
//   setSelectedBinSize(size);
//   filterGarbageBins(size);
// };
const handleBinSizeSelect = (selectedOption) => {
  setSelectedBinSize(selectedOption.value);
  filterGarbageBins(selectedOption.value);
};


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk"
  })


  const [map, setMap] = React.useState(null)


  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map; // Store the map object in the ref
    
    // Get the initial zoom level and store it in currentZoomLevelRef
    if (map.getZoom) {
      const initialZoomLevel = map.getZoom();
      currentZoomLevelRef.current = initialZoomLevel;
    }
  
    // Attach the onZoomChanged event listener
    if (map.addListener) {
      map.addListener('zoom_changed', onZoomChanged);
    }
  }, []);


  const onUnmount = React.useCallback(function callback(map) {
    console.log("unmount")
    mapRef.current = null;
    setMap(null)
  }, [])


// function to handle fetching the user's current position
  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition({ lat: latitude, lng: longitude });
        setZoom(18); 
      });
    } else {
      alert('Geolocation is not available in your browser.');
    }
  };
  

// Function to generate a unique serial number
function generateSerialNumber() {
  return uuidv4();// Generates a random UUID
}

  const handleMarkerClick = async (bin) => {
    
    try {
      // Fetch data for the selected recycling center using its ID
      const BinDocRef = doc(db, "garbageBins", bin.id);
      const BinDocSnapshot = await getDoc(BinDocRef);
  
      if (BinDocSnapshot.exists()) {
        SetBinData(BinDocSnapshot.data());
        setBinId(bin.id);
        // You can use this data as needed in your component
      } else {
        console.error("Bin not found.");
      }
    } catch (error) {
      console.error("Error fetching Bin data:", error);
    }
    openInfoDrawer();
    setSelectedLocation(bin);
  
  };


  const onZoomChanged = () => {
    if (mapRef.current && mapRef.current.getZoom) {
      const zoomLevel = mapRef.current.getZoom();
      currentZoomLevelRef.current = zoomLevel;
    }
  };

  
// Attach the onZoomChanged event listener
useEffect(() => {
  if (mapRef.current) {
    mapRef.current.addListener('zoom_changed', onZoomChanged);
  }
}, []);

const onMapClick = async (event) => {
  // Capture the coordinates and display a confirmation message
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();

  // Check if the conditions are met
  if (currentZoomLevelRef.current >= minZoomLevel) {
    const terrainType = await checkTerrainType(lat, lng);
    if (terrainType === 'building') {
      // Show an alert message indicating that a garbage bin cannot be added on a building.
      handleAlertStreet();
    } else {
      // Store the new garbage bin location temporarily
      setNewGarbageBinLocation({ lat, lng });
      setFormVisible(true);
    }
  } else {
    // Show an alert message indicating that a garbage bin can only be added on a specific scale.
    handleAlertZoom();
  }
};

const checkTerrainType = (lat, lng) => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK') {
          const types = results[0]?.address_components.map((component) => component.types[0]);

          // Check if 'types' array contains 'premise' (building)
          if (types.includes('premise')) {
            resolve('building');
          } else {
            resolve('other'); 
          }
        } else {
          reject('Error checking terrain type');
        }
      });
    } else {
      reject('Google Maps API not loaded');
    }
  });
};


  const handleDeletion = () => {
   
      // Call the onDeleteGarbageBin function passed as a prop to handle deletion.
      onDeleteGarbageBin(selectedLocation.id);
      setSelectedLocation(false);

  };


  
const AddGarbageBin = async (data) => {
  try {
    const geoPoint = new GeoPoint(
      newGarbageBinLocation.lat,
      newGarbageBinLocation.lng
    );
  
  

    const docRef = await addDoc(collection(db, "garbageBins"), {
      location: geoPoint,
      size: data.size,
      date: Timestamp.fromDate(new Date()),
      maintenanceDate: Timestamp.fromDate(new Date()),
      serialNumber: generateSerialNumber(), 
    });

    setGarbageBins([...garbageBins, { id: docRef.id, location: geoPoint }]);
    setFormVisible(false);
    setShowSuccessAlert(true);

    
  } catch (error) {
    console.error("Error saving garbage bin coordinates:", error);
  }
};


const onDeleteGarbageBin = async (garbageBinId) => {
  try {
    // Construct a reference to the garbage bin document to be deleted
    const garbageBinRef = doc(db, "garbageBins", garbageBinId);

    // Delete the garbage bin document from Firestore
    await deleteDoc(garbageBinRef);

    // Update the state to remove the deleted garbage bin
    setGarbageBins((prevGarbageBins) =>
      prevGarbageBins.filter((bin) => bin.id !== garbageBinId)
    );
     // Display a success message
     setShowAlertDeletion(true);
   
    
  } catch (error) {
    console.error("Error deleting garbage bin:", error);
    alert("An error occurred while deleting the garbage bin.");
  }
};



return isLoaded ? (
  <div style={{ position: 'relative' , width:'100%',  height: "%100"}}>
    <div className="flex gap-5 p-4 mr-12 z-10" style={{ position: 'absolute' }}>
    
    <Tooltip
      className="bg-white font-baloo text-md text-gray-600"
      content="  لإضافة موقع حاوية جديدة قم بالضغط على الموقع المحدد والالتزام بحدود الطرق"
      placement="bottom"  
    >
      <Button style={{ background: "#97B980", color: '#ffffff' }} size='sm'><span>تعليمات إضافة حاوية</span></Button>
    </Tooltip>
      
    <Tooltip
      className="bg-white font-baloo text-md text-gray-600"
      content=" لإزالة موقع حاوية قم بالضغط على موقع الحاوية"
      placement="bottom"
    >
      <Button style={{ background: "#FE5500", color: '#ffffff' }} size='sm'><span>تعليمات إزالة الحاوية</span></Button>
    </Tooltip>

    <Button
  style={{ background: '#FE9B00', color: '#ffffff' }}
  size="sm"
  onClick={getUserPosition}>
  <span>عرض الموقع الحالي</span>
     </Button>

{/* Select option for bin type filtering */}
      {/* <div className='bg-white text-gray-900 rounded-md' >
        <Select className='text-gray-900 '   onChange={(value) => handleBinSizeSelect(value)} value={selectedBinSize}>

         <Option> تصفية حسب حجم الحاوية</Option>
          <Option value="">جميع الاحجام</Option>
          <Option value="حاوية كبيرة">حاوية كبيرة</Option>
          <Option value="حاوية صغيرة">حاوية صغيرة</Option>
        </Select>
      </div> */}
  

  <Select
  placeholder="تصفية حسب حجم الحاوية..."
  closeMenuOnSelect={false}
  components={animatedComponents}
  options={binSizeOptions}
  value={selectedBinSize !== null ? binSizeOptions.find((option) => option.value === selectedBinSize) : null}
  onChange={(value) => handleBinSizeSelect(value)}
  required
/>

      
  </div>
    
     <div style={{position: 'absolute', zIndex: 2000, }}>
  <AlertMessage open={showAlertZoom} handler={handleAlertZoom} message="كبر الخريطة لتتمكن من إضافة حاوية القمامة " />
     </div>

     <div style={{position: 'absolute', zIndex: 2000, }}>
  <AlertMessage open={showAlertStreet} handler={handleAlertStreet} message=" إلتزم بحدود الطرق عند إضافة حاوية قمامة" />
     </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userPosition || center}
        zoom={zoom}
        onLoad={onLoad} //Callback function that gets executed when the map is loaded.
        onUnmount={onUnmount}//Callback function that gets executed when the component unmounts.
        onClick={onMapClick}
      >

        {garbageBins.map((bin) => (
          <Marker
            key={bin.id}
            position={{ lat: bin.location._lat, lng: bin.location._long }} // Update here
            onClick={() => handleMarkerClick(bin)}
          >
          </Marker>
        ))}
    


 <ViewGarbageInfo open={viewInfo} onClose={closeInfoDrawer}  DeleteMethod={handleDeletion} bin={binData} binId={binId}/>
 <GarbageBinForm open={formVisible} handler={handleForm} AddMethod={AddGarbageBin}  />
 <Success open={showSuccessAlert} handler={handleSuccessAlert} message=" تم إضافة حاوية القمامة بنجاح" />
 <Success open={showAlertDeletion} handler={handlealertDeletion} message=" تم حذف حاوية القمامة بنجاح" />
  
    
       
      </GoogleMap>
</div>
  ) : <></>
}

export default React.memo(Map)