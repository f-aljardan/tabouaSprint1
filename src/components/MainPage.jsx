import { useState , useEffect} from 'react';
import {  Route, Routes , useNavigate } from 'react-router-dom';
import { db, auth }  from "/src/firebase";
import { doc, getDoc } from 'firebase/firestore';
import Sidebar from './Sidebar';
import Home from './Home'; 
import GarbageBins from './GarbageBins'; 
import RecyclingCenters from './RecyclingCenters'; 
import Complaints from './Complaints';
import Heatmap from './Heatmap';
import ManageStaff from './ManageStaff';
import Footer from "./Footer"

function MainPage() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            // User is signed in, fetch user profile data from Firestore
             const userRef = doc(db, 'users', user.uid);
             
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

       <Sidebar authorized={isAdmin}/>
      
        <div className="content-container"> 
          <Routes>
         
            <Route path='' exact element={<Home/>} />
            <Route path="garbage" element={<GarbageBins/>} />
            <Route path="recycle" element={<RecyclingCenters/>} />
            <Route path="complaints" element={<Complaints/>} /> 
            <Route path="heatmap" element={<Heatmap/>} />
            {isAdmin && <Route path="manage" element={<ManageStaff/>} /> }
           
          </Routes>

        </div>

      </div> 
      <Footer/>
  
  </>

  )
}

export default MainPage
