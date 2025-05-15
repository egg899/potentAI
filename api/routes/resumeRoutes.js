import express from 'express';
import { 
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
 } from "../controllers/resumeController.js";
import { protect } from "../middlewares/authMiddleware.js";
//import { uploadResumeImages } from " ../controllers/uploadImages";

const router = express.Router();

router.post("/", protect, createResume); //Crear CV
router.get("/", protect, getUserResumes); //Conseguir el CV
router.get("/:id", protect, getResumeById); //Conseguir el CV por ID
router.put("/:id", protect, updateResume); //UpdateResume
//router.put("/:id/upload-images", protect, uploadResumeImages);

router.delete("/:id", protect, deleteResume); //Delete Resume

export default router;