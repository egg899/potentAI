// const express = require('express');
// const router = express.Router();
// const { getEmployerStats, createJobPost } = require('../controllers/employerController');
// const { authenticateToken } = require('../middleware/auth');

// // Ruta protegida para obtener estadísticas del empleador
// router.get('/stats', authenticateToken, getEmployerStats);

// // Ruta protegida para crear una nueva publicación de trabajo
// router.post('/jobs', authenticateToken, createJobPost);

// module.exports = router; 

// routes/employerRoutes.js

import express from 'express';
import { getEmployerStats, createJobPost, getJobs, deleteJob, updateJob } from '../controllers/employerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Ruta protegida para obtener estadísticas del empleador
router.get('/stats', authenticateToken, getEmployerStats);

// Rutas para gestionar publicaciones de trabajo
router.post('/jobs', authenticateToken, createJobPost);
router.get('/jobs', authenticateToken, getJobs);
router.delete('/jobs/:jobId', authenticateToken, deleteJob);
router.put('/jobs/:jobId', authenticateToken, updateJob);

export default router;
