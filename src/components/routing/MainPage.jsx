import { useState , useEffect} from 'react';
import {  Route, Routes , useNavigate } from 'react-router-dom';
import { db, auth,  }  from "/src/firebase";
import { collection, query, where ,getDocs} from "firebase/firestore";
import Home from '../MainComponents/Home';
import Sidebar from '../utilityComponents/Sidebar';
import GarbageBinMap from "../MainComponents/GarbageBinAdministeration"
import GarbageBinRequests from "../MainComponents/GarbageBinRequestAdministeration/GarbageBinRequests"
import GarbageBinRequestDetails from "../MainComponents/GarbageBinRequestAdministeration/GarbageBinRequestDetails"
import RecyclingCenterMap from "../MainComponents/RecyclingCenterAdministeration"
import Complaints from '../MainComponents/ComplaintsAdministration/Complaints';
import ComplaintDetails from '../MainComponents/ComplaintsAdministration/ComplaintDetails';
import Heatmap from '../MainComponents/Heatmap';
import ManageStaff from "../MainComponents/ManageStaff"
import Footer from "../utilityComponents/Footer"


function MainPage() {

    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false); //state to show sidebars
    const [activeItem, setActiveItem] = useState(false); // state to handle active bar
    const [userData, setUserData] = useState([]); // to store user data
    
    

    useEffect(() => {
   
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        
          // User is signed in, fetch user profile data from database
          const userRef = collection(db, 'staff');
          const q = query(userRef, where('uid', '==', user.uid));
    
          try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const docSnapshot = querySnapshot.docs[0];
              setUserData(docSnapshot.data());

            }  
            
            
            else {
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
    
    const [typeFilter, setTypeFilter] = useState(""); 
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState('');
    const [neighborhoodFilter, setNeighborhoodFilter] = useState('');
    const [directRoute, setDirectRoute] = useState(false);

    // to route to other page
      return (
        <>
       
 <div className="app-container">
  <Sidebar
    authorized={userData.isAdmin}
    showSidebar={showSidebar}
    setShowSidebar={setShowSidebar}
    activeItem={activeItem}
    setActiveItem={setActiveItem}

  />
  <div className="content-container">
    <Routes>
      <Route path="/" element={<Home authorized={userData.isAdmin} userData={userData} showSidebar={showSidebar} setShowSidebar={setShowSidebar} setActiveItem={setActiveItem} />} />
      {showSidebar && (
        <>
          <Route path="/garbage" element={<div className='map h-[calc(122vh-2rem)]'><GarbageBinMap /></div>} />
          <Route path="/garbagebinrequests" element={<GarbageBinRequests />} />
          <Route path="/garbagebinrequests/:id" element={<GarbageBinRequestDetails />} />
          <Route path="/recycle" element={<div className='map h-[calc(122vh-2rem)]'><RecyclingCenterMap /></div>} />
          <Route path="/complaints" element={<Complaints directRoute={directRoute} setDirectRoute={setDirectRoute} typeFilter={typeFilter} setTypeFilter={setTypeFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} dateFilter={dateFilter} setDateFilter={setDateFilter} neighborhoodFilter={neighborhoodFilter} setNeighborhoodFilter={setNeighborhoodFilter} />} />
          <Route path="/complaints/:id" element={<ComplaintDetails directRoute={directRoute} setDirectRoute={setDirectRoute}/>} />
          <Route path="/heatmap" element={<div className='map h-[calc(122vh-2rem)]'><Heatmap setDirectRoute={setDirectRoute} setTypeFilter={setTypeFilter} setStatusFilter={setStatusFilter} setDateFilter={setDateFilter}  setNeighborhoodFilter={setNeighborhoodFilter}/></div>} />
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
