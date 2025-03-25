import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { appointmentModel } from "../models/appointmentModel.js";

export const changeAvailabitly = async(req,res) =>{
    try {
        const {docId} = req.body;
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available});
        res.json({success:true,message:`Doctor ${docData.name} availabilty is changed`})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}
export const doctorList = async(req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export const loginDoctor = async(req,res) =>{
    try {
        const {email,password} = req.body;
        const doctor = await doctorModel.findOne({email});
        if(!doctor){
            return res.json({success:false,message:'Invalid credentials'})
        }
        const isMatch = await bcrypt.compare(password, doctor.password);
        if(isMatch){
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            return res.json({success:true,token});
        } else{
            return res.json({success:false,message:'Invalid credentials'})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API to get all doctors data
export const appointmentsDoctor = async(req,res) =>{
    try {
        const {docId} = req.body;
        const appointments = await appointmentModel.find({docId})
        return res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API to mark completed
export const appointmentComplete = async(req,res)=>{
    try {
        const{docId,appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if(appointmentData && appointmentData.docId==docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});
            return res.json({success:true,message:'Appointment completed'})
        }else{
            return res.json({success:false,message:'Mark Failed'})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API to cancel appointment
export const appointmentCancel = async(req,res)=>{
    try {
        const{docId,appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if(appointmentData && appointmentData.docId===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
            return res.json({success:true,message:'Appointment cancelled'})
        }else{
            return res.json({success:false,message:'Cancellation Failed'})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


//API to get dash board data
export const doctorDashboard = async(req,res)=>{
    try {
        const{docId} = req.body;
        const appointmentData = await appointmentModel.find({docId});
        let earnings=0
        appointmentData.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings += Number(item.amount)
            }
        })
        let patients = []
        appointmentData.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })
        const dashData = {
            earnings,
            appointmentsCount: appointmentData.length,
            patientsCount : patients.length,
            latestAppointments : appointmentData.reverse().slice(0,5)
        }
        res.json({success:true,dashData});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export const doctorProfile = async(req,res)=>{
    try {
        const{docId} = req.body;
        const profileData = await doctorModel.findById(docId).select('-password');
        return res.json({success:true,profileData})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


export const updateDoctorProfile = async(req,res)=>{
    try {
        const {docId,fees,address,available} = req.body;
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available});
        return res.json({success:true,message:'Profile Updated'})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}