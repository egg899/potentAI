import nodemailer from 'nodemailer';

// services/emailService.js
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT || 587,
//     secure: false, // 👈 corregido (era SECURE)
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     },
//     tls: {
//         rejectUnauthorized: false // 👈 evita el error self-signed certificate
//     }
// });


// // Test de conexión (opcional)
// transporter.verify((error, success) => {
//   if (error) console.error("SMTP Error:", error);
//   else console.log("Servidor SMTP listo para enviar correos");
// });

// // Función para enviar el correo
// export const enviarCorreo = async (to, subject, html) => {
//     try {
//         const info = await transporter.sendMail({
//             from: `"PotentIA" <${process.env.EMAIL_USER}>`,
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


// Configuramos la API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Función para enviar el correo
export const enviarCorreo = async(to, subject, html) => {
    try {
        const msg = {
            to,
           from: {
              email: process.env.EMAIL_FROM,
              name: "PotentIA"
            },
           
            subject,
            html,
        };
        await sgMail.send(msg);
    }
    catch(error){
        console.error('Error al enviar correo', error);
        throw error;
    }
};


// Prueba rápida de envío (opcional)
if (process.argv.includes('--test')) {
  (async () => {
    try {
      await enviarCorreo(
        'germanverissimo5@hotmail.com',
        'Test SendGrid',
        '<strong>Si ves esto, SendGrid funciona!</strong>'
      );
    } catch (err) {
      console.error('Error en test email:', err);
    }
  })();
}