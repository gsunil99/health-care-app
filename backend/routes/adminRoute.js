import express from 'express'
import { addDoctor, adminDashboard, allDoctors, appointmentsAdmin, cancelAppointment, loginAdmin } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/auth-admin.js';
import { changeAvailabitly } from '../controllers/doctorController.js';

const adminRouter = express.Router();
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.post('/login',loginAdmin);
adminRouter.get('/all-doctors',authAdmin,allDoctors);
adminRouter.post('/change-availabilty',authAdmin,changeAvailabitly);
adminRouter.get('/appointments',authAdmin,appointmentsAdmin);
adminRouter.post('/cancel-appointment',authAdmin,cancelAppointment);
adminRouter.get('/dashboard',authAdmin,adminDashboard);
export default adminRouter;