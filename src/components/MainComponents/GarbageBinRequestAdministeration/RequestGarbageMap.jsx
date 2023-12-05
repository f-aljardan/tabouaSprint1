import React , {useState, useEffect, useRef} from 'react'
import { GoogleMap, useJsApiLoader, Marker , InfoWindow, Circle  } from '@react-google-maps/api';
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, doc , Timestamp,updateDoc } from "firebase/firestore"; // Import the necessary Firestore functions
import { Button , Typography} from "@material-tailwind/react";
import Success from "../../utilityComponents/messages/Success"
import Confirm from "../../utilityComponents/messages/Confirm"
import GarbageBinForm from "../../utilityComponents/forms/GarbageBinForm"
import ErrorAlertMessage from "../../utilityComponents/messages/ErrorAlertMessage"
import MessageDialog from "../../utilityComponents/messages/MessageDialog" ;
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

// Define constants for the Google Map
const containerStyle = {
    width: '600px', 
    height: '50vh', 
  };
  
  // Set the initial center
  const center = {
    lat: 24.7136,
    lng: 46.6753
  };
 
  // Define the available options for waste types
   const options = [
     { value: 'قبول', label: 'قبول' },
     { value: 'رفض', label: 'رفض' },
     
   ];

  export default function RequestGarbageMap({request}) {

    const [map, setMap] = useState(null)
    const [zoom, setZoom] = useState(10); // set the initial zoom level
    const [garbageBins, setGarbageBins] = useState([]);
    const [formVisible, setFormVisible] = useState(false);// To control confirmation message visibility
    const [newGarbageBinLocation, setNewGarbageBinLocation] = useState(null);
    const [showAlertStreet, setShowAlertStreet] = useState(false);
    const [showAlertZoom, setShowAlertZoom] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [ checkMessageVisible, setCheckMessageVisible] = useState(false);
    const [draggedLocation, setDraggedLocation] = useState(null);
    const animatedComponents = makeAnimated();
    const [selectedOption, setSelectedOption] = useState(null);
    const[acceptMessageVisible, setAcceptMessageVisible] = useState(false); 
    const[ rejectMessageVisible, setRejectMessageVisible] = useState(false); 
    const[ showAlertSuccessReject, setAlertSuccessReject] = useState(false);
    const [address, setAddress] = useState('');
    const [openInfoWindowId, setOpenInfoWindowId] = useState(null);
   

 const handleForm = () => setFormVisible(!formVisible);
 const handleAlertStreet = () => setShowAlertStreet(!showAlertStreet);
 const handleAlertZoom = () => setShowAlertZoom(!showAlertZoom);
 const handleSuccessAlert = () => setShowSuccessAlert(!showSuccessAlert);
 const handleAlertSuccessReject = () => setAlertSuccessReject(!showAlertSuccessReject);
 const handleCheckMessage= () => { 
       handleAlertStreet(); 
       setCheckMessageVisible(!checkMessageVisible); 
      }
  const handleRejectMessage= () => {setRejectMessageVisible(!rejectMessageVisible);}
  const handleAcceptMessage= () => {setAcceptMessageVisible(!acceptMessageVisible);}
  


  // all google map initilazation functions start here 
  // Load Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk"
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

// all google map initilazation functions ends here 






  // Load the garbage bin data from Firestore that only are near the requested garbage bin location request.location as geopoints
  useEffect(() => {

    if (request) {
        
      const fetchGarbageBins = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "garbageBins"));
          const binsData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const location = data.location || {};
            const distance = calculateDistance(
              request.location._lat,
              request.location._long,
              location._lat,
              location._long
            );
  
            if (distance <= 100) {
              binsData.push({ id: doc.id, location, size: data.size });
            }
          });
  
          setGarbageBins(binsData);
        } catch (error) {
          console.error('Error fetching garbage bins:', error);
        }
      };

      setZoom(20);
      center.lat = request.location._lat;
      center.lng = request.location._long;

      if(isLoaded)
      fetchAddress(request.location._lat, request.location._long);

      fetchGarbageBins();
    }
  }, [request, isLoaded]);
  


// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula
  const R = 6371e3; //R is earth’s radius in meters (mean radius = 6,371km);
  //φ is latitude, λ is longitude
  //angles need to be in radians to pass to trig functions(φ, λ in radians)
  const φ1 = (lat1 * Math.PI) / 180; 
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;// in metres
  return distance;
};


  // Function to fetch the readable address from the provided lat,lng
  const fetchAddress = async (lat, lng) => {
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(lat, lng);
  
      const geocodeRequest = {
        location: latLng,
        language: 'ar' 
      };
  
      geocoder.geocode(geocodeRequest, (results, status) => {
        if (status === 'OK') {
          const addressComponents = results[0]?.address_components;
         
          if (addressComponents) {
            const route = addressComponents.find(component => component.types.includes('route'))?.long_name || '';
            const political = addressComponents.find(component => component.types.includes('political'))?.long_name || '';
            const postalCode = addressComponents.find(component => component.types.includes('postal_code'))?.long_name || '';
  
            const formattedAddress = {
              route: route,
              political: political,
              postalCode: postalCode
            };
  
            setAddress(formattedAddress);
          }
        } else {
          console.error('Error fetching address:', status);
        }
      });
    }
  };
  

// function to check the condtion and act after that
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



const handleOnMapClick =() =>{
     setFormVisible(true); 
  }


  const handleMarkerClick = (binId) => {
    setOpenInfoWindowId(binId === openInfoWindowId ? null : binId);
  };


// function to handle the accept request
  const handleAcceptRequest = async (message) => {
    // Update the request status based on the selected option
    const requestRef = doc(db, 'requestedGarbageBin', request.id);
  
    // Create an object with the fields that are always updated
    const updateFields = {
      status: "تم التنفيذ",
      responseDate: Timestamp.fromDate(new Date()),
    };
  
    // Include staffComment if message is provided
    if (message) {
      updateFields.staffComment = message;
    }
  
    await updateDoc(requestRef, updateFields);
  
    // Update the requested location if a new location is selected
    if (draggedLocation) {
      await updateDoc(requestRef, {
        location: new GeoPoint(draggedLocation.lat, draggedLocation.lng),
      });
    }
    setShowSuccessAlert(true);
  };
  


// function to handle the reject request
  const handleRejectRequest = async (message) => {

    // Update the request status based on the selected option
    const requestRef = doc(db, 'requestedGarbageBin', request.id);
    await updateDoc(requestRef, {
      status:"مرفوض",
      responseDate: Timestamp.fromDate(new Date()),
      staffComment:message,
    });
    setAlertSuccessReject(true);
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
      setAcceptMessageVisible(true);
   
    } catch (error) {
      console.error("Error saving garbage bin coordinates:", error);
    }
  };

  // Function to generate a unique serial number for the bin
