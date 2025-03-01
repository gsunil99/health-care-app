import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {
  const [docImg,setDocImg] = useState(null);
  const [error, setError] = useState("");
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [speciality,setSpeciality] = useState('General physician');
  const [fees,setFees] = useState(0);
  const [about,setAbout] = useState('');
  const [experience,setExperience] = useState('1 Year');
  const [education,setEducation] = useState('');
  const [address1,setAddress1] = useState('');
  const [address2,setAddress2] = useState('');

  const {backendUrl,aToken} = useContext(AdminContext);
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG, JPG, and PNG images are allowed.");
        setDocImg(null);
      } else {
        setError("");
        setDocImg(file);
      }
    }
  };

  const onSubmitHandler = async (e) =>{
    e.preventDefault();
    try {
      if(!docImg){
        return toast.error('Image not selected')
      }
      const formData = new FormData();
      formData.append('image',docImg);
      formData.append('name',name);
      formData.append('email',email);
      formData.append('password',password);
      formData.append('experience',experience);
      formData.append('fees',Number(fees));
      formData.append('about',about);
      formData.append('speciality',speciality);
      formData.append('degree',education);
      formData.append('address',JSON.stringify({line1:address1,line2:address2}));


      const {data} = await axios.post(backendUrl+'/api/admin/add-doctor',formData,{headers:{aToken}})
      if(data.success){
        toast.success(data.message);
      } else{
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
    }

  }
  
  return (
    <form className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 text-gray-500'>
          <label htmlFor='doc-img'>
            <img className='w-20 h-20 bg-gray-100 rounded-full cursor-pointer' src={ docImg ? URL.createObjectURL(docImg) : assets.upload_area}></img>
          </label>
          <input onChange={handleImageUpload} type='file' id='doc-img' hidden/>
          <p>Upload Doctor image</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Name</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className='border rounded px-3 py-2' type='text' placeholder='Name' required></input>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type='email' placeholder='Email' required></input>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Password</p>
              <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type='password' placeholder='Password' required></input>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(e)=>setExperience(e.target.experience)} value={experience} className='border rounded px-3 py-2' name='' id=''>
                <option value='1 Year'>1 Year</option>
                <option value='2 Year'>2 Year</option>
                <option value='3 Year'>3 Year</option>
                <option value='4 Year'>4 Year</option>
                <option value='5 Year'>5 Year</option>
                <option value='6 Year'>6 Year</option>
                <option value='7 Year'>7 Year</option>
                <option value='8 Year'>8 Year</option>
                <option value='9 Year'>9 Year</option>
                <option value='10 Year'>10 Year</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type='number' placeholder='Fees' required></input>
            </div>
          </div>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={fees} className='border rounded px-3 py-2' name='' id=''>
                <option value='General physician'>General physician</option>
                <option value='Gynecologist'>Gynecologist</option>
                <option value='Dermatologist'>Dermatologist</option>
                <option value='Pediatricians'>Pediatricians</option>
                <option value='Neurologist'>Neurologist</option>
                <option value='Gastroenterologist'>Gastroenterologist</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input onChange={(e)=>setEducation(e.target.value)} value={education} className='border rounded px-3 py-2' type='type' placeholder='Education' required></input>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type='text' placeholder='address 1' required></input>
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type='text' placeholder='address 2' required></input>
            </div>

          </div>

        </div>
        <div>
          <p className='mt-4 mb-2'>About Doctor</p>
          <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' type='text' placeholder='write about doctor' rows={5} required></textarea>
        </div>
        <button type='submit' onClick={(event)=>{onSubmitHandler(event)}} className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor
