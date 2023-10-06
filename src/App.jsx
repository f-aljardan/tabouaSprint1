
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import './App.css'
import Login from "./components/Login"
import MainPage from "./components/MainPage"
import Footer from './components/Footer';
function App() {


  return (
    <>
    <Router>
      <Routes>

      <Route path="/" exact element={<Login/>} />
      <Route path="/mainpage/*"  element={ <MainPage/>} />
     
     </Routes>
       
    </Router> 

   
       {/* <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <Routes>
            <Route path="/home" exact element={<Home/>} />
            <Route path="/garbage" element={<GarbageBins/>} />
            <Route path="/recycle" element={<RecyclingCenters/>} />
            <Route path="/complaints" element={<Complaints/>} /> 
            <Route path="/heatmap" element={<Heatmap/>} />
            <Route path="/manage" element={<ManageStaff/>} />
          </Routes>
        </div>
      </div>
    </Router> */}
  </>

  )
}

export default App
