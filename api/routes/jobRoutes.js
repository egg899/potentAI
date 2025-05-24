import express from 'express';
import { getAllJobs, getJobById } from '../controllers/jobController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta pública para obtener todas las publicaciones
router.get('/', getAllJobs);

// Ruta pública para obtener una publicación específica
router.get('/:id', getJobById);

export default router; 