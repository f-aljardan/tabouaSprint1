import { useEffect, useState } from "react";
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc} from "firebase/firestore"; // Import the necessary Firestore functions
import Map from "./maps/RecyclingCentersMap"
import RecyclingCenterForm from "./forms/RecyclingCenterForm"
import Success from "./messages/Success"
import Confirm from "./messages/Confirm"




export default function RecyclingCenters(){
    // const [recyclingCenters, setRecyclingCenters] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [formVisible, setFormVisible] = useState(false); // To control confirmation message visibility
    // const [newRecyclingCenterLocation, setNewRecyclingCenterLocation] = useState(null);
    // const [showAlert, setShowAlert] = useState(false);

    // const handlealert = () => setShowAlert(!showAlert);
    // const handleForm = () => setFormVisible(!formVisible);


    // useEffect(() => {
    
    //     // Function to fetch recycling centers from Firestore
    //    const fetchRecyclingCenters = async () => {
    //      try {
    //        const querySnapshot = await getDocs(collection(db, "recyclingCenters"));
    //        const centersData = [];
    //        querySnapshot.forEach((doc) => {
    //          const data = doc.data();
    //          const location = data.location || {};
    //          centersData.push({ id: doc.id, location });
    //        });
    //        setRecyclingCenters(centersData);
    //        setLoading(false);
    //      } catch (error) {
    //        console.error("Error fetching recycling centers:", error);
    //      }
    //    };
    //      fetchRecyclingCenters();
    //    }, []);
  

//     const handleMapClick = (event) => {
//         // Capture the coordinates and display a confirmation message
//         const lat = event.latLng.lat();
//         const lng = event.latLng.lng();
//         console.log("Clicked Coordinates:", lat, lng)
//         // Store the new garbage bin location temporarily
//         setNewRecyclingCenterLocation({ lat, lng });
//         setFormVisible(true);
//     };

//     //  code for adding a new recycling center
// const handleAddRecyclingCenter = async (data) => {
//     try {
//         const docRef = await addDoc(collection(db, "recyclingCenters"), {
//             name: data.name,
//             description: data.description,
//             type: data.types,
//             location: new GeoPoint(newRecyclingCenterLocation.lat, newRecyclingCenterLocation.lng),
//         });
//         setRecyclingCenters([...recyclingCenters, {  
//             id: docRef.id ,
//             name: data.name,
//             description: data.description,
//             type: data.types,
//             location: new GeoPoint(newRecyclingCenterLocation.lat, newRecyclingCenterLocation.lng), }]);
//         // Show success message here
//         setShowAlert(true); 
//       // After successfully adding the recycling center, fetch the centers again
     
//     } catch (error) {
//         console.error("Error adding recycling center:", error);
//     }
// };


// if (loading) {
//     return <div>Loading...</div>;
// }

    return(
        <>
        
        <div className='map'> 
        <Map/>
        </div>
       
        {/* <Map RecyclingCenters={recyclingCenters} onMapClick={handleMapClick} />
        */}
{/*      
        <RecyclingCenterForm open={formVisible} handler={handleForm} method={handleAddRecyclingCenter} />
        <Success open={showAlert} handler={handlealert} message=" !تم إضافة مركز التدوير بنجاح" />
         */}
        </>
    )
}