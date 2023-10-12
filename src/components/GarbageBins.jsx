import { useEffect, useState } from "react";
import { db } from "/src/firebase";
import { getDocs, collection, addDoc, GeoPoint, deleteDoc, doc} from "firebase/firestore"; // Import the necessary Firestore functions
import Map from "./maps/GarbageBinMap"
import Success from "./messages/Success"
import Confirm from "./messages/Confirm"
import { Button , Tooltip} from "@material-tailwind/react";


 
  
export default  function GarbageBins() {

  //   const [garbageBins, setGarbageBins] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   const [confirmationVisible, setConfirmationVisible] = useState(false); // To control confirmation message visibility
  //   const [newGarbageBinLocation, setNewGarbageBinLocation] = useState(null);
  //   const [showAlert, setShowAlert] = useState(false);
  //   const [showAlertDeletion, setShowAlertDeletion] = useState(false);
   
    
  //   const handleConfirm = () => setConfirmationVisible(!confirmationVisible);
  //   const handlealert = () => setShowAlert(!showAlert);
  //   const handlealertDeletion = () => setShowAlertDeletion(!showAlertDeletion);

  //   useEffect( ()=>{
  //       const fetchGarbageBins = async () => {
  //       try {
  //       const querySnapshot = await getDocs(collection(db, "garbageBins"));
  //       const binsData = [];
  //       querySnapshot.forEach((doc) => {
  //           const data = doc.data();
  //           const location = data.location || {}; // Ensure location is an object
  //           binsData.push({ id: doc.id, location }); // Include the location field
  //                });

  //       setGarbageBins(binsData);
  //       setLoading(false);
  //   } catch (error) {
  //       console.error("Error fetching garbage bins:", error);
  //   }
  //                                          };//fetchGarbageBins
  // fetchGarbageBins();



  //  },[])
   



//    const handleMapClick = (event) => {
//     // Capture the coordinates and display a confirmation message
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
//     console.log("Clicked Coordinates:", lat, lng)
//     // Store the new garbage bin location temporarily
//     setNewGarbageBinLocation({ lat, lng });

//     // You can show a modal or a confirmation dialog here
//     setConfirmationVisible(true);  
// };

// const saveCoordinatesToFirestore = async () => {
//     try {
//       const geoPoint = new GeoPoint(
//         newGarbageBinLocation.lat,
//         newGarbageBinLocation.lng
//       );
//       console.log("GeoPoint:", geoPoint); // Log the GeoPoint before saving

//       const docRef = await addDoc(collection(db, "garbageBins"), {
//         location: geoPoint,
//       });

//       console.log("Document added with ID:", docRef.id); // Log the document ID

//       setGarbageBins([...garbageBins, { id: docRef.id, location: geoPoint }]);
//       setConfirmationVisible(false);
//       setShowAlert(true);

      
//     } catch (error) {
//       console.error("Error saving garbage bin coordinates:", error);
//     }
//   };

  // const onDeleteGarbageBin = async (garbageBinId) => {
  //   try {
  //     // Construct a reference to the garbage bin document to be deleted
  //     const garbageBinRef = doc(db, "garbageBins", garbageBinId);

  //     // Delete the garbage bin document from Firestore
  //     await deleteDoc(garbageBinRef);

  //     // Update the state to remove the deleted garbage bin
  //     setGarbageBins((prevGarbageBins) =>
  //       prevGarbageBins.filter((bin) => bin.id !== garbageBinId)
  //     );
  //      setShowAlertDeletion(true);
  //     // Display a success message
      
  //   } catch (error) {
  //     console.error("Error deleting garbage bin:", error);
  //     alert("An error occurred while deleting the garbage bin.");
  //   }
  // };



            //   if (loading) {
            //     return <div>Loading...</div>;
            // }
        
            return (
                <>
               {/* <div className="flex gap-5 direction-coulmn justify-center">
               <Tooltip className="font-baloo text-md text-gray-600 " content="* لإضافة موقع حاوية جديدة قم بالضغط على الموقع المحدد" placement="bottom">
                 <Button>إضافة</Button>
                 </Tooltip>
                 <Tooltip className="font-baloo text-md text-gray-600 " content="* لإزالة موقع حاوية قم بالضغط على موقع الحاوية" placement="bottom">
                 <Button>إزالة</Button>
                 </Tooltip>
                 </div> */}
              
                   

                    <div className='map'>
                    <Map  />
                    </div>
                    {/* <Map  garbageBins={garbageBins} onMapClick={handleMapClick} onDeleteGarbageBin={onDeleteGarbageBin}/>
                   */}
                     {/* <Success open={showAlert} handler={handlealert} message=" !تم إضافة حاوية القمامة بنجاح" />
                     <Success open={showAlertDeletion} handler={handlealertDeletion} message=" !تم حذف حاوية القمامة بنجاح" />
                     <Confirm  open={confirmationVisible} handler={handleConfirm} method={saveCoordinatesToFirestore} message="   هل انت متأكد من إضافة حاوية نفاية بالموقع المحدد؟"/>
                      */}
               

                </>
            );
        
}