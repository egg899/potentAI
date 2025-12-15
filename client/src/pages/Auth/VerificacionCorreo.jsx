// VerificacionCorreo.js (Frontend)
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';



const VerificacionCorreo = () => {
  const { token } = useParams(); // Recuperar el token de la URL
  const [mensaje, setMensaje] = useState("Verificando...");

  useEffect(() => {
    // Hacer la petición al backend para verificar el correo
    axios
      .get(`https://potentia-api-production.up.railway.app/api/auth/verify/${token}`)
      .then(() => {
        setMensaje("✅ Tu correo fue verificado con éxito.");
      })
      .catch((error) => {
        console.error("Error en verificación:", error.response || error.message);
        setMensaje("❌ Hubo un error al verificar tu correo.");
      });
  }, [token]);

  return (
    <div className="p-10 text-center text-xl">
      {mensaje}
      {mensaje && (
        <div className="mt-4">
          <a
            href="https://potentai-production.up.railway.app/"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Ir a la página para iniciar sesión
          </a>
        </div>
      )}
    </div>
  );
};

export { VerificacionCorreo };
