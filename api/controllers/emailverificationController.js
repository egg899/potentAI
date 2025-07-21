//controller/emailverification.js

import User from "../models/User.js";

export const verifyEmail = async(req, res) => {
    const {token} = req.params;

    try {
        console.log("Token recibido, controllers:", token);

        const user = await User.findOne({ verificationToken: token });

        if(!user) {
            return res.status(400).send('Token inválido o expirado.');
        }
        
        user.isVerified = true;
        // user.verificationToken = undefined;
        await user.save();

        res.status(200).send('Tu correo ha sido verificado con éxito. Ya podés iniciar sesión.');
    }
    catch(error) {
        
        console.error('Error al verificar el correo: ', error);
        res.status(500).send('Hubo un error al verificiat tu correo.');
    }
};//verifyEmail


// export const verifyEmail = async (req, res) => {
//   const { token } = req.params;

//   try {
//     const user = await User.findOne({ verificationToken: token });

//     if (!user) {
//       return res.status(404).json({ message: "Usuario no encontrado con ese token" });
//     }

//     // Solo devuelve info del usuario, no modifica nada
//     return res.status(200).json({
//       message: "Token válido, usuario encontrado",
//       user: {
//         id: user._id,
//         email: user.email,
//         isVerified: user.isVerified,
//       },
//     });
//   } catch (error) {
//     console.error("Error buscando usuario por token:", error);
//     return res.status(500).json({ message: "Error del servidor" });
//   }
// };
