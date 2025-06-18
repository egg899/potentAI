import express from 'express';
import { mejorarYParsearCV } from '../controllers/mejorarCVController.js';

const router = express.Router();

router.post('/mejorar', mejorarYParsearCV);

export default router;