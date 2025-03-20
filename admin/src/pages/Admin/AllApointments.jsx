import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext.jsx'
import { useEffect } from 'react';

const AllApointments = () => {
  const {aToken,appointments,getAllAppointments} = useContext(AdminContext);
  useEffect(()=>{
    if(aToken){
      getAllAppointments();
    }
  },[aToken])
  return (
    <div>
      <p>All appointments</p>
      <div>
        <div>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
      </div>
    </div>
  )
}

export default AllApointments
