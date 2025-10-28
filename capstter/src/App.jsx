import './App.css'

import { Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register.jsx'
import UserDashboard from './pages/Sessionpages/UserDashboard.jsx'
import CreateOrder from './pages/Sessionpages/CreateOrder.jsx'
import Inventory from './pages/Sessionpages/Inventory.jsx'
import SalesAnalysis from './pages/Sessionpages/SalesAnalysis.jsx'
import SalesLog from './pages/Sessionpages/SalesLog.jsx'
import ItemRegistration from './pages/Sessionpages/ItemRegistration.jsx'
import UserDetails from './pages/Userdetails.jsx'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Register" element={<Register/>} />
      <Route path="/UserDashboard" element={<UserDashboard/>} />
      <Route path="/UserDetails" element={<UserDetails/>}/>
      <Route path="/CreateOrder" element={<CreateOrder/>} />
      <Route path="/itemregistration" element={<ItemRegistration/>} />
      <Route path="/inventory" element={<Inventory/>} />
      <Route path="/salesanalysis" element={<SalesAnalysis/>} />
      <Route path="/salesLog" element={<SalesLog/>} /> 

    </Routes>
  )
}

export default App