function generateSerialNumber() {
    return uuidv4();// Generates a random UUID
  }



 
  const handleSubmittingRequestProcess = async () => {
    if (selectedOption && selectedOption.value === 'قبول') {
     
          // Check if the conditions are met
  checkLocationCondtion(draggedLocation ? draggedLocation.lat : request.location._lat , draggedLocation ? draggedLocation.lng : request.location._long);

    }else if (selectedOption && selectedOption.value === 'رفض') {
        setRejectMessageVisible(true);
    } else {
        console.log("no choosed action")
    }
    };
  


    const handleDragEnd = (e) => {
      const newLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };


      const distance = calculateDistance(
        newLocation.lat,
        newLocation.lng,
        request.location._lat,
        request.location._long
      );
    
      if (distance <= 50) {
        setDraggedLocation(newLocation);
        fetchAddress(newLocation.lat, newLocation.lng);
      } else {
        // Reset the dragged location if it's outside the range
        const requestLocation={
          lat:  request.location._lat,
          lng:   request.location._long,
        }
        setDraggedLocation(requestLocation);
       
        console.log('Marker dragged outside the allowed range.');
      }
    };


  return isLoaded  ? ( 
    <div className='flex flex-col gap-5'> 
    

<div className='flex items-center justify-around'>
{request && request.status == 'قيد التنفيذ' && (
<Typography className="font-baloo text-right text-md font-bold"><span>قم بتحديد الإجراء:</span></Typography>
)}
        {/* Display dropdown menu if the request status is not 'جديد' */}
   {request && request.status == 'قيد التنفيذ' && (
                        <div className="w-64">
                            <Select
                                options={options}
                                isSearchable={false}
                                components={animatedComponents}
                                placeholder="اختر الإجراء"
                                onChange={(selectedOption) => {
                                   setSelectedOption(selectedOption);
                                }}
                            />
                        </div>
                    )}

                    {request && request.status === 'قيد التنفيذ' && (   
          <Button
          size="sm"
          variant="gradient"
          style={{ background: '#97B980', color: '#ffffff' }}
            onClick={()=>handleSubmittingRequestProcess()}
            className="text-md"
          >
            <span>تنفيذ</span>
          </Button>
        )}
        </div>


<div style={{ position: 'relative',}}>
         

  
        
        <div style={{ position: 'absolute', zIndex: 3000 }}>
          <ErrorAlertMessage open={showAlertZoom} handler={handleAlertZoom} message="كبر الخريطة لتتمكن من إضافة حاوية القمامة " />
        </div>

        <GoogleMap
         mapContainerStyle={containerStyle}
         center={center}
         zoom={zoom}
         onLoad={onLoad}
         onUnmount={onUnmount}
         ref={mapRef}
        >
  
          {garbageBins.map((bin) => (
            <Marker
            key={bin.id}
            position={{ lat: bin.location._lat, lng: bin.location._long }}
            icon={{
              url: '/trash.png',
              scaledSize: new window.google.maps.Size(45, 45),
            }}
            onClick={() => handleMarkerClick(bin.id)}
          >  

          {openInfoWindowId === bin.id && (
             <InfoWindow
          position={{ lat: bin.location._lat, lng: bin.location._long }}
         
          onCloseClick={() => setOpenInfoWindowId(null)}
          >
             
            <div className="flex flex-col items-center  pr-5">
              {bin.size}
            </div>
                </InfoWindow>   
                )}     

          </Marker>
         
          ))}
      
    
  
          
 
      {request && (
        <>
        <Marker
          position={{
            lat: draggedLocation ? draggedLocation.lat : request.location._lat,
            lng: draggedLocation ? draggedLocation.lng : request.location._long,
          }}
          zIndex={1000}
          draggable={ request.status == 'قيد التنفيذ' ? true : false}
          // onDragEnd={(e) => {
          //   const newLocation = {
          //     lat: e.latLng.lat(),
          //     lng: e.latLng.lng(),
          //   };
          //   setDraggedLocation(newLocation);
          //   fetchAddress(newLocation.lat, newLocation.lng);
          // }}
          onDragEnd={handleDragEnd}
          
        >
          <InfoWindow
            position={{
              lat: draggedLocation ? draggedLocation.lat : request.location._lat,
              lng: draggedLocation ? draggedLocation.lng : request.location._long,
            }}
            options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
          >
            <div className="flex flex-col items-center gap-3 pr-5">
          
                <span> {address.political}, {address.route}, {address.postalCode}</span>
            
            </div>
          </InfoWindow>
        </Marker>

       {request.status == 'قيد التنفيذ' && (    <Circle
              center={{
                lat: request.location._lat,
                lng: request.location._long,
              }}
              radius={50}
              options={{
                strokeColor: '#97B980',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#97B980',
                fillOpacity: 0.35,
              }}
            /> )}

</>
      )}
  
  
        <GarbageBinForm open={formVisible} handler={handleForm} AddMethod={AddGarbageBin} />
        <Success open={showSuccessAlert} handler={handleSuccessAlert} message=" تم إضافة حاوية القمامة بنجاح" />
        <Success open={showAlertSuccessReject} handler={handleAlertSuccessReject} message=" تم الرفض بنجاح" />
        <Confirm open={checkMessageVisible} handler={handleCheckMessage} method={()=>{ handleOnMapClick(); setCheckMessageVisible(false);}} message="هل انت متأكد من أن الموقع المحدد يقع على شارع؟" />  
        <MessageDialog open={acceptMessageVisible} handler={handleAcceptMessage} method={handleAcceptRequest} status="accept" />
        <MessageDialog open={rejectMessageVisible} handler={handleRejectMessage} method={handleRejectRequest}  status="reject" />
        
        
        </GoogleMap>
        {request && request.status == 'قيد التنفيذ' && ( 
        <div className=" z-10 " style={{ position: 'absolute' ,}}>
    <Typography variant="small"><span>لتعديل موقع الحاوية قم بسحب المؤشر الى الموقع المحدد والالتزام بحدود الطرق ومدار الموقع</span></Typography>
         </div> 
        )}


</div> 

      </div>
    ) : <></>
  }
  
