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
import { getEmployerStats, createJobPost } from '../controllers/employerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Ruta protegida para obtener estadísticas del empleador
router.get('/stats', authenticateToken, getEmployerStats);

// Ruta protegida para crear una nueva publicación de trabajo
router.post('/jobs', authenticateToken, createJobPost);

export default router;
