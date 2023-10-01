import React , {useState, useEffect} from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc} from "firebase/firestore"; // Import the necessary Firestore functions

import Confirm from '../messages/Confirm';
import Success from "../messages/Success"



const containerStyle = {
  width: '800px',
  height: '500px'
};

const center = {
  lat: 24.7136,
  lng: 46.6753
};

function Map() {

  
  const [garbageBins, setGarbageBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationVisible, setConfirmationVisible] = useState(false); // To control confirmation message visibility
  const [newGarbageBinLocation, setNewGarbageBinLocation] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDeletion, setShowAlertDeletion] = useState(false);
 
  
  const handleConfirm = () => setConfirmationVisible(!confirmationVisible);
  const handlealert = () => setShowAlert(!showAlert);
  const handlealertDeletion = () => setShowAlertDeletion(!showAlertDeletion);

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
      setLoading(false);
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
    console.log("onload")
   
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    console.log("unmount")
    setMap(null)
  }, [])

  const [selectedLocation, setSelectedLocation] = React.useState(false);



  const handleMarkerClick = (bin) => {
    setSelectedLocation(bin);
  };

  
  const onMapClick = (event) => {
    // Capture the coordinates and display a confirmation message
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log("Clicked Coordinates:", lat, lng)
    // Store the new garbage bin location temporarily
    setNewGarbageBinLocation({ lat, lng });

    // You can show a modal or a confirmation dialog here
    setConfirmationVisible(true);  
};

  const handleDeleteConfirmation = () => {
    
      // Call the onDeleteGarbageBin function passed as a prop to handle deletion.
      onDeleteGarbageBin(selectedLocation.id);
      setSelectedLocation(false); 

  };


  
const saveCoordinatesToFirestore = async () => {
  try {
    const geoPoint = new GeoPoint(
      newGarbageBinLocation.lat,
      newGarbageBinLocation.lng
    );
    console.log("GeoPoint:", geoPoint); // Log the GeoPoint before saving

    const docRef = await addDoc(collection(db, "garbageBins"), {
      location: geoPoint,
    });

    console.log("Document added with ID:", docRef.id); // Log the document ID

    setGarbageBins([...garbageBins, { id: docRef.id, location: geoPoint }]);
    setConfirmationVisible(false);
    setShowAlert(true);

    
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
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
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
        
           <Confirm  open={selectedLocation && selectedLocation.id === bin.id} handler={() => setSelectedLocation(false)} method={handleDeleteConfirmation} message="هل انت متأكد من حذف حاوية نفاية بالموقع المحدد؟"/>
           
             
          </Marker>
    ))}

<Success open={showAlert} handler={handlealert} message=" !تم إضافة حاوية القمامة بنجاح" />
 <Success open={showAlertDeletion} handler={handlealertDeletion} message=" !تم حذف حاوية القمامة بنجاح" />
 <Confirm  open={confirmationVisible} handler={handleConfirm} method={saveCoordinatesToFirestore} message="   هل انت متأكد من إضافة حاوية نفاية بالموقع المحدد؟"/>
 
    
        <></>
      </GoogleMap>

  ) : <></>
}

export default React.memo(Map)