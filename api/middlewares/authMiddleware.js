import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware para proteger las rutas

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if(token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];//Extrae token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Buscar el usuario y establecer req.user
            const user = await User.findById(decoded.id).select("-password");
            
            if (!user) {
                return res.status(401).json({ message: "Usuario no encontrado" });
            }
            
            // Asegurar que req.user tenga el id
            req.user = user;
            if (!req.user.id) {
                req.user.id = req.user._id.toString();
            }
            
            next();
        } else {
            return res.status(401).json({ message: "No ha sido autorizado, no hay Token" });
        }
    } catch (error) {
        console.error("Error en middleware protect:", error);
        return res.status(401).json({ message: "El Token ha fallado", error: error.message});
    }
};//protect

export default protect;