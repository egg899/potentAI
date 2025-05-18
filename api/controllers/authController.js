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

        console.log("Voy a crear usuario con userType:", userType); // Debug log

        //Chequea si el usuario ya existe
        const userExist = await User.findOne({ email });
        if(userExist) {
            return res.status(400).json({ message: "El usuario ya existe "});
        }

        //El password Hasheado
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

        console.log("Usuario creado:", user); // Debug log

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            userType: user.userType,
            token: generateToken(user._id), 
        });
    }
    catch(error){
        res.status(500).json({ message: "Error en el Servidor", error: error.message });
    }
}//register User End

//Login User
export const loginUser = async (req, res) => {
    try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if(!user) {
                return res.status(500).json({ message: "Email o contraseña invalida"  });
            }

            //Compara los Passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(500).json({  message: "Email o contraseña invalida"  });
            }

            console.log("User type during login:", user.userType); // Debug log

            //Devuelve la Data del Usuario with JWT
            res.json ({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                userType: user.userType,
                token: generateToken(user._id),
            });
    } catch (error){
        console.error("Login error:", error); // Debug log
        res.status(500).json({ message: "Error en el Servidor", error: error.message });
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

