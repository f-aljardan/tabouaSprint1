
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import './App.css'
import Login from "./components/Login"
import MainPage from "./components/MainPage"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ForgotPassword from './components/ForgotPassword';
<<<<<<< HEAD
import { app } from '/src/firebase.js'; // Adjust the import path as needed
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//import firebaseConfig from '/Users/latifaia/Desktop/gp_web/tabouaSprint1/src/firebase.js'; // Import your Firebase config
//import { initializeApp, getAuth } from '/src/firebase.js';

// Usage of the imported named exports
//const app = initializeApp(firebaseConfig);
//const auth = getAuth(app);
=======
import Signup from './components/Signup';
>>>>>>> 72b5a708cb6ffe7612e5485a7ac32c637cbba465






function App({ children }) {


  return (
    <>
  
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    {children}
    <Router>
      <Routes>

      <Route path="/" exact element={<Login/>} />
      <Route path="/signup"  element={<Signup/>} />
      <Route path="/mainpage/*"  element={ <MainPage/>} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      
     </Routes>
       
    </Router>  
    </LocalizationProvider>
 
  </>

  )
}

export default App
