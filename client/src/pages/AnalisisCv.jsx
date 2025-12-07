import React, {useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; 
import { API_PATHS } from '../utils/apiPaths';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import Modal from '../components/Modal';
import { LuCirclePlus } from 'react-icons/lu';
import CreateResumeForm from './Home/CreateResumeForm';
import logoPotentia from '../assets/images/logo-potentia.png';
const Analisis = () => {

 const { id } = useParams();
 const [cvFile, setCvFile] = useState();
 const [textoCV, setTextoCV] = useState(''); 
 const [estructuraCV, setEstructuraCV] = useState(null);

 const [ errorEstructura, setErrorEstructura ] = useState(false);
 const [isImprovingCV, setIsImprovingCV] = useState(false);
 const [isExtracting, setIsExtracting] = useState(false);
 const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setCvFile(file);
    }
console.log('id', id);
  };

  const handleSubmitCV = async() => {
    if(!cvFile) return;
    setIsExtracting(true); //Inicia el loading
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
    finally {
      setIsExtracting(false); // Termina el loading

    }//finally

  }//handleSubmitCV

// const laburo = localStorage.getItem("Laburo");
// const parsedLaburo = laburo ? JSON.parse(laburo) : null;


// if(laburo){
//     // alert('Puesto desde los laburos: ESTE ITEM EXISTE!!!!');
//   console.log("Laburo encontrado para mejora de CV:", parsedLaburo.title || parsedLaburo.titulo);
//     // alert( `Laburito Descripción: ${laburo.description}`);
//     }else{
//       // alert('No existe');
//     }




// Obtener trabajo interno de la DB
const localJob = localStorage.getItem("Laburo");
const parsedLocalJob = localJob ? JSON.parse(localJob) : null;

// Obtener trabajo remoto de Remotive
const remoteJob = localStorage.getItem("selectedRemJob");
const parsedRemoteJob = remoteJob ? JSON.parse(remoteJob) : null;

// Elegir cuál usar: primero el interno, si no existe usar el remoto
const parsedLaburo = parsedLocalJob || parsedRemoteJob;

