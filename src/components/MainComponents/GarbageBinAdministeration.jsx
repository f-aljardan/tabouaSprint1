import React , {useState, useEffect, useRef} from 'react'
import { GoogleMap, useJsApiLoader, Marker , Circle,  } from '@react-google-maps/api';
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc ,getDoc, Timestamp,updateDoc } from "firebase/firestore"; 
import { Button , Tooltip} from "@material-tailwind/react";
import Success from "../utilityComponents/messages/Success"
import Confirm from "../utilityComponents/messages/Confirm"
import GarbageBinForm from "../utilityComponents/forms/GarbageBinForm"
import ViewGarbageInfo from "../utilityComponents/viewInfo/ViewGarbageInfo"
import ErrorAlertMessage from "../utilityComponents/messages/ErrorAlertMessage"
import AlertMessage from "../utilityComponents/messages/AlertMessage"
import { v4 as uuidv4 } from 'uuid';
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

// Define options for garbage bin size selection
const binSizeOptions = [
  { value: '', label: 'جميع الاحجام' },
  { value: 'حاوية كبيرة', label: 'حاوية كبيرة' },
  { value: 'حاوية صغيرة', label: 'حاوية صغيرة' },
];

const reactSelectStyles = {
  container: (provided) => ({
    ...provided,
    width: "250px", // Adjust the width as needed
  }),
};

function GarbageBinMap() {
  
  const [map, setMap] = React.useState(null)
  const [zoom, setZoom] = useState(10); // set the initial zoom level
  const [garbageBins, setGarbageBins] = useState([]);
  const [binData ,SetBinData] = React.useState([]);
  const [binId , setBinId] = useState();
  const [formVisible, setFormVisible] = useState(false);// To control confirmation message visibility
  const [newGarbageBinLocation, setNewGarbageBinLocation] = useState(null);
  const [showAlertStreet, setShowAlertStreet] = useState(false);
  const [showAlertZoom, setShowAlertZoom] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAlertLocation, setShowAlertLocation] = useState(false);
  const [showAlertSuccessLocation, setShowAlertSuccessLocation] = useState(false);
  const [showAlertDeletion, setShowAlertDeletion] = useState(false);
  const [viewInfo, setViewInfo] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState(false);
  const [selectedBinSize, setSelectedBinSize] = useState(null);
  const [binsData, setBinsData] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [userLocationRange, setUserLocationRange] = useState(null);
  const [markerRefs, setMarkerRefs] = useState({});
  const [isChangingBinLocation, setIsChangingBinLocation] = useState(false);
  const[ checkMessageVisible, setCheckMessageVisible] = useState(false);
 

  const openInfoDrawer = () => setViewInfo(true);
  const closeInfoDrawer = () => {setViewInfo(false);   setBinId(null);}
  const handleForm = () => setFormVisible(!formVisible);
  const handleAlertLocation = () => {setShowAlertLocation(!showAlertLocation);  setIsChangingBinLocation(false); setBinId(null);}
  const handleAlertSuccessLocation = () => setShowAlertSuccessLocation(!showAlertSuccessLocation);
  const handleAlertStreet = () => setShowAlertStreet(!showAlertStreet);
  const handleAlertZoom = () => setShowAlertZoom(!showAlertZoom);
  const handleSuccessAlert = () => setShowSuccessAlert(!showSuccessAlert);
  const handlealertDeletion = () => setShowAlertDeletion(!showAlertDeletion);
  const handleCheckMessage= () => { 
     handleAlertStreet(); 
     setCheckMessageVisible(!checkMessageVisible); 
    }


 // all google map initilization related function starts here
  // Load Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk",
    libraries: googleMapsLibraries
  })

// Define the acceptable zoom level range
const minZoomLevel = 18;
const currentZoomLevelRef = useRef(null);
const mapRef = useRef(null);

