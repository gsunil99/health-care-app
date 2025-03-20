import express from 'express'
import { bookAppointment, cancelAppointment, getAllAppointments, getUserDetails, loginUser, paymentRazorPay, registerUser, updateUserDetails, verifyRazorPay } from '../controllers/userController.js'
import { authUser } from '../middlewares/auth-user.js'
import upload from '../middlewares/multer.js'
const userRouter = express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getUserDetails)
userRouter.post('/update-profile',upload.single('image'),authUser,updateUserDetails)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,getAllAppointments)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorPay)
userRouter.post('/verify-razorpay',authUser,verifyRazorPay)
export default userRouter