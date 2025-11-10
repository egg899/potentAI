import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { enviarCorreo } from "../services/emailService.js"; 

dotenv.config();
//Generate JWT Token

console.log('del env en authcontroller: ',process.env.JWT_SECRET);
const generateToken = (userId) =>{
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d"} );
};

console.log('generar el token', generateToken());

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


        //Generamos el token de verificación
        const verificationToken = crypto.randomBytes(32).toString('hex');
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
                userType: userType || 'job_seeker',
                isVerified: false, ///// Esto es nuevo para la verficación
                verificationToken
            });

            // const verificationLink = `${process.env.BASE_URL}/auth/verify-email?user=${user._id}`;///Esto es el codigo de verificacion
            const verificationLink = `${process.env.BASE_URL}/auth/verify/${verificationToken}`;
    

            //Armando el contenido del correo
                    const html = `
                        <h1>Hola ${name}</h1>
                        <p>Gracias por registrarte. Por favor confirmá tu correo haciendo clic <a href="${verificationLink}">aquí</a>.</p>
                        `;


            //Enviar correo usando la funcion de enviarCorreo
            await enviarCorreo(email, 'Confirma tu correo', html);

            console.log("Usuario creado exitosamente:", { 
                id: user._id,
                email: user.email,
                userType: user.userType,
                isVerified: user.isVerified, 
            });

            return res.status(201).json({
                message: "Registro exitoso. Te hemos enviado un correo para confirmar tu cuenta."
                });
            // Generar token
            // const token = generateToken(user._id);
            // if (!token) {
            //     throw new Error("Error al generar el token");
            // }

            // res.status(201).json({
            //     _id: user._id,
            //     name: user.name,
            //     email: user.email,
            //     profileImageUrl: user.profileImageUrl,
            //     userType: user.userType,
            //     token
            // });
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

        if(!user.isVerified) {
            return res.status(403).json({
                message: 'Tu correo no ha sido verificado. Revisá tu bandeja de entrada.',
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
        console.log('token en el login:',token)
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

// Recuperar contraseña - enviar email con token
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Por seguridad, no revelar si el email existe o no
            return res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña.' });
        }
        // Generar token y expiración (1 hora)
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        // Enlace de recuperación
        const resetLink = `${process.env.BASE_URL}/auth/reset-password/${resetToken}`;
        const html = `
            <h1>Recuperar contraseña</h1>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        `;
        await enviarCorreo(user.email, 'Recuperar contraseña', html);
        return res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña.' });
    } catch (error) {
        console.error('Error en forgotPassword:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

// Cambiar contraseña usando el token
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'El enlace es inválido o ha expirado.' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        console.error('Error en resetPassword:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

//Cambiar contraseña desde el perfil con el usuario logueado
export const changePassword = async (req, res) => {
    try {

        const { currentPassword, newPassword } = req.body;
        const userId =  req.user.id; // viene del middleware

        // Verifica que se envian ambos campos
        if(!currentPassword || !newPassword) {
            return res.status(404).json({ message: "Por favor, complete todos los campos" });
        }

        // Validar longitud de la nueva contraseña
        if (newPassword.length < 8) {
            return res.status(400).json({ message: "La nueva contraseña debe tener al menos 8 caracteres" });
        }


        //Buscar el ususario por ID
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }

        // Verificar la contraseña actual
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: "La contraseña actual es incorrecta." });
        }

        // Hashear y actualizar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message:  "Contraseña actualizada correctamente"});

    }
    catch (error) {
        console.error("Error al cambiar la contraseña: ", error);
        return res.status(500).json({ message: "Error en el servidror", error: error.message });
    }



}//changePassword