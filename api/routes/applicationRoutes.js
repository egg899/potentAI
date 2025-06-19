import express from 'express';
import { createApplication, getApplicationsByJob } from '../controllers/applicationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isEmployer } from '../middlewares/roleCheck.js';

const router = express.Router();

// Ruta para crear una postulación (aplicar a un trabajo)
router.post('/', protect, createApplication);
// Ruta para que el empleador vea las postulaciones de un trabajo
router.get('/job/:jobId', protect, isEmployer, getApplicationsByJob);

export default router; 