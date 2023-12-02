import React from 'react'
import { GoogleMap, useJsApiLoader, Marker,Circle, } from '@react-google-maps/api';
import { useEffect, useState, useRef } from "react";
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc, updateDoc} from "firebase/firestore";
import {  getDoc } from "firebase/firestore";
import ViewCenterInfo from "../viewInfo/ViewCenterInfo"
import RecyclingCenterForm from "../forms/RecyclingCenterForm"
import Success from "../messages/Success"
import Confirm from "../messages/Confirm"
import ErrorAlertMessage from "../messages/ErrorAlertMessage"
import AlertMessage from "../messages/AlertMessage"
import AlertMessageCenter from '../messages/AlertMessageCenter';
import { Button , Tooltip ,Input} from "@material-tailwind/react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const animatedComponents = makeAnimated();

const options = [
  { value: '', label: 'جميع أنواع النفايات' },
  { value: 'بلاستيك', label: 'بلاستيك' },
  { value: 'ورق', label: 'ورق' },
  { value: 'زجاج', label: 'زجاج' },
  { value: 'كرتون', label: 'كرتون' },
  { value: 'معدن', label: 'معدن' },
  { value: 'إلكترونيات', label: 'إلكترونيات' },
  { value: 'أخرى', label: 'أخرى' },
];


// Define constants for the Google Map
const containerStyle = {
    width: '100%', // Set a width as needed
    height: '100%'
  };

// Set the initial center
const center = {
  lat: 24.7136,
  lng: 46.6753
};




function RecyclingCentersMap() {

    const [zoom, setZoom] = useState(10); // set the initial zoom level
    const [recyclingCenters, setRecyclingCenters] = useState([]);
    const [selectedLocation, setSelectedLocation] = React.useState(false);
    const [centerData ,SetCenterData] = React.useState([]);
    const [formVisible, setFormVisible] = useState(false); // To control confirmation message visibility
    const [newRecyclingCenterLocation, setNewRecyclingCenterLocation] = useState(null);
    const [showAlertZoom, setShowAlertZoom] = useState(false);
    const [showAlertBuilding, setShowAlertBuilding] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showAlertLocation, setShowAlertLocation] = useState(false);
    const [showAlertSuccessDeletion, setShowAlertSuccessDeletion] = useState(false);
    const [showAlertSuccessLocation, setShowAlertSuccessLocation] = useState(false);
    const [viewInfo, setViewInfo] = React.useState(false);
    const [userPosition, setUserPosition] = useState(null);
    const [showUserLocation, setShowUserLocation] = useState(false);
    const [userLocationRange, setUserLocationRange] = useState(null);
    const [map, setMap] = React.useState(null)
    const [centerId, setCenterId] = React.useState(null);
    const [isChangingCenterLocation, setIsChangingCenterLocation] = useState(false);
    const [selectedCenterType, setSelectedCenterType] = useState('');
    const [filteredRecyclingCenters, setFilteredRecyclingCenters] = useState([]);
    const [centerCount, setCenterCount] = useState(0); // State to store the center count
    const [showCenterWasteType , setShowCenterWasteType] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const[ checkMessageVisible, setCheckMessageVisible] = useState(false);


    const openInfoDrawer = () => setViewInfo(true);
    const closeInfoDrawer = () => {setViewInfo(false);  setCenterId(null);}
    const handleAlertZoom = () => setShowAlertZoom(!showAlertZoom);
    const handleAlertBuilding = () => setShowAlertBuilding(!showAlertBuilding);
    const handleSuccessAlert = () => setShowSuccessAlert(!showSuccessAlert);
    const handleForm = () => setFormVisible(!formVisible);
    const handleAlertSuccessDeletion = () => setShowAlertSuccessDeletion(!showAlertSuccessDeletion);
    const handleAlertLocation = () => {setShowAlertLocation(!showAlertLocation);  setIsChangingCenterLocation(false); setCenterId(null);}
    const handleAlertSuccessLocation = () => setShowAlertSuccessLocation(!showAlertSuccessLocation);
    const handleAlertshowNumberWasteType = () => setShowCenterWasteType(!showCenterWasteType);
    const handleCheckMessage= () => {    handleAlertBuilding(); setCheckMessageVisible(!checkMessageVisible);}

 // Define the acceptable zoom level range
 const minZoomLevel = 18;
 const currentZoomLevelRef = useRef(null);
 const mapRef = useRef(null);

 useEffect(() => { }, [centerCount]);

    useEffect(() => {
    
        // Function to fetch recycling centers from Firestore
       const fetchRecyclingCenters = async () => {
         try {
           const querySnapshot = await getDocs(collection(db, "recyclingCenters"));
           const centersData = [];
           querySnapshot.forEach((doc) => {
             const data = doc.data();
             const location = data.location || {};
             const type = data.type;
             const name = data.name;
             centersData.push({ id: doc.id, location , type , name });
             
           });
           setRecyclingCenters(centersData);
           setFilteredRecyclingCenters(centersData);
         } catch (error) {
           console.error("Error fetching recycling centers:", error);
         }
       };
         fetchRecyclingCenters();
       }, []);
      

      
  
