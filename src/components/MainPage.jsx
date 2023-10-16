import { useState , useEffect} from 'react';
import {  Route, Routes , useNavigate } from 'react-router-dom';
import { db, auth,  }  from "/src/firebase";
import { collection, query, where ,getDocs} from "firebase/firestore";
import Home from './Home';
import Sidebar from './Sidebar';
import GarbageBinMap from "./maps/GarbageBinMap"
import RecyclingCenterMap from "./maps/RecyclingCentersMap"
import Complaints from './Complaints';
import Heatmap from './Heatmap';
import ManageStaff from './ManageStaff';
import Footer from "./Footer"


function MainPage() {

    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeItem, setActiveItem] = useState(false);
    const [userData, setUserData] = useState([]);
    
    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged(async (user) => {
    //       if (user) {
    //         // User is signed in, fetch user profile data from Firestore
    //          const userRef = doc(db, 'staff', user.uid);
            
    //          try {
    //             const docSnapshot = await getDoc(userRef);
    //             if (docSnapshot.exists()) {
    //                 setUserData(docSnapshot.data());
                  
    //             } else {
    //             // Handle the case where user data is not found
    //           }
    //         }catch (error) {
    //             console.error('Error fetching user data:', error);
    //           }
    //       } else {
    //         // User is not signed in, redirect to the login page
    //         navigate('/');
    //       }
    //     });
    
    //     return unsubscribe;
    //   }, [navigate]);

    useEffect(() => {
   
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        


        //    // Check if the user is already signed in and if their data has been loaded
        // if (userData && user.uid === userData.uid) {
        //   return;
        // }

          // User is signed in, fetch user profile data from Firestore
          const userRef = collection(db, 'staff');
          const q = query(userRef, where('uid', '==', user.uid));
    
          try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              // Assuming there's only one user with a matching UID
              const docSnapshot = querySnapshot.docs[0];
              setUserData(docSnapshot.data());

            } else {
              // Handle the case where no user data is found
              console.log("emptyyy query" , userData.isAdmin);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else {
          // User is not signed in, redirect to the login page
          navigate('/');
        }
      });
      return unsubscribe;
    }, [navigate]);
    

    

    
      return (
        <>
       



          <div className="app-container">
            <Sidebar authorized={userData.isAdmin} showSidebar={showSidebar} setShowSidebar={setShowSidebar} activeItem={activeItem} setActiveItem={setActiveItem}/>
            <div className="content-container">
              <Routes>
              <Route path="/" element={<Home  authorized={userData.isAdmin} userData={userData} showSidebar={showSidebar} setShowSidebar={setShowSidebar} setActiveItem={setActiveItem}/>} />
               {showSidebar && (
                  <> 
                    <Route path="/garbage"  element={<div className='map h-[calc(105vh-2rem)]'> <GarbageBinMap/> </div>} />
                    <Route path="/recycle" element={<div className='map h-[calc(105vh-2rem)]'><RecyclingCenterMap /></div>} />
                    <Route path="/complaints" element={<Complaints />} />
                    <Route path="/heatmap" element={<Heatmap />} />
                    {userData.isAdmin && <Route path="/manage" element={<ManageStaff />} />}
                  </>
                )}
              </Routes>
            </div>
          </div>

          <Footer />
          

        </>

      );

        }

export default MainPage
