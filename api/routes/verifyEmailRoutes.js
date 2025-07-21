import express from 'express';
import { verifyEmail } from '../controllers/emailverificationController.js';


const router = express.Router();

router.get('/verify/:token', verifyEmail);

export default router;