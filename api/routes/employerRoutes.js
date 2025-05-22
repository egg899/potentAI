import express from 'express';
import { getEmployerStats } from '../controllers/employerController.js';
import { verifyToken } from '../middlewares/auth.js';
import { isEmployer } from '../middlewares/roleCheck.js';

const router = express.Router();

// Ruta protegida para obtener estadísticas del empleador
router.get('/stats', verifyToken, isEmployer, getEmployerStats);

export default router; 