//load the Google Maps JavaScript API 
const { isLoaded } = useJsApiLoader({
  id: 'google-map-script',
  googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk"
})


// Callback function when the map loads
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

  // Callback function when the component unmounts
const onUnmount = React.useCallback(function callback(map) {
  console.log("unmount")
  mapRef.current = null;
  setMap(null)
}, [])

  // Function to get the user's location
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
    mapRef.current.addListener('zoom_changed', onZoomChanged);
  }
}, []);




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
  setCenterId(recycleCenter.id);
};



// Function to change the Marker's location
const handleChangeMarkerLocation = (centerID) => {
  setIsChangingCenterLocation(true);
  setShowAlertLocation(true);
  setSelectedLocation(null);
  setCenterId(centerID);
  setShowAlertLocation(true); // Show the alert when changing location
  setViewInfo(false);
 
};

// Function to capture coordinates when changing a marker's location
const onMapChangeLocationClick = async (lat , lng) => {
  
      const garbageBinRef = doc(db, "recyclingCenters", centerId);
      const geoPoint = new GeoPoint(lat, lng);

      // Update the location in Firestore
      try {
        await updateDoc(garbageBinRef, { location: geoPoint });
        console.log("Successfully updated center location");

        // Update the garbageBins state with the new location
        setRecyclingCenters((prevRecyclingCenters) =>
        prevRecyclingCenters.map((b) => (b.id === centerId ? { ...b, location: geoPoint } : b))
        );

        setIsChangingCenterLocation(false); // Set the state back to indicate you're not changing a bin location
        setShowAlertLocation(false);
        setShowAlertSuccessLocation(true);
        setCenterId(null);
      } catch (error) {
        console.error("Error updating center location:", error);
      }
   
};


    const onMapClick = async (event) => {
        // Capture the coordinates 
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
    
        // Check if the conditions are met
  if (currentZoomLevelRef.current >= minZoomLevel) {
    const locationType = await checkLocationType(lat, lng);
    setNewRecyclingCenterLocation({ lat, lng });
    if (locationType === 'building') {

      handleOnMapClick(lat,lng);

     } else {
       // Show an alert message indicating that a recycling center can only be added on a building.
       setCheckMessageVisible(true);
     }
    } else {
        // Show an alert message indicating that a recycling center can only be added on a specefic scale.
        handleAlertZoom();
      }
        
    };


    const handleOnMapClick = (lat ,lng) =>{
  
      if (isChangingCenterLocation) {
        onMapChangeLocationClick(lat,lng)
      }else{
         setFormVisible(true);
      }
    }
    
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
      



 
  const handleDeletion = () => {
    
      DeleteRecyclingCenter(selectedLocation.id);
      setSelectedLocation(false); // Close the drawer window after deletion.
  };