// Callback function when the map loads
  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map; // Store the map object in the ref
    
    // Get the initial zoom level and store it in currentZoomLevelRef
    if (map.getZoom) {
      const initialZoomLevel = map.getZoom();
      currentZoomLevelRef.current = initialZoomLevel;
    }
  
    // Attach the onZoomChanged event listener
    if (map.addListener) {
      map.addListener('zoom_changed', onZoomChanged, { passive: true });
    }
  }, []);


  // Callback function when the component unmounts
  const onUnmount = React.useCallback(function callback(map) {
    mapRef.current = null;
    setMap(null)
  }, [])

   // Function to handle zoom level change
   const onZoomChanged = () => {
    if (mapRef.current && mapRef.current.getZoom) {
      const zoomLevel = mapRef.current.getZoom();
      currentZoomLevelRef.current = zoomLevel;
    }
  };

  
// Attach the onZoomChanged event listener
useEffect(() => {
  if (mapRef.current) {
    mapRef.current.addListener('zoom_changed', onZoomChanged, { passive: true });
  }
}, []);

 // all google map initilization related function ends here






  // Load all garbage bin data from database
  useEffect(() => {
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

 
// Function to handle the selection of a bin size
const handleBinSizeSelect = (selectedOption) => {
  setSelectedBinSize(selectedOption.value);
  filterGarbageBins(selectedOption.value);
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

          // Set the zoom level to focus on the user's location
          map.setZoom(18); 
        }
      });
    } else {
      alert('Geolocation is not available in your browser.');
    }
  };
  



 //function to handle the view details of the bin
  const handleMarkerClick = async (bin) => {
    try {
      // Fetch data for the selected garbage Bin  using its ID
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


// Function to change the bin Marker's location
const handleChangeMarkerLocation = (binId) => {
  setIsChangingBinLocation(true);
  setShowAlertLocation(true);
  setSelectedLocation(null);
  setBinId(binId);
  setShowAlertLocation(true); // Show the alert when changing location
  setViewInfo(false);
 
};

// Function to capture coordinates when changing a marker's location
const onMapChangeLocationClick = async (lat , lng) => {
  
      const garbageBinRef = doc(db, "garbageBins", binId);
      const geoPoint = new GeoPoint(lat, lng);

      // Update the location in Firestore
      try {
        await updateDoc(garbageBinRef, { location: geoPoint });
        console.log("Successfully updated garbage bin location");

        // Update the garbageBins state with the new location
        setGarbageBins((prevGarbageBins) =>
          prevGarbageBins.map((b) => (b.id === binId ? { ...b, location: geoPoint } : b))
        );

        setIsChangingBinLocation(false); // Set the state back to indicate you're not changing a bin location
        setShowAlertLocation(false);
        setShowAlertSuccessLocation(true);
        setBinId(null);
      } catch (error) {
        console.error("Error updating garbage bin location:", error);
      }
};

//function to handle clicks on the map 
const onMapClick = async (event) => {

    // Capture the coordinates and display a confirmation message
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

  // Check if the conditions are met
  checkLocationCondtion(lat , lng);
};


//to check if condtions met then act towards it
const checkLocationCondtion = async (lat ,lng) =>{
  if (currentZoomLevelRef.current >= minZoomLevel) {
    const locationType = await checkLocationType(lat, lng);
    setNewGarbageBinLocation({ lat, lng });
    if (locationType === 'building') {
      setCheckMessageVisible(true);
    } else {
      handleOnMapClick(lat,lng);  
  }
  } else {
    // Show an alert message indicating that a garbage bin can only be added on a specific scale.
    handleAlertZoom();
  } 
}

const handleOnMapClick = (lat ,lng) =>{

  if (isChangingBinLocation) {
    onMapChangeLocationClick(lat,lng)
  }else{
   setFormVisible(true);
  }
}


// function to check the location type called by checkLocationCondtion function
const checkLocationType = (lat, lng) => {

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


 //  function for adding a new Garbage Bin 
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

 
// Function to generate a unique serial number
function generateSerialNumber() {
  return uuidv4();// Generates a random UUID
}

// to handle the deletion of a bin
const handleDeletion = () => {
  DeleteGarbageBin(selectedLocation.id);
  setSelectedLocation(false);
};

// to delete the garbage bin doc
const DeleteGarbageBin = async (garbageBinId) => {
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
  <div style={{ position: 'relative', width: '100%', height: '100%' }}>


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
          onClick={handleUserLocation}>
          <span>عرض الموقع الحالي</span>
        </Button>

  
        <Select
          placeholder="تصفية حسب حجم الحاوية..."
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={binSizeOptions}
          value={selectedBinSize !== null ? binSizeOptions.find((option) => option.value === selectedBinSize) : null}
          onChange={(value) => handleBinSizeSelect(value)}
          required
          styles={reactSelectStyles}
        />
      </div>
    

      <div style={{ position: 'absolute', zIndex: 3000 }}>
        <ErrorAlertMessage open={showAlertZoom} handler={handleAlertZoom} message="كبر الخريطة لتتمكن من إضافة حاوية القمامة " />
      </div>

      <div style={{ position: 'absolute', zIndex: 3000 }}>
        <ErrorAlertMessage open={showAlertStreet} handler={handleAlertStreet} message=" إلتزم بحدود الطرق عند إضافة حاوية قمامة" />
      </div>

      <div style={{ position: 'absolute', zIndex: 2000 }}>
        <AlertMessage open={showAlertLocation} handler={handleAlertLocation} message="انت الان في وضع تغيير موقع الحاوية" />
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
       center={userPosition || center}
       zoom={zoom}
        onLoad={onLoad} // Callback function that gets executed when the map is loaded.
        onUnmount={onUnmount} // Callback function that gets executed when the component unmounts.
        onClick={onMapClick}
        ref={mapRef}
        options={{
          streetViewControl: false,
          mapTypeControl: false, // This hides the map/satellite view control
          fullscreenControl: false, 
        
        }}
      >



        {garbageBins.map((bin) => (
          <Marker
          key={bin.id}
          position={{ lat: bin.location._lat, lng: bin.location._long }}
          onClick={() => handleMarkerClick(bin)}
          icon={{
            url: binId === bin.id ?  '/trashChange.png' : '/trash.png',
            scaledSize: new window.google.maps.Size(45, 45),
          }}
          
          ref={(marker) => {
            // Store a reference to the Marker object in the state
            markerRefs[bin.id] = marker;
          }}
        >                        
        </Marker>
        ))}
    

    {showUserLocation && userPosition && (
          <Marker position={userPosition} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#4285F4', fillOpacity: 0.8, strokeColor: '#4285F4' }}>
            <Circle center={userLocationRange} options={{ radius: userLocationRange.radius, strokeColor: '#4285F4', fillColor: '#4285F4', fillOpacity: 0.2 }} />
          </Marker>
        )}

    

        <ViewGarbageInfo open={viewInfo} onClose={closeInfoDrawer} DeleteMethod={handleDeletion} Changelocation={handleChangeMarkerLocation} bin={binData} binId={binId} />
        <GarbageBinForm open={formVisible} handler={handleForm} AddMethod={AddGarbageBin} />
        <Success open={showSuccessAlert} handler={handleSuccessAlert} message=" تم إضافة حاوية القمامة بنجاح" />
        <Success open={showAlertDeletion} handler={handlealertDeletion} message=" تم حذف حاوية القمامة بنجاح" />
        <Success open={showAlertSuccessLocation} handler={handleAlertSuccessLocation} message=" تم تغيير موقع حاوية القمامة بنجاح" />
        <Confirm open={checkMessageVisible} handler={handleCheckMessage} method={()=>{ handleOnMapClick(newGarbageBinLocation.lat,newGarbageBinLocation.lng); setCheckMessageVisible(false);}} message="هل انت متأكد من أن الموقع المحدد يقع على شارع؟" />
      </GoogleMap>
    </div>
  ) : <></>
}

export default React.memo(GarbageBinMap)