if(parsedLaburo){
  console.log("Laburo seleccionado para mejorar el CV:", parsedLaburo.title || parsedLaburo.titulo);
}else{
  console.log("No hay laburo seleccionado en localStorage");
}

  const handleMejoraCV = async() => {
    const textoExtraido = textoCV;

    // console.log("texto que se envirá para mejorar", textoExtraido);

    if(!textoExtraido) {
      console.warn("No hay texto extraído. No se enviará nada.");
      return;
    }

    setIsImprovingCV(true);
    setErrorEstructura(false);

    try {
           const mejora = await axiosInstance.post(API_PATHS.RESUME.mejorar, { 
            textoExtraido,
            laburo: parsedLaburo
           });
          // const mejora = await axiosInstance.post('api/cv/mejorar', { textoExtraido });
          // console.log("Respuesta de mejora: ", mejora.data);
          // console.log("Estructura lista para guardar: ", mejora.data.estructura);
          console.log('Todo junto: ', mejora.data);

          const resumen = mejora.data.resumen;
          const estructura = mejora.data.estructura;


        // Validación básica del objeto estructura
          const esValido =
          estructura &&
          typeof estructura === "object" &&
          estructura.profileInfo &&
          estructura.contactInfo &&
          estructura.workExperience &&
          estructura.education;


          if(!esValido) {
            setErrorEstructura(true);
            setEstructuraCV(null);
            return;
          }


          setTextoCV(resumen);
          setEstructuraCV(estructura);
          setErrorEstructura(false);
        }

    catch (error) {
      console.error("Error al mejorar el CV:", error.response?.data || error.message);
      setErrorEstructura(true);
      setEstructuraCV(null);
    } finally {
      setIsImprovingCV(false);
    }   
  }; //handleMejoraCV

  const handleReset = () => {
    setCvFile(null);
    setTextoCV('');
    setEstructuraCV(null);
    setErrorEstructura(false);
    setIsImprovingCV(false);
    // Limpiar el input de archivo
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  useEffect(() => {
      if(cvFile){
        // console.log('cvFile', cvFile);
        //  console.log('textoCV',textoCV);
        console.log('estructuraCV: ', estructuraCV);
      } 

  }, [cvFile, textoCV, estructuraCV]);

  // Componente del Loader
  const Loader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-2xl">
        <div className="relative flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600"></div>
          <img 
            src={logoPotentia} 
            alt="PotentAI Logo" 
            className="absolute h-10 w-10"
          />
        </div>
        <p className="text-gray-800 font-semibold text-lg mb-2">Mejorando tu CV...</p>
        <p className="text-gray-500 text-sm">Esto puede tomar unos segundos</p>
        <div className="flex space-x-1 mt-4">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {isImprovingCV && <Loader />}
     <div className="p-8 border border-purple-200 rounded-2xl bg-white shadow-lg max-w-4xl mx-auto mt-10">
 
        <div className="p-8 border border-purple-200 rounded-2xl bg-white shadow-lg max-w-4xl mx-auto mt-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Subí tu CV para análisis  </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Archivos permitidos:
                <span className="font-semibold"> PDF</span> 
                {/* <span className="font-semibold"> DOCX</span> */}
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
          mb-4 cursor-pointer"
      />


      <div className="mt-4">
                   
                    También podés ingresar tu CV manualmente haciendo click{" "}  
                     <Link 
                        to="/dashboard"
                        className="text-purple-600 hover:underline font-semibold "
                     >
                      aquí
                    </Link>
                  </div>
    </div>

    <div className="flex justify-start md:justify-end gap-3">
      <button
        onClick={handleSubmitCV}
        disabled={!cvFile}
        className={`w-full md:w-auto py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200 cursor-pointer
          ${cvFile ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
      >
        Extraer CV
      </button>
      <button
        onClick={handleMejoraCV}
        disabled={!textoCV || isImprovingCV}
        className={`w-full md:w-auto py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200 cursor-pointer
          ${textoCV && !isImprovingCV ? 'bg-red-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
      >
        {isImprovingCV ? 'Mejorando...' : 'Mejorar CV'}
      </button>

      {(cvFile || textoCV || estructuraCV) && (
        <button
          onClick={handleReset}
          className="w-full md:w-auto py-3 px-6 rounded-lg text-gray-700 font-semibold transition-colors duration-200 cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300"
        >
          Actualizar
        </button>
      )}
    </div>
  </div>
</div>


      {isExtracting && (
        <div className="flex flex-col items-center justify-center mt-6">
 <div
      className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"
      style={{ borderTopColor: "transparent" }}
    ></div>          <p className="mt-3 text-gray-700">Extrayendo texto del archivo...</p>
        </div>
    )}

{!isExtracting && textoCV && (
  <div className="mt-5">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Texto Extraído</h3>
          {/* <pre style={{ whiteSpace: 'pre-wrap' }}>{textoCV}</pre> */}
          <textarea
      value={textoCV}
      onChange={(e) => setTextoCV(e.target.value)}
      className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      placeholder="El texto extraído aparecerá aquí y podrás editarlo..."
    />

          {errorEstructura && (
            <div className="mt-6 text-red-600 font-semibold">
              ⚠️ Hubo un problema al interpretar tu CV. Intentá nuevamente o probá con otro archivo.
            </div>
          )}

          {estructuraCV && Object.keys(estructuraCV).length > 0 && (
            <div className="grid grid-cols-1  gap-4 md:gap-7 pt-1 pb-6 md:px-0">                
                <div className="mt-7 h-[300px] flex flex-col gap-5 items-center justify-center bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:bg-purple-50/5 cursor-pointer" 
                        onClick={() => setOpenCreateModal(true)}>
                        <div className="w-12 h-12 flex items-center justify-center bg-purple-200/60 rounded-2xl">
                          <LuCirclePlus className="text-xl text-purple-500" />
                        </div>
              
                        <h3 className="font-medium text-gray-800">Adherir el Curriculum</h3>
                      </div>
                  
                  </div>
          )}
        <Modal
          isOpen={openCreateModal}
          onClose={() => {
            setOpenCreateModal(false);
          }}
          hideHeader
          >
            <div className="">
              <CreateResumeForm 
              estructuraCV={estructuraCV}
              laburo={parsedLaburo}
              onSuccess={()=>{
                setOpenCreateModal(false);
              }}/>
            </div>

        </Modal>
       
</div>

         


)}



</div>
        
    
    </DashboardLayout>
  )
}

export { Analisis };