import React , {useState, useEffect, useRef} from 'react'
import { GoogleMap, useJsApiLoader, Marker , OverlayView } from '@react-google-maps/api';
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc ,getDoc, Timestamp } from "firebase/firestore"; // Import the necessary Firestore functions
import { Button , Tooltip} from "@material-tailwind/react";
import Confirm from '../messages/Confirm';
import Success from "../messages/Success"
import GarbageBinForm from "../forms/GarbageBinForm"
import ViewGarbageInfo from "../viewInfo/ViewGarbageInfo"
import AlertMessage from "../messages/AlertMessage"

const containerStyle = {
  width: '100%', // Set a width as needed
  height: '550px'
};

const center = {
  lat: 24.7136,
  lng: 46.6753
};




function Map() {

  const [zoom, setZoom] = useState(10); // set the initial zoom level
  const [userPosition, setUserPosition] = useState(null);
  const [garbageBins, setGarbageBins] = useState([]);
  const [binData ,SetBinData] = React.useState([]);
  const [binId , setBinId] = useState();
  const [formVisible, setFormVisible] = useState(false);// To control confirmation message visibility
  const [newGarbageBinLocation, setNewGarbageBinLocation] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAlertDeletion, setShowAlertDeletion] = useState(false);
  const [viewInfo, setViewInfo] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState(false);

  const openInfoDrawer = () => setViewInfo(true);
  const closeInfoDrawer = () => setViewInfo(false);
  const handleForm = () => setFormVisible(!formVisible);
  const handleAlert = () => setShowAlert(!showAlert);
  const handleSuccessAlert = () => setShowSuccessAlert(!showSuccessAlert);
  const handlealertDeletion = () => setShowAlertDeletion(!showAlertDeletion);


 // Define the acceptable zoom level range
 const minZoomLevel = 18;
 const currentZoomLevelRef = useRef(null);
 const mapRef = useRef(null);





  useEffect( ()=>{
      const fetchGarbageBins = async () => {
      try {
      const querySnapshot = await getDocs(collection(db, "garbageBins"));
      const binsData = [];
      querySnapshot.forEach((doc) => {
          const data = doc.data();
          const location = data.location || {}; // Ensure location is an object
          binsData.push({ id: doc.id, location }); // Include the location field
               });

      setGarbageBins(binsData);
    
  } catch (error) {
      console.error("Error fetching garbage bins:", error);
  }
    };//fetchGarbageBins
fetchGarbageBins();



 },[])
 
 
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    console.log("onload");
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
        setZoom(15); 
      });
    } else {
      alert('Geolocation is not available in your browser.');
    }
  };
  

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


const onMapClick = (event) => {
  // Capture the coordinates and display a confirmation message
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();
  console.log("Clicked Coordinates:", lat, lng);
console.log(currentZoomLevelRef.current)
  // Check if the conditions are met
  if (currentZoomLevelRef.current >= minZoomLevel) {
    console.log("Adding a garbage bin at this location.");
    setNewGarbageBinLocation({ lat, lng });
    setFormVisible(true);
  } else {
    handleAlert();
  }
};


  const handleDeletion = () => {
   
      // Call the onDeleteGarbageBin function passed as a prop to handle deletion.
      onDeleteGarbageBin(selectedLocation.id);
      setSelectedLocation(false);

  };

  const generateRandomSerial = () => {
    const serialNumber = Math.floor(Math.random() * 1000000); // Change the range as needed
    return serialNumber;
  };
  
const AddGarbageBin = async (data) => {
  try {
    const geoPoint = new GeoPoint(
      newGarbageBinLocation.lat,
      newGarbageBinLocation.lng
    );
  
    const randomSerialNumber = generateRandomSerial();

    const docRef = await addDoc(collection(db, "garbageBins"), {
      location: geoPoint,
      size: data.size,
      date: Timestamp.fromDate(new Date()),
      maintenanceDate: Timestamp.fromDate(new Date()),
      serialNumber: randomSerialNumber, 
    });

    console.log("Document added with ID:", docRef.id); // Log the document ID

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
     setShowAlertDeletion(true);
    // Display a success message
    
  } catch (error) {
    console.error("Error deleting garbage bin:", error);
    alert("An error occurred while deleting the garbage bin.");
  }
};



return isLoaded ? (
  <div style={{ position: 'relative' , width:'100%',}}>
    <div className="flex gap-5 p-4 mr-12 z-10" style={{ position: 'absolute' }}>
    <Tooltip
      className="bg-white font-baloo text-md text-gray-600"
      content="*  لإضافة موقع حاوية جديدة قم بالضغط على الموقع المحدد والالتزام بحدود الطرق"
      placement="bottom"  
    >
      <Button style={{ background: "#97B980", color: '#ffffff' }} size='sm'><span>إضافة</span></Button>
    </Tooltip>
      
    <Tooltip
      className="bg-white font-baloo text-md text-gray-600"
      content="* لإزالة موقع حاوية قم بالضغط على موقع الحاوية"
      placement="bottom"
    >
      <Button style={{ background: "#FE5500", color: '#ffffff' }} size='sm'><span>إزالة</span></Button>
    </Tooltip>
    <Button
  style={{ background: '#FE9B00', color: '#ffffff' }}
  size="sm"
  onClick={getUserPosition}
>
  <span>عرض الموقع الحالي</span>
</Button>

  </div>
    
<div style={{position: 'absolute', zIndex: 2000, }}>
  <AlertMessage open={showAlert} handler={handleAlert} message="كبر الخريطة لتتمكن من إضافة حاوية القمامة " />
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
        
         {/* <Confirm  open={selectedLocation && selectedLocation.id === bin.id} handler={() => setSelectedLocation(false)} method={handleDeleteConfirmation} message="هل انت متأكد من حذف حاوية نفاية بالموقع المحدد؟"/>
          */}
{/*           
          <ViewGarbageInfo  open={selectedLocation && selectedLocation.id === bin.id} handler={() => setSelectedLocation(false)} Deletemethod={handleDeleteConfirmation} bin={binData}/>
        */}
            
          </Marker>
    ))}
    


  <ViewGarbageInfo open={viewInfo} onClose={closeInfoDrawer}  DeleteMethod={handleDeletion} bin={binData} binId={binId}/>
  
<GarbageBinForm open={formVisible} handler={handleForm} AddMethod={AddGarbageBin}  />
{/*  
 <Confirm  open={confirmationVisible} handler={handleConfirm} method={saveCoordinatesToFirestore}  message="   هل انت متأكد من إضافة حاوية نفاية بالموقع المحدد؟"/>
   */}
  
  <Success open={showSuccessAlert} handler={handleSuccessAlert} message=" !تم إضافة حاوية القمامة بنجاح" />
 <Success open={showAlertDeletion} handler={handlealertDeletion} message=" !تم حذف حاوية القمامة بنجاح" />
  
    
        <></>
      </GoogleMap>
</div>
  ) : <></>
}

export default React.memo(Map)