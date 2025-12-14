import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, changePassword } 
from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import User from "../models/User.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

//Auth Routes
router.post("/register", registerUser); //Registra a Usuarios
router.post("/login", loginUser); //Ingresa el Usuario
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/forgot-password", forgotPassword); // Recuperar contraseña
router.post("/reset-password/:token", resetPassword); // Cambiar contraseña con token
router.post("/change-password", protect, changePassword);//Cambiar tu contraseña

router.post("/upload-image", protect, upload.single("image"), async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message:'No hay ningun archivo subido' });
        }

        // Obtener el usuario actual para eliminar la imagen anterior si existe
        const user = await User.findById(req.user.id);
        
        if (user && user.profileImageUrl) {
            // Extraer el nombre del archivo de la URL anterior
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            const oldFileName = path.basename(user.profileImageUrl);
            const oldFilePath = path.join(uploadsDir, oldFileName);
            
            // Eliminar la imagen anterior si existe
            if (fs.existsSync(oldFilePath)) {
                try {
                    fs.unlinkSync(oldFilePath);
                } catch (error) {
                    console.error("Error al eliminar la imagen anterior:", error);
                    // No fallar si no se puede eliminar la imagen anterior
                }
            }
        }

        // Construir la URL de la nueva imagen
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? process.env.API_URL || `${req.protocol}://${req.get("host")}`
            : `${req.protocol}://${req.get("host")}`;
        
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        res.status(500).json({ message: "Error al subir la imagen", error: error.message });
    }
});


export default router;