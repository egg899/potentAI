import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/db.js';
import crypto from 'crypto';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import employerRoutes from './routes/employerRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || '*',
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

//Connect to DataBase
connectDB();

//Middleware
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/jobs", jobRoutes);

//Ruta de prueba para la raíz
app.get('/', (req, res) => {
    res.send("¡Servidor funcionando correctamente!")
})

//Serve uploads folder
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"), {
        setHeaders: (res, path) => {
            res.set("Access-Control-Allow-Origin", "*");
            res.set("Cache-Control", "no-cache, no-store, must-revalidate");
            res.set("Pragma", "no-cache");
            res.set("Expires", "0");
        }
    })
);

// const token = crypto.randomBytes(64).toString('hex');
// console.log('El token: ', token);
//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port at http://localhost:${PORT}`));




// dotenv.config();

// const port = 3000;
// Server.listen(port, ()=>{
//     console.log()
// });

