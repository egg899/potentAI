import express from "express";
import { getRemoteJobs } from "../controllers/remoteJobController.js";

const router = express.Router();
router.get("/", getRemoteJobs);

export default router;