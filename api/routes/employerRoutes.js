import express from 'express';
import { getEmployerStats } from '../controllers/employerController.js';
import protect from '../middlewares/authMiddleware.js';
import { isEmployer } from '../middlewares/roleCheck.js';

const router = express.Router();

// Ruta protegida para obtener estadísticas del empleador
router.get('/stats', protect, isEmployer, getEmployerStats);

export default router; 