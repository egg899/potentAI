import express from 'express';
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Auth Routes
router.post("/register", registerUser); //Registra a Usuarios
router.post("/login", loginUser); //Ingresa el Usuario
router.get("/profile", protect, getUserProfile);


export default router;