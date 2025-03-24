import express from 'express'
import { appointmentsDoctor, doctorList, loginDoctor } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/auth-doctor.js';

export const doctorRouter = express.Router();
doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)