import React, {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; 
import { API_PATHS } from '../utils/apiPaths';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { UserContext } from '../context/userContext';
const Analisis = () => {

 const { id } = useParams();
 const [cvFile, setCvFile] = useState();
 const [textoCV, setTextoCV] = useState(''); 

 const { user, loading } = useContext(UserContext);
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setCvFile(file);
    }
console.log('id', id);
  };

  const handleSubmitCV = async() => {
    if(!cvFile) return;

    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
     
      const response = await axiosInstance.post(API_PATHS.RESUME.uploadAndAnalyzeCV, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const analyzedData = response.data;
     console.log("CV analizado: ", analyzedData);
      setTextoCV(response.data.textoExtraido);




    }
    catch(error) {
      console.error("Error al analizar el CV:", error);
      alert("Hubo un problema al analizar el CV.");

    }


  }//handleSubmitCV


  const handleMejoraCV = async() => {
    const textoExtraido = textoCV;

    // console.log("texto que se envirá para mejorar", textoExtraido);

    if(!textoExtraido) {
      console.warn("No hay texto extraído. No se enviará nada.");
      return;
    }


    try {
           const mejora = await axiosInstance.post(API_PATHS.RESUME.mejorar, { textoExtraido });
          // const mejora = await axiosInstance.post('api/cv/mejorar', { textoExtraido });
          console.log("Respuesta de mejora:", mejora.data.textoMejorado);
        }

    catch (error) {
      console.error("Error al mejorar el CV:", error.response?.data || error.message);
    }    
      
      


  }//handleMejoraCV

  useEffect(() => {
      if(cvFile){
        console.log('cvFile', cvFile);
         console.log('textoCV',textoCV);
      } 

  }, [cvFile, textoCV]);

  return (
    <DashboardLayout>
     <div className="p-8 border border-purple-200 rounded-2xl bg-white shadow-lg max-w-4xl mx-auto mt-10">
 
<div className="p-8 border border-purple-200 rounded-2xl bg-white shadow-lg max-w-4xl mx-auto mt-10">
  <h2 className="text-3xl font-bold text-gray-800 mb-6">Subí tu CV para análisis</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
    <div>
      <label className="block text-base font-medium text-gray-700 mb-2">
        Archivos permitidos:
        <span className="font-semibold"> PDF</span> o
        <span className="font-semibold"> DOCX</span>
      </label>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-purple-50 file:text-purple-700
          hover:file:bg-purple-100
          mb-4"
      />
    </div>

    <div className="flex justify-start md:justify-end">
      <button
        onClick={handleSubmitCV}
        disabled={!cvFile}
        className={`w-full md:w-auto py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200 cursor-pointer
          ${cvFile ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
      >
        Analizar CV
      </button>


      <button
        onClick={handleMejoraCV}
        disabled={!textoCV}
        className={`w-full md:w-auto py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200 ms-3 cursor-pointer
          ${textoCV ? 'bg-red-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
      >Mejorar CV</button>
    </div>
  </div>
</div>
{textoCV && (
  <div className="mt-5">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Texto Extraído</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{textoCV}</pre>

</div>

)}



</div>
        
    
    </DashboardLayout>
  )
}

export { Analisis };