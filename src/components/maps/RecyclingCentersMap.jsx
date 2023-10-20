import React from 'react'
import { GoogleMap, useJsApiLoader, Marker,Circle, } from '@react-google-maps/api';
import { useEffect, useState, useRef } from "react";
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc} from "firebase/firestore";
import {  getDoc } from "firebase/firestore";
import Confirm from '../messages/Confirm';
import ViewCenterInfo from "../viewInfo/ViewCenterInfo"
import RecyclingCenterForm from "../forms/RecyclingCenterForm"
import Success from "../messages/Success"
import AlertMessage from "../messages/AlertMessage"
import { Button , Tooltip} from "@material-tailwind/react";

const containerStyle = {
    width: '100%', // Set a width as needed
    height: '100%'
  };

const center = {
  lat: 24.7136,
  lng: 46.6753
};


let customIcon;

function Map() {

    const [zoom, setZoom] = useState(10); // set the initial zoom level
    const [recyclingCenters, setRecyclingCenters] = useState([]);
    const [selectedLocation, setSelectedLocation] = React.useState(false);
    const [centerData ,SetCenterData] = React.useState([]);
    const [formVisible, setFormVisible] = useState(false); // To control confirmation message visibility
    const [newRecyclingCenterLocation, setNewRecyclingCenterLocation] = useState(null);
    const [showAlertZoom, setShowAlertZoom] = useState(false);
    const [showAlertBuilding, setShowAlertBuilding] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showAlertSuccessDeletion, setShowAlertSuccessDeletion] = useState(false);
    const [viewInfo, setViewInfo] = React.useState(false);
    const [userPosition, setUserPosition] = useState(null);
    const [showUserLocation, setShowUserLocation] = useState(false);
    const [userLocationRange, setUserLocationRange] = useState(null);

    const openInfoDrawer = () => setViewInfo(true);
    const closeInfoDrawer = () => setViewInfo(false);
    const handleAlertZoom = () => setShowAlertZoom(!showAlertZoom);
    const handleAlertBuilding = () => setShowAlertBuilding(!showAlertBuilding);
    const handleSuccessAlert = () => setShowSuccessAlert(!showSuccessAlert);
    const handleForm = () => setFormVisible(!formVisible);
    const handleAlertSuccessDeletion = () => setShowAlertSuccessDeletion(!showAlertSuccessDeletion);

  
 // Define the acceptable zoom level range
 const minZoomLevel = 18;
 const currentZoomLevelRef = useRef(null);
 const mapRef = useRef(null);

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

       
  const handleUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // setUserLocation({ lat: latitude, lng: longitude });
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

    const onMapClick = async (event) => {
        // Capture the coordinates and display a confirmation message
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("Clicked Coordinates:", lat, lng)
        // Check if the conditions are met
  if (currentZoomLevelRef.current >= minZoomLevel) {
    const terrainType = await checkTerrainType(lat, lng);
    if (terrainType === 'building') {
       // Store the new garbage bin location temporarily
       setNewRecyclingCenterLocation({ lat, lng });
       setFormVisible(true);
     } else {
       // Show an alert message indicating that a recycling center can only be added on a building.
       handleAlertBuilding();
     }
    } else {
        // Show an alert message indicating that a recycling center can only be added on a specefic scale.
        handleAlertZoom();
      }
        
    };

    //  code for adding a new recycling center
    const handleAddRecyclingCenter = async (data) => {
      
        try {
          const openingHours = {
            fri: {
                from: data.openingHours.fri.isClosed ? '' : data.openingHours.fri.from.toDate().toISOString(),
                to: data.openingHours.fri.isClosed ? '' : data.openingHours.fri.to.toDate().toISOString(),
                isClosed: data.openingHours.fri.isClosed,
    
              },
           
            weekdays: {
              from: data.openingHours.weekdays.from.toDate().toISOString(),
              to: data.openingHours.weekdays.to.toDate().toISOString(),
            },
            sat: {
                from: data.openingHours.sat.isClosed ? '' : data.openingHours.sat.from.toDate().toISOString(),
                to: data.openingHours.sat.isClosed ? '' : data.openingHours.sat.to.toDate().toISOString(),
                isClosed: data.openingHours.sat.isClosed,
              },
           
          };
      
          const docRef = await addDoc(collection(db, "recyclingCenters"), {
            name: data.name,
            description: data.description,
            type: data.types,
            location: new GeoPoint(newRecyclingCenterLocation.lat, newRecyclingCenterLocation.lng),
            imageURL: data.imageURL,
            logoURL: data.logoURL, 
            websiteURL: data.websiteURL,
            openingHours: openingHours,
            phoneNo: data.phoneNo,
          });
      
          setRecyclingCenters([
            ...recyclingCenters,
            {
              id: docRef.id,
              location: new GeoPoint(newRecyclingCenterLocation.lat, newRecyclingCenterLocation.lng),
            },
          ]);
      
          // Show success message here
          setShowSuccessAlert(true);
        } catch (error) {
          console.error("Error adding recycling center:", error);
        }
      };
      

