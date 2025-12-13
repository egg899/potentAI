// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: false, // 👈 corregido (era SECURE)
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     },
//     tls: {
//         rejectUnauthorized: false // 👈 evita el error self-signed certificate
//     }
// });

// // Función para enviar el correo
// export const enviarCorreo = async (to, subject, html) => {
//     try {
//         const info = await transporter.sendMail({
//             from: `Tu App <${process.env.EMAIL_USER}>`,
//             to,
//             subject,
//             html,
//         });

//         console.log("Correo enviado: %s", info.messageId);
//     } catch (error) {
//         console.error("Error al enviar correo:", error);
//         throw error;
//     }
// };

import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const enviarCorreo = async (to, subject, html) => {
    try {
        const response = await resend.emails.send({
            from: `PotentIA <onboarding@resend.dev>`,
            to: ['germanverissimo5@hotmail.com'],
            subject,
            html,
        });

        console.log("Correo enviado con Resend:", data.id);
        return true;
    } catch (error) {
        console.error("Error al enviar correo con Resend:", error);
        throw error;
    }
};
