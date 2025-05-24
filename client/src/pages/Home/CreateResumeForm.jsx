import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
const CreateResumeForm = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Maneja La creación del CV
  const handleCreateResume = async (e) => {
    e.preventDefault();

    if(!title){
      setError("Por favor, agregue  el titulo");
      return;
    }

    setError("");

    //Crear la llamada del API
    try{
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title
        
      });
      
      if(response.data?._id){
        navigate(`/resume/${response.data?._id}`);
      }

    } catch(error){
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Algo malo ha ocurrido. Por favor, intente nuevamente");
      }    
    }
  };
  return (
    <div className="w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Crear nuevo CV</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Dale a tu CV un titulo para empezar. Tu puedes editar todos los detalles despues.
      </p>


    <form onSubmit={handleCreateResume}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Titulo del CV"
        placeholder="Ej: El CV de Mike"
        type="text"
      />

      {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
      <button type="submit" className="btn-primary">
        Crear el Curriculum Vitae
      </button>
    </form>
  </div>
  )
}

export default CreateResumeForm