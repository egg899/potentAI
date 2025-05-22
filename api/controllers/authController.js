import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config();
//Generate JWT Token

console.log('del env en authcontroller: ',process.env.JWT_SECRET);
const generateToken = (userId) =>{
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "4d"} );
};

console.log('generar el token',generateToken());

//Register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, userType } = req.body;

        console.log("Datos recibidos en registro:", { 
            name, 
            email, 
            userType,
            hasPassword: !!password,
            hasProfileImage: !!profileImageUrl
        });

        // Validación de datos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: "Por favor, complete todos los campos requeridos" 
            });
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Por favor, ingrese un email válido" 
            });
        }

        // Validación de contraseña
        if (password.length < 8) {
            return res.status(400).json({ 
                message: "La contraseña debe tener al menos 8 caracteres" 
            });
        }

        // Validación de tipo de usuario
        if (userType && !['job_seeker', 'employer'].includes(userType)) {
            return res.status(400).json({ 
                message: "Tipo de usuario inválido" 
            });
        }

        //Chequea si el usuario ya existe
        const userExist = await User.findOne({ email });
        if(userExist) {
            return res.status(400).json({ 
                message: "El email ya está registrado" 
            });
        }

        //El password Hasheado
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Crear a un nuevo Usuario
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                profileImageUrl,
                userType: userType || 'job_seeker'
            });

            console.log("Usuario creado exitosamente:", { 
                id: user._id,
                email: user.email,
                userType: user.userType 
            });

            // Generar token
            const token = generateToken(user._id);
            if (!token) {
                throw new Error("Error al generar el token");
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                userType: user.userType,
                token
            });
        } catch (hashError) {
            console.error("Error al procesar la contraseña:", hashError);
            return res.status(500).json({ 
                message: "Error al procesar la contraseña" 
            });
        }
    } catch(error) {
        console.error("Error en registro:", error);
        res.status(500).json({ 
            message: "Error en el servidor", 
            error: error.message 
        });
    }
}//register User End

//Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación de datos de entrada
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Por favor, proporcione email y contraseña" 
            });
        }

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: "Email o contraseña inválida" 
            });
        }

        // Comparar contraseñas
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ 
                    message: "Email o contraseña inválida" 
                });
            }
        } catch (bcryptError) {
            console.error("Error al comparar contraseñas:", bcryptError);
            return res.status(500).json({ 
                message: "Error al procesar la autenticación" 
            });
        }

        console.log("User type during login:", user.userType); // Debug log

        // Generar token
        const token = generateToken(user._id);
        if (!token) {
            return res.status(500).json({ 
                message: "Error al generar el token de autenticación" 
            });
        }

        // Devolver datos del usuario
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            userType: user.userType,
            token
        });
    } catch (error) {
        console.error("Login error:", error); // Debug log
        res.status(500).json({ 
            message: "Error en el servidor", 
            error: error.message 
        });
    }
}//Login User End

//get User Profile
export const getUserProfile = async (req, res) => {
     try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado" });  
        }
        res.json(user);
    } catch (error){
        res.status(500).json({ message: "Error en el Servidor", error: error.message });

    }

}//Get User Profile end

// Actualizar perfil de usuario
export const updateUserProfile = async (req, res) => {
    try {
        const { _id, name, profileImageUrl } = req.body;
        if (!_id) {
            return res.status(400).json({ message: 'Falta el ID del usuario' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { name, profileImageUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el perfil', error: err.message });
    }
};

