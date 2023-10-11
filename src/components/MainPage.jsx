import { useState , useEffect} from 'react';
import {  Route, Routes , useNavigate } from 'react-router-dom';
import { db, auth }  from "/src/firebase";
import { doc, getDoc } from 'firebase/firestore';
import Home from './Home';
import Sidebar from './Sidebar';
import GarbageBins from './GarbageBins'; 
import RecyclingCenters from './RecyclingCenters'; 
import Complaints from './Complaints';
import Heatmap from './Heatmap';
import ManageStaff from './ManageStaff';
import Footer from "./Footer"

function MainPage() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            // User is signed in, fetch user profile data from Firestore
             const userRef = doc(db, 'staff', user.uid);
            
             try {
                const docSnapshot = await getDoc(userRef);
                if (docSnapshot.exists()) {
                  const userData = docSnapshot.data();
                  console.log(userData.isAdmin);

                  setIsAdmin(userData.isAdmin);
                } else {
                // Handle the case where user data is not found
              }
            }catch (error) {
                console.error('Error fetching user data:', error);
              }
          } else {
            // User is not signed in, redirect to the login page
            navigate('/login');
          }
        });
    
        return unsubscribe;
      }, [navigate]);

    
      return (
        <>
          <div className="app-container">
            <Sidebar authorized={isAdmin} showSidebar={showSidebar} setShowSidebar={setShowSidebar} activeItem={activeItem} setActiveItem={setActiveItem}/>
            <div className="content-container">
              <Routes>
              <Route path="/" element={<Home showSidebar={showSidebar} setShowSidebar={setShowSidebar} setActiveItem={setActiveItem}/>} />
               {showSidebar && (
                  <>
                    <Route path="/garbage"  element={<GarbageBins/>} />
                    <Route path="/recycle" element={<RecyclingCenters />} />
                    <Route path="/complaints" element={<Complaints />} />
                    <Route path="/heatmap" element={<Heatmap />} />
                    {isAdmin && <Route path="/manage" element={<ManageStaff />} />}
                  </>
                )}
              </Routes>
            </div>
          </div>
          <Footer />
          
               {/* <Routes>
         
            <Route path='' exact element={<Home/>} />
            <Route path="garbage" element={<GarbageBins/>} />
            <Route path="recycle" element={<RecyclingCenters/>} />
            <Route path="complaints" element={<Complaints/>} /> 
            <Route path="heatmap" element={<Heatmap/>} />
            {isAdmin && <Route path="manage" element={<ManageStaff/>} /> }
           
          </Routes> */}
        </>

      );

        }

export default MainPage
