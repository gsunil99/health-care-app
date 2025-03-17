import express from 'express'
import { bookAppointment, getUserDetails, loginUser, registerUser, updateUserDetails } from '../controllers/userController.js'
import { authUser } from '../middlewares/auth-user.js'
import upload from '../middlewares/multer.js'
const userRouter = express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getUserDetails)
userRouter.post('/update-profile',upload.single('image'),authUser,updateUserDetails)
userRouter.post('/book-appointment',authUser,bookAppointment)

export default userRouter