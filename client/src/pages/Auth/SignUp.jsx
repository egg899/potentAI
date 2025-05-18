import React, {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import {validateEmail} from "../../utils/helper";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { uploadImage } from '../../utils/uploadImage';

const SignUp = ({setCurrentPage}) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("job_seeker");
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  //Handle SignUp form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";
    if(!fullName) {
      setError("Por favor ingrese su nombre completo");
      return;
    }
    if(!validateEmail(email)) {
      setError("Por favor, ingrese un correo electronico valido.");
      return;
    }
    if(!password){
      setError("Por favor, ingrese la contraseña");
      return;
    }

    console.log("Current userType before registration:", userType); // Debug log

    setError("");

    //SignUp API Call
    try { 
      //Subir imagen si este esta presente
      if(profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const userData = {
        name: fullName,
        email,
        password,
        profileImageUrl,
        userType,
      };

      console.log("Sending registration data:", userData);

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, userData);
      console.log("Registration response:", response.data);

      const { token } = response.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch(error) {
      console.error("Registration error:", error.response?.data || error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Algo salió mal. Por favor, intente de nuevo");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Crea una cuenta</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Únase hoy mismo ingresando sus datos a continuación
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={({target}) => setFullName(target.value)}
            label="Nombre Completo"
            placeholder="John"
            type="text"
          />

          <Input
            value={email}
            onChange={({target}) => setEmail(target.value)}
            label="Dirección Electrónica"
            placeholder="john@example.com"
            type="text"  
          />

          <Input
            value={password}
            onChange={({target}) => setPassword(target.value)}
            label="Contraseña"
            placeholder="Minimo 8 caracteres, por favor"
            type="password"
          />

          <div className="mt-4">
            <label className="text-[13px] text-slate-800 mb-2 block">Tipo de Usuario</label>
            <select
              name="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="form-input"
              required
            >
              <option value="job_seeker">Busco empleo</option>
              <option value="employer">Quiero dar empleo</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type="submit" className="btn-primary">
          REGISTRARSE
        </button> 

        <p className="text-[13px] text-slate-800 mt-3">
          ¿Ya tienes una cuenta?{" "}
          <button 
            className="font-medium text-primary underline cursor-pointer"
            onClick={()=> {
              setCurrentPage("login");
            }}
          >
            ENTRAR
          </button>
        </p>
      </form>
    </div>
  )
}

export {SignUp}