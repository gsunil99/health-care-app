import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { appointmentModel } from '../models/appointmentModel.js';

// Api for adding doctor
export const addDoctor = async (req,res)=>{
    try {
       
       const {name,email,password,speciality,degree,experience,about,fees,address } = req.body;
       console.log([name, email, password, speciality, degree, experience, about, fees, address].join(", "));

       const imageFile = req.file
       if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:'Missing Details'})
       }
       if(!validator.isEmail(email)){
            return res.json({success:false,message:'Please enter valid email'});
       }
       if(password.length < 8){
            return res.json({success:false,message:'Please enter strong password'});
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);   
        
        console.log('image',imageFile)
        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();
        return res.json({success:true,message:'Doctor added'});
       
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

//Api for admin login
export const loginAdmin = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token});
        }
        else {
            res.json({success:false,message:'Invalid credentials'})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API to get all doctors
export const allDoctors = async(req,res)=>{
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

//API to get all appointments
export const appointmentsAdmin = async(req,res)=>{
    try {
        const appointments = await appointmentModel.find({});
        return res.json({success:true,appointments});
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}