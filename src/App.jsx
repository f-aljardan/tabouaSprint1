
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import './App.css'
import Login from "./components/Login"
import MainPage from "./components/MainPage"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ForgotPassword from './components/ForgotPassword';
import PasswordReset from './components/PasswordReset'; 
import Signup from './components/Signup';




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
      <Route path="/passwordreset" element={<PasswordReset />} />

      
     </Routes>
       
    </Router>  
    </LocalizationProvider>
 
  </>

  )
}

export default App
