import React, {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = ({setCurrentPage, setOpenAuthModal}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  // Handle Login form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validaciones
      if(!validateEmail(email)) {
        setError("Por favor ingresa una dirección de correo válida");
        setIsLoading(false);
        return;
      }

      if(!password) {
        setError("Por favor ingrese su contraseña");
        setIsLoading(false);
        return;
      }

      if(password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres");
        setIsLoading(false);
        return;
      }

      console.log("Enviando datos de login:", { email, password: "***" });

      //Login API Call
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("Respuesta del servidor:", response.data);

      const { token } = response.data;
      
      if(token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        setOpenAuthModal(false); // Cerrar el modal
        navigate("/");
      } else {
        setError("Error en la respuesta del servidor. Por favor, intente de nuevo.");
      }
    } catch(error) {
      console.error("Error completo de login:", error);
      if(error.response) {
        console.error("Datos de respuesta del error:", error.response.data);
        setError(error.response.data.message || "Error al iniciar sesión. Por favor, intente de nuevo.");
      } else if(error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
        setError("No se pudo conectar con el servidor. Por favor, intente de nuevo.");
      } else {
        console.error("Error en la configuración de la solicitud:", error.message);
        setError("Error al procesar la solicitud. Por favor, intente de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Bienvenido</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Por favor, ingrese sus detalles para entrar a su cuenta
      </p>

      <form onSubmit={handleLogin}>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mt-4">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Correo Electrónico"
            placeholder="john@example.com"
            type="email"
            helperText="Ej: juan@ejemplo.com"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Contraseña"
            placeholder="Ingresar la contraseña"
            type="password"
            helperText="Mínimo 8 caracteres"
          />

        </div>

        {/* Enlace para recuperar contraseña */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            className="text-xs text-primary underline cursor-pointer"
            onClick={() => setCurrentPage && setCurrentPage("forgotPassword")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button 
          type="submit" 
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "ENTRANDO..." : "ENTRAR"}
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          ¿No tiene cuenta?{" "}
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("signUp");
            }}
          >
            REGISTRARSE
          </button>
        </p>
      </form>
    </div>
  );
};

export {Login} 