import { useState , useEffect} from 'react';
import {  Route, Routes , useNavigate } from 'react-router-dom';
import { db, auth }  from "/src/firebase";
import { doc, getDoc } from 'firebase/firestore';
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
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            // User is signed in, fetch user profile data from Firestore
             const userRef = doc(db, 'staff', user.uid);
            
             try {
                const docSnapshot = await getDoc(userRef);
                if (docSnapshot.exists()) {
                    setUserData(docSnapshot.data());
                  
                } else {
                // Handle the case where user data is not found
              }
            }catch (error) {
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
