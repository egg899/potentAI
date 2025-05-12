import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//Generate JWT Token
const generateToken = (userId) =>{
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "2d"} );
};


//Register user
export const registerUser = async (req, res) => {
    try{
        const { name, email, password, profileImageUrl } = req.body;


        //Chequea si el usuario ya existe
        const userExist = await User.findOne({  email });
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
        });

        //Retorna la data del Usuario con JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id), 
        });
    }
    catch(error){
        res.status(500).json({ message: "Error en el Servidor", error: error.massage });
    }

    
}//register User

//Login User
export const loginUser = async (req, res) => {}

//get User Profile
export const getUserProfile = async (req, res) => {}

