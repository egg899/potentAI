import express from "express";
import { getRemoteJobs, getOrCreateRemoteJob, getRemoteJobByRemoteId } from "../controllers/remoteJobController.js";

const router = express.Router();

//El Fetch de Remotive
router.get("/", getRemoteJobs);

// Crear o devolver trabajo en MongoDB
router.post("/createOrGet", getOrCreateRemoteJob);

// Devolver Trabajo Remoto
router.get("/byRemoteId/:remoteId", getRemoteJobByRemoteId);

export default router;