//load the Google Maps JavaScript API 
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk"
  })

  
  if (isLoaded) {
    customIcon = {
    url: '/recyclingcenter.png', // Replace with the actual path to your icon
    scaledSize: new window.google.maps.Size(45, 45), // Set the desired width and height
  };
  }

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


  const handleDeletion = () => {
    
      onDeleteGarbageBin(selectedLocation.id);
      setSelectedLocation(false); // Close the drawer window after deletion.
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
       setShowAlertSuccessDeletion(true);
      // Display a success message
      
    } catch (error) {
      console.error("Error deleting garbage bin:", error);
      alert("An error occurred while deleting the garbage bin.");
    }
  };

  return isLoaded ? (
    <div style={{ position: 'relative' , width:'100%', height: "%100"}}>
    <div className="flex gap-5 p-4 mr-12" style={{ position: 'absolute', zIndex: 1000 }}>
    <Tooltip
      className="bg-white font-baloo text-md text-gray-600"
      content=" لإضافة موقع مركز تدوير جديد قم بالضغط على الموقع المحدد والالتزام بحدود المباني"
      placement="bottom"
      
    >
      <Button style={{ background: "#97B980", color: '#ffffff' }} size='sm'><span>تعليمات إضافة مركز</span></Button>
    </Tooltip>
      
    <Tooltip
      className="bg-white font-baloo text-md text-gray-600"
      content=" لإزالة موقع مركز تدوير قم بالضغط على موقع المركز  "
      placement="bottom"
    >
      <Button style={{ background: "#FE5500", color: '#ffffff' }} size='sm'><span>تعليمات إزالة مركز</span></Button>
    </Tooltip>
    
    <Button
  style={{ background: '#FE9B00', color: '#ffffff' }}
  size="sm"
  onClick={handleUserLocation}>

  <span>عرض الموقع الحالي</span>
   </Button>

    </div>


    <div style={{position: 'absolute', zIndex: 2000, }}>
  <AlertMessage open={showAlertZoom} handler={handleAlertZoom} message="كبر الخريطة لتتمكن من إضافة مركز تدوير " />
  </div>
  <div style={{position: 'absolute', zIndex: 2000, }}>
  <AlertMessage open={showAlertBuilding} handler={handleAlertBuilding} message="  التزم بحدود المباني عند إضافة مركز التدوير" />
  </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userPosition || center}
        zoom={zoom}
        onLoad={onLoad} //Callback function that gets executed when the map is loaded.
        onUnmount={onUnmount}//Callback function that gets executed when the component unmounts.
        onClick={onMapClick}
        ref={mapRef}
      >

        {recyclingCenters.map((recycleCenter) => (
          <Marker
            key={recycleCenter.id}
            position={{ lat: recycleCenter.location._lat, lng: recycleCenter.location._long }} // Update here
            onClick={() => handleMarkerClick(recycleCenter)}
            icon={customIcon}
          >    

          </Marker>
        ))}

{showUserLocation && userPosition && (
      <Marker position={userPosition} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#4285F4', fillOpacity: 0.8, strokeColor: '#4285F4' }}>
        <Circle center={userLocationRange} options={{ radius: userLocationRange.radius, strokeColor: '#4285F4', fillColor: '#4285F4', fillOpacity: 0.2 }} />
      </Marker>
    )}
        <ViewCenterInfo  open={viewInfo} onClose={closeInfoDrawer} DeleteMethod={handleDeletion} center={centerData}/>
        <RecyclingCenterForm open={formVisible} handler={handleForm} method={handleAddRecyclingCenter} />
        <Success open={showSuccessAlert} handler={handleSuccessAlert} message=" تم إضافة مركز التدوير بنجاح" />
        <Success open={showAlertSuccessDeletion} handler={handleAlertSuccessDeletion} message=" تم حذف مركز التدوير بنجاح" />
        
      </GoogleMap>
      </div>
  ) : <></>
}

export default React.memo(Map)