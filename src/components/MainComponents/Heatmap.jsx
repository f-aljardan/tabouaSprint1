import React , {useState, useEffect, useRef} from 'react'
import { GoogleMap, useJsApiLoader, Marker , Circle,  } from '@react-google-maps/api';
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc ,getDoc, Timestamp,updateDoc } from "firebase/firestore"; 
import { Button , Tooltip} from "@material-tailwind/react";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();


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
  



export default function Heatmap(){
    const [map, setMap] = React.useState(null)
    
 // all google map initilization related function starts here
  // Load Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk"
  })


// Callback function when the map loads
  const onLoad = React.useCallback(function callback(map) {
   
    
  }, []);


  // Callback function when the component unmounts
  const onUnmount = React.useCallback(function callback(map) {
   
    setMap(null)
  }, [])


 // all google map initilization related function ends here




    return(
        <>
        Heatmap
        </>
    )
}