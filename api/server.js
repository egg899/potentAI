import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/db.js';
// import crypto from 'crypto';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();


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

//Ruta de prueba para la raíz
app.get('/', (req, res) => {
    res.send("¡Servidor funcionando correctamente!")
})

// const token = crypto.randomBytes(32).toString('hex');
// console.log('El token: ', token);
//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port at http://localhost:${PORT}`));



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// dotenv.config();

// const port = 3000;
// Server.listen(port, ()=>{
//     console.log()
// });

