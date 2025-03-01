import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllApointments from './pages/Admin/AllApointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
const App = () => {
  const {aToken} = useContext(AdminContext);
  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path = '/' element={<></>}></Route>
          <Route path = '/admin-dashboard' element={<Dashboard />}></Route>
          <Route path = '/all-appointments' element={<AllApointments />}></Route>
          <Route path = '/add-doctor' element={<AddDoctor />}></Route>
          <Route path = '/doctor-list' element={<DoctorsList />}></Route>
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
