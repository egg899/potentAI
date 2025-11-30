import express from "express";
import { scrapeLinkedinTitle } from "../controllers/scrapeController.js"; 

const router = express.Router();

router.post("/", scrapeLinkedinTitle);

export default router;