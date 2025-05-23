import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware para proteger las rutas

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
           // console.log("Middleware protect - Authorization header:", token);

        if(token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];//Extrae token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("Middleware protect - decoded token:", decoded);
            // console.log("Middleware protect - user found:", req.user);  
            // Aquí metemos los logs para depurar:
            const userFound = await User.findById(decoded.id);
            // console.log("User found without select:", userFound);

            req.user = await User.findById(decoded.id).select("-password");
            // console.log("User found with select:", req.user);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } else {
            res.status(401).json({ message: "No ha sido autorizado, no hay Token" });
        }
    } catch (error) {
        res.status(401).json({ message: "El Token ha fallado", error: error.message});
    }
};//protect

export default protect;