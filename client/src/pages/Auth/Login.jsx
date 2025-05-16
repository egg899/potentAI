import React, {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
const Login = ({setCurrentPage}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  // Handle Login form Submit
  const handleLogin = async (e) =>{
    e.preventDefault();

    if(!validateEmail(email)) {
      setError("Por favor ingresa una dirección de correo válida");
      return;
    }

    if(!password) {
      setError("Por favor ingrese otra contraseña");
      return;
    }

    setError("");


    //Login API Call
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
          email,
          password,
        });

        const { token } = response.data;

        if(token){
          localStorage.setItem("token", token);
          updateUser(response.data);
          navigate("/dashboard");
          console.log(response.data);
        }//if token
    }
    catch(error){
      if(error.response && error.response.data.messaga) {
        setError(error.response.data.message);
      } else {
        setError("Algo salió mal. Por favor, intente de nuevo");
      }
    }
  };




  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black"> Bienvenido </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6"> Por Favor, ingrese tus detalles para entrar a tu cuenta</p>
    
    
        <form onSubmit={handleLogin}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

<Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Minimo 8 caracteres"
            type="password"
          />
          </div>



          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}


            <button type="submit" className="btn-primary">
              ENTRAR
            </button>

          <p className="text-[13px] text-slate-800 mt-3">
            ¿No tiene cuenta?{" "}
              <button
              className="font-medium text-primary underline cursor-pointer"
              onClick={() =>{
                setCurrentPage("signUp");
              }}>
                  REGISTRARSE

              </button>
          </p>


        </form>
    
    
    
    </div>

      

  )
}

export {Login} 