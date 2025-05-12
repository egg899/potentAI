import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import {validateEmail} from "../../utils/helper";
const SignUp = ({setCurrentPage}) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

//Handle SignUp form Submit
const handleSignUp = async (e) => {
  e.preventDefault();

  let profileImageUrl = "";
   if(!fullName) {
    setError("Por favor ingrese su nombre completo");
    return;
   }
if(!validateEmail(email)) {
  setError("Por favot, ingrese un correo electronico valido.");
  return;
}


if(!password){
  setError("Por favor, ingrese al contraseña");
  return;
}

setError("");

//SignUp API Call
try{ 

} catch(error) {}

};//Handle SignUp


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
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

         <button type="submit" className="btn-primary">
            REGISTRARSE
          </button> 

          <p className="text-[13px] text-slate-800 mt-3">
            ¿Ya tienes una cuenta?{" "}
            <button className="font-medium text-primary underline cursor-pointer"
              onClick={()=> {
                setCurrentPage("login");
              }}>

              ENTRAR
            </button>
          </p>




      </form>


    </div>
  )
}

export {SignUp}