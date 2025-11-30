import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import employerRoutes from './routes/employerRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import mejorarCVRoutes from './routes/mejorarCVRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import verifyEmailRoutes from './routes/verifyEmailRoutes.js';
import scrapeRoutes from './routes/scrapeRoutes.js';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware CORS y JSON
app.use(
    cors({
        origin: process.env.CLIENT_URL || '*',
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
connectDB();
app.use(express.json());

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/auth", verifyEmailRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ai", analyzeRoutes);
app.use("/api/cv", mejorarCVRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/scrape", scrapeRoutes);
// Ruta de prueba para la raíz
app.get('/', (req, res) => {
    res.send("¡Servidor funcionando correctamente!");
});

// Servir la carpeta de uploads (si la usas)
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

// Servir archivos estáticos del frontend (Vite build)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Redirigir todas las rutas desconocidas al index.html del frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port at http://localhost:${PORT}`));




// dotenv.config();

// const port = 3000;
// Server.listen(port, ()=>{
//     console.log()
// });

