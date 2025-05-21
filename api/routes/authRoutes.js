import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();

//Auth Routes
router.post("/register", registerUser); //Registra a Usuarios
router.post("/login", loginUser); //Ingresa el Usuario
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/upload-image", protect, upload.single("image"), (req, res) => {
    if(!req.file) {
        return res.status(400).json({ message:'No hay ningun archivo subido' });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});


export default router;