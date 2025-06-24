import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
// const CreateResumeForm = () => {
//   const [title, setTitle] = useState("");
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   // Maneja La creación del CV
//   const handleCreateResume = async (e) => {
//     e.preventDefault();

//     if(!title){
//       setError("Por favor, agregue el título");
//       return;
//     }

//     setError("");

//     //Crear la llamada del API
//     try{
//       const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
//         title
        
//       });
      
//       if(response.data?._id){
//         navigate(`/resume/${response.data?._id}`);
//       }

//     } catch(error){
//       if(error.response && error.response.data.message) {
//         setError(error.response.data.message);
//       } else {
//         setError("Algo malo ha ocurrido. Por favor, intente nuevamente");
//       }    
//     }
//   };
//   return (
//     <div className="w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center">
//       <h3 className="text-lg font-semibold text-black">Crear nuevo CV</h3>
//       <p className="text-xs text-slate-700 mt-[5px] mb-3">
//         Dale a tu CV un título para empezar. Puedes editar todos los detalles después.
//       </p>


//     <form onSubmit={handleCreateResume}>
//       <Input
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         label="Título del CV"
//         placeholder="Ej: El CV de Mike"
//         type="text"
//       />

//       {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
//       <button type="submit" className="btn-primary">
//         Crear el Currículum Vitae
//       </button>
//     </form>
//   </div>
//   )
// }



const CreateResumeForm = ({ estructuraCV = null, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateResume = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Por favor, agregue el título");
      return;
    }

    setError("");

    try {
      const payload = { title };

      // Solo incluir estructuraCV si está definida y no es null
      if (estructuraCV && Object.keys(estructuraCV).length > 0) {
         Object.assign(payload, estructuraCV);
        
      }
      console.log('PAYLOAD',payload);
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE,  payload);

      if (response.data?._id) {
        if (onSuccess) onSuccess();
        navigate(`/resume/${response.data?._id}`);
      }

    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Algo salió mal. Por favor, intente nuevamente.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Crear nuevo CV</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Dale a tu CV un título para empezar. Puedes editar todos los detalles después.
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Título del CV"
          placeholder="Ej: El CV de Mike"
          type="text"
        />
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button type="submit" className="btn-primary">
          Crear el Currículum Vitae
        </button>
      </form>
    </div>
  );
};


export default CreateResumeForm