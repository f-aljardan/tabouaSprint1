import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useEffect, useState } from "react";
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc} from "firebase/firestore";
import {  getDoc } from "firebase/firestore";
import Confirm from '../messages/Confirm';
import ViewCenterInfo from "../viewInfo/ViewCenterInfo"
import RecyclingCenterForm from "../forms/RecyclingCenterForm"
import Success from "../messages/Success"


const containerStyle = {
    width: '950px',
    height: '500px'
};

const center = {
  lat: 24.7136,
  lng: 46.6753
};

function Map() {

    const [recyclingCenters, setRecyclingCenters] = useState([]);
    const [selectedLocation, setSelectedLocation] = React.useState(false);
    const [centerData ,SetCenterData] = React.useState([]);
    const [formVisible, setFormVisible] = useState(false); // To control confirmation message visibility
    const [newRecyclingCenterLocation, setNewRecyclingCenterLocation] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertDeletion, setShowAlertDeletion] = useState(false);
    const [viewInfo, setViewInfo] = React.useState(false);

    const openInfoDrawer = () => setViewInfo(true);
    const closeInfoDrawer = () => setViewInfo(false);
    const handlealert = () => setShowAlert(!showAlert);
    const handleForm = () => setFormVisible(!formVisible);
  const handlealertDeletion = () => setShowAlertDeletion(!showAlertDeletion);

    useEffect(() => {
    
        // Function to fetch recycling centers from Firestore
       const fetchRecyclingCenters = async () => {
         try {
           const querySnapshot = await getDocs(collection(db, "recyclingCenters"));
           const centersData = [];
           querySnapshot.forEach((doc) => {
             const data = doc.data();
             const location = data.location || {};
             centersData.push({ id: doc.id, location });
           });
           setRecyclingCenters(centersData);
         
         } catch (error) {
           console.error("Error fetching recycling centers:", error);
         }
       };
         fetchRecyclingCenters();
       }, []);

       
    const onMapClick = (event) => {
        // Capture the coordinates and display a confirmation message
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("Clicked Coordinates:", lat, lng)
        // Store the new garbage bin location temporarily
        setNewRecyclingCenterLocation({ lat, lng });
        setFormVisible(true);
    };

    //  code for adding a new recycling center
const handleAddRecyclingCenter = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "recyclingCenters"), {
            name: data.name,
            description: data.description,
            type: data.types,
            location: new GeoPoint(newRecyclingCenterLocation.lat, newRecyclingCenterLocation.lng),
            imageURL: data.imageURL, // Add imageURL to the document
            openingHours: data.openingHours, // Add openingHours to the document
            phoneNo: data.phoneNo, // Add phoneNo to the document
        });
        setRecyclingCenters([...recyclingCenters, {  
            id: docRef.id ,
            location: new GeoPoint(newRecyclingCenterLocation.lat, newRecyclingCenterLocation.lng), }]);
        // Show success message here
        setShowAlert(true); 
     
     
    } catch (error) {
        console.error("Error adding recycling center:", error);
    }
};


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    console.log("onload")
   
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])



 

  const handleMarkerClick = async (recycleCenter) => {
    
    try {
      // Fetch data for the selected recycling center using its ID
      const centerDocRef = doc(db, "recyclingCenters", recycleCenter.id);
      const centerDocSnapshot = await getDoc(centerDocRef);
  
      if (centerDocSnapshot.exists()) {
        SetCenterData(centerDocSnapshot.data());
        // You can use this data as needed in your component
      } else {
        console.error("Recycling center not found.");
      }
    } catch (error) {
      console.error("Error fetching recycling center data:", error);
    }
    openInfoDrawer();
    setSelectedLocation(recycleCenter);
   
  
  };


  const handleDeleteConfirmation = () => {
    
      onDeleteGarbageBin(selectedLocation.id);
      setSelectedLocation(false); // Close the info window after deletion.
   // }
  };

  
const onDeleteGarbageBin = async (centerId) => {
    try {
      // Construct a reference to the center document to be deleted
      const centerDocRef = doc(db, "recyclingCenters", centerId);
  
      // Delete the center document from Firestore
      await deleteDoc(centerDocRef);
  
      // Update the state to remove the deleted garbage bin
      setRecyclingCenters((prevrecyclingCenters) =>
      prevrecyclingCenters.filter((center) => center.id !== centerId)
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
        zoom={10}
        onLoad={onLoad} //Callback function that gets executed when the map is loaded.
        onUnmount={onUnmount}//Callback function that gets executed when the component unmounts.
        onClick={onMapClick}
      >

        {recyclingCenters.map((recycleCenter) => (
          <Marker
            key={recycleCenter.id}
            position={{ lat: recycleCenter.location._lat, lng: recycleCenter.location._long }} // Update here
            onClick={() => handleMarkerClick(recycleCenter)}
          >    
{/* 
          <ViewCenterInfo  open={selectedLocation && selectedLocation.id === recycleCenter.id} handler={() => setSelectedLocation(false)} Deletemethod={handleDeleteConfirmation} center={centerData}/>
           */}
          {/* <ViewCenterInfo  open={viewInfo} handler={handleviewInfo} Deletemethod={handleDeleteConfirmation} center={centerData}/>
           */}
          </Marker>
        ))}

       
          <ViewCenterInfo  open={viewInfo} onClose={closeInfoDrawer} Deletemethod={handleDeleteConfirmation} center={centerData}/>
          
        <RecyclingCenterForm open={formVisible} handler={handleForm} method={handleAddRecyclingCenter} />
        <Success open={showAlert} handler={handlealert} message=" !تم إضافة مركز التدوير بنجاح" />
        <Success open={showAlertDeletion} handler={handlealertDeletion} message=" !تم حذف مركز التدوير بنجاح" />
        
      </GoogleMap>

  ) : <></>
}

export default React.memo(Map)