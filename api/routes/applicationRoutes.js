import express from 'express';
import { 
    createApplication, 
    getApplicationsByJob, 
    updateApplicationStatus,
    getMyApplications,
    getApplicationById
} from '../controllers/applicationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isEmployer } from '../middlewares/roleCheck.js';

const router = express.Router();

// Ruta para crear una postulación (aplicar a un trabajo)
router.post('/', protect, createApplication);

// Ruta para obtener las aplicaciones del usuario actual (aplicante) - DEBE IR ANTES DE /:applicationId
router.get('/my-applications', protect, getMyApplications);

// Ruta para que el empleador vea las postulaciones de un trabajo - DEBE IR ANTES DE /:applicationId
router.get('/job/:jobId', protect, isEmployer, getApplicationsByJob);

// Ruta para actualizar el estado de una aplicación (pending, accepted, rejected) - Solo empleadores
router.patch('/:applicationId/status', protect, isEmployer, updateApplicationStatus);

// Ruta para obtener una aplicación específica por ID - DEBE IR AL FINAL
router.get('/:applicationId', protect, getApplicationById);

export default router; 