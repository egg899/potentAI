import { enviarCorreo } from './services/emailService.js';

(async () => {
  try {
    await enviarCorreo(
      'albertazobilingual@gmail.com',
      'Test Resend',
      '<h1>Probando Resend</h1><p>Si ves esto, funciona!</p>'
    );
    console.log("Email enviado!");
  } catch (err) {
    console.error("Fallo test email:", err);
  }
})();
