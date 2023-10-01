
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Sidebar from './components/Sidebar';
import Home from './components/Home'; 
import GarbageBins from './components/GarbageBins'; 
import RecyclingCenters from './components/RecyclingCenters'; 
import Complaints from './components/Complaints';
import Heatmap from './components/Heatmap';
import ManageStaff from './components/ManageStaff';
function App() {

  return (
    <>
       <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <Routes>
          
            <Route path="/" exact element={<Home/>} />
            <Route path="/garbage" element={<GarbageBins/>} />
            <Route path="/recycle" element={<RecyclingCenters/>} />
            <Route path="/complaints" element={<Complaints/>} /> 
            <Route path="/heatmap" element={<Heatmap/>} />
            <Route path="/manage" element={<ManageStaff/>} />
          </Routes>
        </div>
      </div>
    </Router>
  </>

  )
}

export default App
