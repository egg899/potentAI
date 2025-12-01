import express from "express";
import { scrapeLinkedinJob } from "../controllers/scrapeController.js"; 

const router = express.Router();

router.post("/", scrapeLinkedinJob);

export default router;