import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerificacionCorreo = () => {
    const {token} = useParams();
    const [mensaje, setMensaje] = useState("Verificando...");
    // const navigate = useNavigate();
    console.log(mensaje);
console.log(token);
    useEffect(() => {
      axios
        .get(`http://localhost:3000/api/auth/verify/${token}`)
            .then(() => setMensaje("✅ Tu correo fue verificado con éxito."))
        .catch((error) => {
            console.error("Error en verificación:", error.response || error.message);
            setMensaje("❌ Hubo un error al verificar tu correo.");
    });    }, [token]);//useEffect



    return (
        <div className="p-10 text-center text-xl">
            {mensaje}
        </div>
    );




}//VerificacionCorreo

export {VerificacionCorreo};