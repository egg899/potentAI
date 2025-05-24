import express from 'express';
import { getEmployerStats, createJobPost, getJobs, deleteJob } from '../controllers/employerController.js';
import protect from '../middlewares/authMiddleware.js';
import { isEmployer } from '../middlewares/roleCheck.js';

const router = express.Router();

// Ruta protegida para obtener estadísticas del empleador
router.get('/stats', protect, isEmployer, getEmployerStats);

// Rutas protegidas para gestionar trabajos
router.post('/jobs', protect, isEmployer, createJobPost);
router.get('/jobs', protect, isEmployer, getJobs);
router.delete('/jobs/:jobId', protect, isEmployer, deleteJob);

export default router; 