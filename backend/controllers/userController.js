import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import { appointmentModel } from '../models/appointmentModel.js';
import razorpay from 'razorpay';
//API register user
export const registerUser = async(req,res) =>{
    try {
        const {name,email,password} = req.body;
        if(!name || !password || !email){
            return res.json({success:false,message:'Missing Details'})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:'enter a valid email'})
        }
        //validating strong password
        if(password.length<8){
            return res.json({success:false,message:'enter a strong password'})
        }
        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const userData = {name,email,password:hashedPassword};
        const newUser = new userModel(userData);
        const user = await newUser.save()
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        return res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export const loginUser = async(req,res) =>{
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:'User does not exists'});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            return res.json({success:true,token})
        }else{
            return res.json({success:false,message:'Invalid credentials'})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export const getUserDetails = async(req,res) =>{
    try {
        const {userId} = req.body;
        const userData = await userModel.findById(userId).select('-password');
        return res.json({success:true,userData})
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})
    }
}

export const updateUserDetails = async(req,res) =>{
    try {
        const {userId,name,phone,address,dob,gender} = req.body;
        const imageFile = req.file
        if(!name || !phone || !dob || !gender || !address){
            return res.json({success:false,message:'Data Missing'})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageUrl = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId,{image:imageUrl})
        }
        return res.json({success:true,message:'Profile Updated'})
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})
    }
}

export const bookAppointment = async(req,res) =>{
    try {
        const {userId,docId,slotDate,slotTime} = req.body;
        const docData = await doctorModel.findById(docId).select('-password');
        if(!docData.available){
            return res.json({success:false,message:'Doctor not available'});
        }
        let slots_booked = docData.slots_booked

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'Slot not available'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate]=[];
            slots_booked[slotDate].push(slotTime)
        }
        const userData = await userModel.findById(userId).select('-password');
        delete docData.slots_booked;
        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotDate,
            slotTime,
            date:Date.now()
        }
        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        //save new slots in doctor data
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        return res.json({success:true,message:'Appointment Booked'})
        
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})
    }
}

export const getAllAppointments = async(req,res) =>{
    try {
       const {userId} = req.body;
       const appointments = await appointmentModel.find({userId});
       return res.json({success:true,appointments}); 
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})       
    }
}

export const cancelAppointment = async(req,res)=>{
    try {
        const{userId,appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if(appointmentData.userId != userId){
            return res.json({success:false,message:'Un authorized user'})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //release doctor slot
        const {docId,slotDate,slotTime} = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e!=slotTime);
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        return res.json({success:true,message:'Appointment cancelled'})
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})   
    }
}
const razorPayInstance = new razorpay({
    key_id:process.env.RAZOR_PAY_KEY_ID,
    key_secret:process.env.RAZOR_PAY_KEY_SECRET
})

//api payment of appointment using razorpay
export const paymentRazorPay = async(req,res)=>{
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false,message:'Appointment cancelled or not found'});
        }
        const options = {
            amount:appointmentData.amount *100,
            currency : process.env.CURRENCY,
            receipt: appointmentId
        }
        //order creation
        const order = await razorPayInstance.orders.create(options)
        return res.json({success:true,order});
    
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})       
    }
}

//api to verify payment
export const verifyRazorPay = async(req,res) =>{
    try {
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorPayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            return res.json({success:true,message:'Payment successfull'})
        } else{
            return res.json({success:false,message:'Payment failed'})
        }
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})
    }
}