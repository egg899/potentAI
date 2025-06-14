import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; 
import { API_PATHS } from '../utils/apiPaths';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { UserContext } from '../context/userContext';
const Analisis = () => {
  
 const [cvFile, setCvFile] = useState();
 const [textoCV, setTextoCV] = useState(''); 

 const { user, loading } = useContext(UserContext);
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setCvFile(file);
    }

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
      // console.log("CV analizado: ", analyzedData);
      setTextoCV(response.data.textoExtraido);

    }
    catch(error) {
      console.error("Error al analizar el CV:", error);
      alert("Hubo un problema al analizar el CV.");

    }


  }//handleSubmitCV

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
  <h2 className="text-3xl font-bold text-gray-800 mb-6">Sube tu CV para análisis</h2>

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
        className={`w-full md:w-auto py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200
          ${cvFile ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
      >
        Analizar CV
      </button>
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