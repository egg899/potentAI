import React,{useState, useEffect, useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LuArrowLeft,
  LuCircleAlert,
  LuDownload,
  LuPalette,
  LuSave,
  LuTrash2,
} from "react-icons/lu";

import toast from "react-hot-toast";
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import TitleInput from '../../components/Inputs/TitleInput.jsx';
import { useReactToPrint } from 'react-to-print';
import { API_PATHS } from '../../utils/apiPaths.js';
import axiosInstance from '../../utils/axiosInstance.js';
import StepProgress from '../../components/StepProgress.jsx';
import ProfileInfoForm from './Forms/ProfileInfoForm.jsx';

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState({
    title:"",
    thumbnailLink:"",
    profileInfo: {
      profileImg:null,
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: ""
    },
    template: {
      theme: "",
      colorPalette: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [{
      company:"",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    },],
    education: [{
      degree: "",
      institution:"",
      startDate:"",
      endDate: ""
    },
  ],
  skills: [{
    name:"",
    progress: 0,
  },
],
projects:[{
  title:"",
  description:"",
  github:"",
  liveDemo:""
},
],
certifications: [
  {
    title:"",
    issuer:"",
    year:"",

  }
],
languages:[
  {
    name:"",
    progress:0,
  },
],
interests: [""],
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //Validar Inputs
  const validateAndNext = (e) => {};

  //Funcion par navegar a la siguiente Pagina
  const goToNextStep = () => {};

  //Funcion para navegar a la pagina anterior
  const goBack = () => {};

  const renderForm = () => {
    
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) =>{
              updateSection("profileInfo", key, value)
            }}
            onNext={validateAndNext}
          />
        );

        default:
          return null;
    }
  };

  //Actualizar objetos anidados como profileInfo, contactInfo, etc.
  const updateSection = (section, key, value) => {
    setResumeData((prev) => [{
        ...prev,
        [section]: {
          ...prev[section],
          [key]:value,
          
        },
        
    }]);
  };

  //Actualizar items de array como workExperience, skills, etc.
  const updateArrayItem = (section, index, key, value) => {};

  //Adherir item al array
  const addArratitem = (section, newItem) => {};

  //Remover item del Array
  const removeArrayItem = (section, index) => {};

  //Fetch resume info By ID
  const fetchResumeDetailsById = async() => {
    try {
        const response = await axiosInstance.get(
          API_PATHS.RESUME.GET_BY_ID(resumeId)
        );

        if (response.data && response.data.profileInfo) {
          const resumeInfo = response.data;

          setResumeData((prevState) => ({
            ...prevState,
            title: resumeInfo?.title || "Undefined",
            template: resumeInfo?.template || prevState?.template,
            profieInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
            contactInfo: resumeInfo?.contactingInfo || prevState?.contactInfo,
            workExperience:
              resumeInfo?.workExperience || prevState?.workExperience,
            education: resumeInfo?.education || prevState?.education,
            skills: resumeInfo?.skills || prevState?.skills,
            projects: resumeInfo?.projects || prevState?.projects,
            certifications:
              resumeInfo?.certifications || prevState?.certifications,
            languages: resumeInfo?.languages || prevState?.languages,
            interests: resumeInfo?.interests || prevState?.interests, 

          }));

        }

    } catch(error){
      console.error("Error fetching resumes:", error);
    }
  };

  //Sube Thumbnail e imagen de perfil de los thumbnails
  const uploadResumeImages = async() => {};

  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {

  }

  //Borrar Curriculum
  const handleDeleteResume = async() => {};

  // Bajar CV
  const reactToPrintln = useReactToPrint({ contentRef: resumeDownloadRef});

  //Funcion para actualizar el ancho de la base  basado en el tamaño del contenedor
  const updateBaseWidth = () => {};

  useEffect(() =>{
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);

    if(resumeId) {
      fetchResumeDetailsById();
    }

    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };


  }, []);//useEffect


  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4">
         <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prevState) => ({
                ...prevState,
                title: value,
              }))
              }
            />

              <div className="flex items-center gap-4">
                <button 
                className="btn-small-light"
                onClick={() => setOpenThemeSelector(true)}>
                  <LuPalette className="text-[16px]" />
                  <span className="hidden md:block">Cambiar Tema</span>
              </button>




                <button className="btn-small-light" onClick={handleDeleteResume}>
                    <LuTrash2 className="text-[16px]" />
                    <span className="hidden md:block">Borrar</span>
                 
                </button>


                  <button 
                    className="btn-small-light"
                    onClick={() => setOpenPreviewModal(true)}>

                  <LuDownload className="text-[16px]" />
                  <span className="hidden md:block">Vista Previa y Descarga</span> 
                  </button>
              </div> {/* Botones de  Descarga, borrado y vista previa*/}

              
           </div>


           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">


                <StepProgress progress={progress} />


                {renderForm()}


          <div className="mx-5">
                          {errorMsg && (
                            <div className="flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded">
                              <LuCircleAlert className="text-md" /> {errorMsg}
                            </div>
                          )}


                          <div className="flex items-end justify-end gap-3 mt-3 mb-5">
                            <button 
                              className="btn-small-light"
                              onClick={goBack}
                              disabled={isLoading}>

                              <LuArrowLeft className="text-[16px]" />
                              Volver
                            </button>
                            
                            <button
                              className="btn-small-light"
                              onClick={uploadResumeImages}
                              disabled={isLoading}
                              >
                                <LuSave className="text-[16px]"/>
                                {isLoading ? "Actualizando": "Guardar y Salir"}
                            </button>

                            <button 
                            className="btn-small"
                            onClick={validateAndNext}
                            disabled={isLoading}
                            >
                              {currentPage === "additionalInfo" && (
                                <LuDownload className="text-[16px]"/>
                              )}

                              {currentPage === "additionalInfo"
                              ? "Vista previa y Descarga": "Siguiente"}
                              {currentPage !== "additionalInfo" && (
                                <LuArrowLeft className="text-[16px] rotate-180" />
                              )}
                            </button>
                          </div>
                        </div>
                    </div>
                 




              


            <div ref={resumeRef} className="h-[100vh]">
                    {/* Resume Template */}
            </div>
          </div>
        </div> 
    </DashboardLayout>
  );
};

export {EditResume}