const DeleteRecyclingCenter = async (centerId) => {
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


  // return centers that have the selected waste type
  const filterRecyclingCenters = (type) => {
    if (type === '') {
      // If no type is selected, show all recycling centers
      setCenterCount(0); // Reset the center count
      // setFilteredRecyclingCenters(recyclingCenters);
      setRecyclingCenters(filteredRecyclingCenters);
    } else {
   
        // Create an array to store the filtered recycling centers
        const filteredCenters = [];
        //const count = 0;
      //check on each center if is receive this waste type 
        recyclingCenters.forEach((center) => {
          center.type.forEach((centerType) => {
          if (centerType === type) {
            // If the center's type matches the selected type, add it to the filteredCenters array
            filteredCenters.push(center);
             // Set the center count

          }
       
        });
      });
      // setFilteredRecyclingCenters(filteredCenters);
      setRecyclingCenters(filteredCenters);
      const count = filteredCenters.length;
      setCenterCount(count);


    }
  };
  
  
  //handle filter centers by waste type
  const handleCenterTypeSelect = (selectedOption) => {
    setSelectedCenterType(selectedOption.value);
    filterRecyclingCenters(selectedOption.value);
    handleAlertshowNumberWasteType();

  };

  // return the center the have the same name
  const filterRecyclingCentersBySearch = (query) => {
   
const filteredCenters = [];

  recyclingCenters.forEach((center) => {
    if (
      center.name &&
      center.name.includes(query)
    ) {
      filteredCenters.push(center);
    }
  });
  if(filteredCenters.length>0) {
    // setFilteredRecyclingCenters(filteredCenters);
    setRecyclingCenters(filteredCenters);
  }
  else{
    // setFilteredRecyclingCenters(recyclingCenters);
    setRecyclingCenters(filteredRecyclingCenters);
  }
  };

  // handle serach center name input
  const handleSearchInputChange = async(CenterName) => {
    if(CenterName) {
      const query = CenterName.target.value;//center name writed by user
      setSearchQuery(query);
      filterRecyclingCentersBySearch(query);
    }
    else{
        // setFilteredRecyclingCenters(recyclingCenters); // return all center 
        setRecyclingCenters(filteredRecyclingCenters);
    }
   

  }
  
  
  return isLoaded ? (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>

    <div className="flex gap-5 p-4 mr-12" style={{ position: 'absolute', zIndex: 1000 }}>
      <Tooltip
        className="bg-white font-baloo text-md text-gray-600"
        content=" لإضافة موقع مركز تدوير جديد قم بالضغط على الموقع المحدد والالتزام بحدود المباني"
        placement="bottom"
      >
        <Button style={{ background: "#97B980", color: '#ffffff' }} size='sm'>
          <span>تعليمات إضافة مركز</span>
        </Button>
      </Tooltip>
  
      <Tooltip
        className="bg-white font-baloo text-md text-gray-600"
        content=" لإزالة موقع مركز تدوير قم بالضغط على موقع المركز"
        placement="bottom"
      >
        <Button style={{ background: "#FE5500", color: '#ffffff' }} size='sm'>
          <span>تعليمات إزالة مركز</span>
        </Button>
      </Tooltip>
  
      <Button
        style={{ background: '#FE9B00', color: '#ffffff' }}
        size="sm"
        onClick={handleUserLocation}
      >
        <span>عرض الموقع الحالي</span>
      </Button>

<div>
<Select
  placeholder="تصفية حسب نوع النفايات المستقبلة..."
  closeMenuOnSelect={false}
  components={animatedComponents}
  options={options}
  value={selectedCenterType !== '' ? options.find((option) => option.value === selectedCenterType) : null}
  onChange={(value) => handleCenterTypeSelect(value)}
  required
/>
</div>
    

<div>
<Input
          type="text"
          label="البحث عن اسم المركز"
          value={searchQuery}
          onChange={handleSearchInputChange} 
          style={{ background: 'white', color: 'black'}}
        />
</div>


    </div>
    
      {/* to show how many center recivce the selected waste type */}
{selectedCenterType && centerCount > 0 && (
  <div style={{ position: 'absolute', zIndex: 2000 }}>
        <AlertMessageCenter open={showCenterWasteType} handler={handleAlertshowNumberWasteType} message="عدد المراكز التي تستقبل" type={selectedCenterType} data={centerCount}/>
      </div>
)}


  
    <div style={{ position: 'absolute', zIndex: 3000 }}>
      <ErrorAlertMessage open={showAlertZoom} handler={handleAlertZoom} message="كبر الخريطة لتتمكن من إضافة مركز تدوير " />
    </div>
  
    <div style={{ position: 'absolute', zIndex: 3000 }}>
      <ErrorAlertMessage open={showAlertBuilding} handler={handleAlertBuilding} message="  التزم بحدود المباني عند إضافة مركز التدوير" />
    </div>
  
    <div style={{ position: 'absolute', zIndex: 2000 }}>
        <AlertMessage open={showAlertLocation} handler={handleAlertLocation} message="انت الان في وضع تغيير موقع المركز" />
      </div>

    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userPosition || center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={onMapClick}
      ref={mapRef}
    >

        {recyclingCenters.map((recycleCenter) => (
          <Marker
            key={recycleCenter.id}
            position={{ lat: recycleCenter.location._lat, lng: recycleCenter.location._long }} 
            onClick={() => handleMarkerClick(recycleCenter)}
            icon={{
              url: centerId === recycleCenter.id ?  '/recyclingcenterChange.png' : '/recyclingcenter.png',
              scaledSize: new window.google.maps.Size(45, 45),
            }}
          >    

          </Marker>
        ))}


{showUserLocation && userPosition && (
      <Marker position={userPosition} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#4285F4', fillOpacity: 0.8, strokeColor: '#4285F4' }}>
        <Circle center={userLocationRange} options={{ radius: userLocationRange.radius, strokeColor: '#4285F4', fillColor: '#4285F4', fillOpacity: 0.2 }} />
      </Marker>
    )}
    <ViewCenterInfo open={viewInfo} onClose={closeInfoDrawer} DeleteMethod={handleDeletion} Changelocation={handleChangeMarkerLocation} center={centerData} centerID={centerId} />
    <RecyclingCenterForm open={formVisible} handler={handleForm} method={handleAddRecyclingCenter} />
    <Success open={showSuccessAlert} handler={handleSuccessAlert} message=" تم إضافة مركز التدوير بنجاح" />
    <Success open={showAlertSuccessDeletion} handler={handleAlertSuccessDeletion} message=" تم حذف مركز التدوير بنجاح" />
    <Success open={showAlertSuccessLocation} handler={handleAlertSuccessLocation} message=" تم تغيير موقع مركز التدوير بنجاح" />
    <Confirm open={checkMessageVisible} handler={handleCheckMessage} method={()=>{ handleOnMapClick(newRecyclingCenterLocation.lat,newRecyclingCenterLocation.lng); setCheckMessageVisible(false);}} message="هل انت متأكد من أن الموقع المحدد يقع على مبنى؟" />
   
  </GoogleMap>
</div>
  ) : <></>
}

export default React.memo(RecyclingCentersMap)