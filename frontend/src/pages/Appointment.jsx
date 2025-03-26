import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { useState } from 'react';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios'

const Appointment = () => {
  const { doctorId } = useParams();
  const { doctors, currencySymbol, backendUrl, getDoctorsData, token, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const fetchDoctorInfo = async () => {
    const doctorInfo = doctors.find((doctor) => doctor._id === doctorId)
    setDoctorInfo(doctorInfo);
  }
  const getAvailableSlots = async () => {
    setDoctorSlots([]);

    //getting current date
    let today = new Date();
    let validDays = 0; // Track valid days

    for (let i = 0; validDays < 7; i++) {
      //getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      //setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      //setting hours 
      if (today.getDate() === currentDate.getDate()) {
        //hours will ideally start from 10 am but changes for that particular day
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
      // Skip this day if currentDate already exceeds endTime
      if (currentDate >= endTime) continue;

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + '_' + month + '_' + year
        const slotTime = formattedTime

        const isSlotAvailable = doctorInfo.slots_booked[slotDate] && doctorInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          //add slot to array
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime
          })
        }

        //increment current time by 30minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setDoctorSlots(prev => ([...prev, timeSlots]));
      validDays++;
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }
    if (!userData.name || !userData.email || !userData.image || !userData.address.line1 || !userData.address.line2 || !userData.dob || !userData.gender || !userData.phone) {
      toast.warn('Before booking appointment update your profile details!!!')
      return navigate('/my-profile')
    }
    try {
      const date = doctorSlots[slotIndex][0].dateTime
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear()
      const slotDate = day + '_' + month + '_' + year
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId: doctorId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDoctorInfo();
  }, [doctorId, doctors])

  useEffect(() => {
    getAvailableSlots();
  }, [doctorInfo])
  return doctorInfo && (
    <div>
      {/* Doctor details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={doctorInfo.image}></img>
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* name,degree,exp */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{doctorInfo.name} <img className='w-5' src={assets.verified_icon} /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{doctorInfo.degree} - {doctorInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full '>{doctorInfo.experience}</button>
          </div>
          {/* about section */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-900 max-w-[700px] mt-1'>{doctorInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol} {doctorInfo.fees}</span>
          </p>
        </div>
      </div>
      {/* booking slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            doctorSlots.length && doctorSlots.map((item, index) => (
              <div onClick={() => {
                setSlotIndex(index);
              }} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {
            doctorSlots.length && doctorSlots[slotIndex].map((item, index) => (
              <p onClick={() => {
                setSlotTime(item.time)
              }} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>
        {doctorInfo.available ? (
          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>
        ) : (
          <p className="text-red-500 text-sm font-medium my-6">Doctor not available for while</p>
        )}

      </div>
      {/* listing related doctors */}
      <RelatedDoctors doctorId={doctorInfo._id} speciality={doctorInfo.speciality} />
    </div>
  )
}

export default Appointment
