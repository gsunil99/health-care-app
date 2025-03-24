import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllApointments from './pages/Admin/AllApointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
const App = () => {
  const {aToken} = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext);
  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin routes */}
          <Route path = '/' element={<></>}></Route>
          <Route path = '/admin-dashboard' element={<Dashboard />}></Route>
          <Route path = '/all-appointments' element={<AllApointments />}></Route>
          <Route path = '/add-doctor' element={<AddDoctor />}></Route>
          <Route path = '/doctor-list' element={<DoctorsList />}></Route>
          {/* Doctor route */}
          <Route path = '/doctor-dashboard' element={<DoctorDashboard />}></Route>
          <Route path = '/doctor-appointments' element={<DoctorAppointments />}></Route>
          <Route path = '/doctor-profile' element={<DoctorProfile />}></Route>
        </Routes>
      </div>
    </div>
  ) :(
    <>
    <Login/>
    <ToastContainer/>
    </>
  )
}

export default App
