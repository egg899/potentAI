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
import remoteJobRoutes from './routes/remoteJobRoutes.js';



dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware CORS y JSON

const allowedOrigins = [
    
    "http://localhost:5173",
    "https://potentai-production.up.railway.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
                    // Permitir requests sin origin (Postman, Railway healthcheck, etc.)
                    if (!origin) return callback(null, true);

                    if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                    }

                    return callback(new Error("Not allowed by CORS"));
                },
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

// 👇 ESTO ES CLAVE para el preflight
app.options("*", cors());



connectDB();
app.use(express.json());

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/auth", verifyEmailRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/remote-jobs", remoteJobRoutes);
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
        setHeaders: (res, filePath) => {
            res.set("Access-Control-Allow-Origin", "*");
            // Cachear imágenes por 1 año para que persistan
            if (filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                res.set("Cache-Control", "public, max-age=31536000, immutable");
            } else {
                res.set("Cache-Control", "public, max-age=3600");
            }
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

