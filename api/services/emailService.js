import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // 👈 corregido (era SECURE)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar el correo
export const enviarCorreo = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `Tu App <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Correo enviado: %s", info.messageId);
    } catch (error) {
        console.error("Error al enviar correo:", error);
        throw error;
    }
};
