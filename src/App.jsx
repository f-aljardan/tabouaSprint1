
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import './App.css'
import Login from "./components/Login"
import MainPage from "./components/MainPage"
import Footer from './components/Footer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


function App({ children }) {


  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    {children}
    <Router>
      <Routes>

      <Route path="/" exact element={<Login/>} />
      <Route path="/mainpage/*"  element={ <MainPage/>} />
     
     </Routes>
       
    </Router>  
    </LocalizationProvider>
  </>

  )
}

export default App
