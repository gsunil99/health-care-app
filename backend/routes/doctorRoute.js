import express from 'express'
import { doctorList } from '../controllers/doctorController.js';

export const doctorRouter = express.Router();
doctorRouter.get('/list',doctorList)