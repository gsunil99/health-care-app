import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const Myappointments = () => {
  const { backendUrl,token } = useContext(AppContext)
  const [appointments,setAppointments] = useState([]);

  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const slotDateFormat = (slotDate)=>{
    const dateArray = slotDate.split('_')
    return dateArray[0]+ " " + months[Number(dateArray[1])]+" "+dateArray[2]
  }
  const getUsersAppointment = async()=>{
    try {
      const {data} = await axios.get(backendUrl+'/api/user/appointments',{headers:{token}})
      if(data.success){
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  }

  const cancelAppointment = async(appointmentId)=>{
    console.log(appointmentId);
    try {
      const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})
      if(data.success){
        toast.success(data.message);
        getUsersAppointment();
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  }
  useEffect(()=>{
    if(token){
      getUsersAppointment();
    }
  },[token])
  return appointments && token &&(
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div key={index} className='grid grid-cols-[lfr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData?.image} alt=''></img>
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData?.name}</p>
              <p>{item.docData?.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address: </p>
              <p className='text-xs'>{item.docData?.address?.line1}</p>
              <p className='text-xs'>{item.docData?.address?.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item?.slotDate)} | {item?.slotTime} </p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-center'>
              {!item.cancelled && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.cancelled && <button onClick={()=>{cancelAppointment(item._id)}} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
              {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Myappointments
