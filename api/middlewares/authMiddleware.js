import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware para proteger las rutas

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if(token && token.startWith("Bearer")) {
            token = token.split(" ")[1];//Extrae token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } else {
            res.status(401).json({ message: "No ha sido autorizado, no hay Token" });
        }
    } catch (error) {
        res.status(401).json({ message: "El Token ha fallado", error: error.message});
    }
}//protect

