import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';


const CreateResumeForm = ({ estructuraCV = null, laburo, onSuccess }) => {
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
    // if(laburo){
    //   alert('El laburo esta AQUI!!!');


    // }
    console.log('laburo de createResume', laburo);
   
    try {
      const payload = { title };
      
      if (laburo && laburo._id){
      payload.jobId = laburo._id;
    }
      // Solo incluir estructuraCV si está definida y no es null
      if (estructuraCV && Object.keys(estructuraCV).length > 0) {
         Object.assign(payload, estructuraCV);
        
      }
      console.log('PAYLOAD',payload);
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE,  payload);

      if (response.data?._id) {


        if (localStorage.getItem("Laburo")) {
              localStorage.removeItem("Laburo");
            }

        if (onSuccess) onSuccess();
        navigate(`/resume/${response.data?._id}`, {
          
        });
      }

    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Algo salió mal. Por favor, intentá nuevamente.");
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