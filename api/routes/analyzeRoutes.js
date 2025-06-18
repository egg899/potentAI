import express from 'express';
import multer from 'multer';
import { extractTextFromCV } from '../controllers/resumeAnalysisController.js';


const router = express.Router();
const upload = multer({ dest: 'uploads/cvs' });

router.post('/extract-text', upload.single('cv'), extractTextFromCV);

export default router;

