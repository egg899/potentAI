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
import ContactInfoForm from './Forms/ContactInfoForm.jsx';
import WorkExperienceForm from './Forms/WorkExperienceForm.jsx';
import EducationDetailsForm from './Forms/EducationDetailsForm.jsx';
import SkillsInfoForm from './Forms/SkillsInfoForm.jsx';
import ProjectsDetailForm from './Forms/ProjectsDetailForm.jsx';
import CertificationInfoForm from './Forms/CertificationInfoForm.jsx';
import AdditionalInfoForm from './Forms/AdditionalInfoForm.jsx';
import RenderResume from '../../components/ResumeTemplates/RenderResume.jsx'; 
import { fixTailWindColors, captureElementAsImage, dataUrltoFile } from '../../utils/helper.js';
// import { captureElementAsImage } from '../../utils/helper.js';
// import { dataUrltoFile} from '../../utils/helper.js';
import Modal from '../../components/Modal.jsx';
import ThemeSelector from './ThemeSelector.jsx';
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
      profileImg:"",
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
  const validateAndNext = (e) => {
    const errors = [];

    switch (currentPage) {
      case "profile-info":
        const { fullName = "", designation = "", summary = "" } = resumeData.profileInfo || {};
        if (!fullName?.trim()) { errors.push("El nombre completo es requerido.")}
        if (!designation?.trim()) { errors.push("La designación es requerida.")}
        if (!summary?.trim()) { errors.push("El Resumen es requerido.")}
        break;

        case "contact-info":
          const { email = "", phone = "" } = resumeData.contactInfo || {};
          if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ) { errors.push("Email válido es requerido.")}
          if (!phone?.trim()) { errors.push("Teléfono de 10 dígitos es requerido.")}
          break;

        case "work-experience":
          (resumeData.workExperience || []).forEach(
            ({ company = "", role = "", startDate = "", endDate = "" }, index) => {
              if(!company?.trim()){
                errors.push(`La compañía es requerida ${index + 1}`);
              }
              if(!role?.trim()){
                errors.push(`El rol es requerido ${index + 1}`);
              }
              if(!startDate || !endDate){
                errors.push(`La fecha de inicio y finalización es requerida ${index + 1}`);
              }
            }
          );
          break;

          case "education-info":
            (resumeData.education || []).forEach(
            ({ degree = "", institution = "", startDate = "", endDate = "" }, index) => {
              if(!degree?.trim()){
                errors.push(`El título es requerido en educación ${index + 1}`);
              }
              if(!institution?.trim()){
                errors.push(`La institución es requerida en educación ${index + 1}`);
              }
              if(!startDate || !endDate){
                errors.push(`La fecha de inicio y finalización en educación es requerida ${index + 1}`);
              }
            });
          break;

          case "skills":
            (resumeData.skills || []).forEach(({ name = "", progress = 0 }, index) =>{
              if(!name?.trim()){
                errors.push(`El nombre es requerido en habilidades ${index + 1}`);
              }
              
              if(progress < 1 || progress > 100){
                errors.push(`El progreso en habilidades debe ser entre 1 y 100 ${index + 1}`);
              }
            }); 
            break;

             case "projects":
            (resumeData.projects || []).forEach(({ title = "", description = "" }, index) =>{
              if(!title?.trim()){
                errors.push(`El título es requerido en proyectos ${index + 1}`);
              }
              
              if(!description){
                errors.push(`La descripción en proyectos es requerida ${index + 1}`);
              }
            }); 
            break;

            case "certifications":
            (resumeData.certifications || []).forEach(({ title = "", issuer = "" }, index) =>{
              if(!title?.trim()){
                errors.push(`El título es requerido en certificados ${index + 1}`);
              }
              
              if(!issuer){
                errors.push(`El emisor es requerido en certificados ${index + 1}`);
              }
            }); 
            break;

            case "additionalInfo":
              if(!resumeData.languages?.length || 
                !resumeData.languages[0]?.name?.trim()
              ) {
                errors.push("Al menos un idioma es requerido");
              }

              if(!resumeData.interests?.length || 
                !resumeData.interests[0]?.trim()
              ) {
                errors.push("Al menos un interés es requerido");
              }
              break;

              default:
              break;
      }
    
      if(errors.length > 0) {
        setErrorMsg(errors.join(", "));
        return;
      }

      //Moverse al siguiente paso
      setErrorMsg("");
      goToNextStep();
  };

  //Funcion par navegar a la siguiente Pagina
  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo"
    ];

    if(currentPage === "additionalInfo") setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);
    if(currentIndex !== -1 && currentIndex < pages.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentPage(pages[nextIndex]);

        // Establecer el Progreso como porcentaje
        const percent = Math.round((nextIndex / (pages.length -1)) * 100);
        setProgress(percent);
        window.scrollTo({ top: 0, behaviour: "smooth" });
    }

  };

  //Funcion para navegar a la pagina anterior
  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo"
    ];

    if(currentPage === "profile-info") {navigate("/dashboard");}

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      // Actualiza el progreso
      const percent = Math.round((prevIndex / (pages.length -1 )) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behaviour: "smooth" });
    };

  };

  const renderForm = () => {
    
    switch (currentPage) {
      case "profile-info":
      // {console.log('ProfileInfo: ',resumeData)}  
      return (
          
          <ProfileInfoForm
            profileData={resumeData?.profileInfo || {}}
            updateSection={(key, value) => {
              updateSection("profileInfo", key, value)
            }}
            onNext={validateAndNext}
          />
        );

        case "contact-info":
          return(
            <ContactInfoForm
              contactInfo ={resumeData?.contactInfo}
              updateSection={(key, value) =>{
                updateSection("contactInfo", key, value);
              }}
            />
          );


          case "work-experience":
            return (
              <WorkExperienceForm 
                workExperience={resumeData?.workExperience}
                  updateArrayItem={(index, key, value) =>{
                    updateArrayItem("workExperience", index, key, value);
                }}
                addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
                removeArrayItem={(index) =>
                  removeArrayItem("workExperience", index)
                   }
              />

            );

          case "education-info":
            return (
              <EducationDetailsForm
                educationInfo={resumeData?.education}
                updateArrayItem={(index, key, value) => {
                  updateArrayItem('education', index, key, value);
                }}
                addArrayItem={(newItem) => addArrayItem('education', newItem)}
                removeArrayItem={(index) => removeArrayItem("education", index)}
              />
            );
            
          case "skills":
            return (
              <SkillsInfoForm 
                skillsInfo={resumeData?.skills}
                updateArrayItem={(index, key, value) =>{
                  updateArrayItem("skills", index, key, value);
                }}
                addArrayItem={(newItem) => addArrayItem("skills", newItem)}
                removeArrayItem={(index) => removeArrayItem("skills", index)}
                />
            ); 

          case "projects":
            return (
              <ProjectsDetailForm 
                projectInfo={resumeData?.projects}
                updateArrayItem={(index, key, value) => {
                  updateArrayItem("projects", index, key, value);
                }}
                addArrayItem = { (newItem) => addArrayItem("projects", newItem)}
                removeArrayItem = {(index) => removeArrayItem("projects", index)}
              />
            );  


            case "certifications":
            return (
              <CertificationInfoForm 
                certifications={resumeData?.certifications}
                updateArrayItem={(index, key, value) => {
                  updateArrayItem("certifications", index, key, value);
                }}
                addArrayItem = { (newItem) => addArrayItem("certifications", newItem)}
                removeArrayItem = {(index) => removeArrayItem("certifications", index)}
              />
            );  


          case "additionalInfo":
            return (
              <AdditionalInfoForm
                languages={resumeData?.languages}
                interests={resumeData?.interests}
                updateArrayItem={(section, index, key, value) => {
                  updateArrayItem(section, index, key, value);
                }}
                addArrayItem = { (section, newItem) => addArrayItem(section, newItem)}
                removeArrayItem = {(section, index) => 
                  removeArrayItem(section, index)}
              />
            );   

        default:
          return null;
    }
  };

  //Actualizar objetos anidados como profileInfo, contactInfo, etc.
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]:value,
          
        },
        
    }));
  };

  //Actualizar items de array como workExperience, skills, etc.
  const updateArrayItem = (section, index, key, value) => {
    setResumeData ((prev) => {
      const updatedArray = [...prev[section]];

      if(key === null) {
        updatedArray[index] = value;
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
        [key]:value,
        };
      }
      
      return {
        ...prev,
        [section] : updatedArray,
      };
    });
  };

  //Adherir item al array
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => (
      {
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  //Remover item del Array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]:updatedArray,
      };
    });
  };

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
            profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
            contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
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
  // const uploadResumeImages = async() => {
  //   try {
  //     setIsLoading(true);
      
  //     // Crear un FormData para enviar las imágenes
  //     const formData = new FormData();
      
  //     // Agregar la imagen de perfil si existe
  //     if (resumeData.profileInfo.profileImg instanceof File) {
  //       formData.append('profileImg', resumeData.profileInfo.profileImg);
  //     }

  //     // Enviar las imágenes al servidor
  //     const response = await axiosInstance.post(
  //       API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     // Actualizar el currículum con las URLs de las imágenes
  //     await updateResumeDetails(
  //       response.data.thumbnailLink,
  //       response.data.profilePreviewUrl
  //     );

  //     toast.success("Currículum guardado exitosamente");
  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.error("Error al guardar el currículum:", error);
  //     toast.error("Error al guardar el currículum");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const uploadResumeImages = async() => {
    try{
      setIsLoading(true);

      fixTailWindColors(resumeRef.current);
      const imageDataUrl = await captureElementAsImage(resumeRef.current);

      //convert base64 to file
      const thumbnailFile = dataUrltoFile (
        imageDataUrl,
        `resume-${resumeId}.png`
      );

      const profileImageFile = resumeData?.profileInfo?.profileImg || null;
      console.log('Edit Resume profieImageFile, linea 536:', profileImageFile);
      const formData = new FormData();
      if(profileImageFile) formData.append("profileImage", profileImageFile);
      if(thumbnailFile) formData.append("thumbnail", thumbnailFile);

      const uploadResponse = await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData, 
        
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      const { thumbnaLink, profilePreviewUrl } = uploadResponse.data;

      console.log("RESUME_DATA___", resumeData);

      // Llama al segundo API para actualizar la data del Resume
      await updateResumeDetails(thumbnaLink, profilePreviewUrl);
      toast.success("CV actualizado con éxito!!! ");
      navigate("/dashboard");
    }
    catch(error){
      console.error("Error al subir imágenes:", error);
      toast.error("Se ha fallado al subir la imágen");
    } finally {
      setIsLoading(false);
    }
  }

  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {
    try {
      setIsLoading(true);
      const updatedData = {
        ...resumeData,
        thumbnailLink: thumbnailLink || resumeData.thumbnailLink,
        profileInfo: {
          ...resumeData.profileInfo,
          profilePreviewUrl: profilePreviewUrl || resumeData.profileInfo.profilePreviewUrl || "",
        }
      };

      await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(resumeId),
        updatedData
      );
    } catch (error) {
      console.error("Error al actualizar los detalles del currículum:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  //Borrar Curriculum
  const handleDeleteResume = async() => {
    try {
      setIsLoading(true);
      const repsonse = await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("CV Borrado exitosamente")
      navigate('/dashboard')
    } catch(err) {
      console.error("Error al capturar la imagen", err);
    } finally {
      setIsLoading(false);
    }

  };

  // Bajar CV
  const reactToPrintln = useReactToPrint({ contentRef: resumeDownloadRef});

  //Funcion para actualizar el ancho de la base  basado en el tamaño del contenedor
  const updateBaseWidth = () => {
    if(resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

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

// useEffect(() => {
//   if (resumeId) {
//     fetchResumeDetailsById();
//   }
// }, [resumeId]);

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
                    <span className="hidden md:block">Eliminar</span>
                 
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
                              {isLoading ? "Actualizando..." : "Guardar & Salir"}
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
                              ? "Vista Previa y Descarga" : "Siguiente"}
                              {currentPage !== "additionalInfo" && (
                                <LuArrowLeft className="text-[16px] rotate-180" />
                              )}
                            </button>
                          </div>
                        </div>
                    </div>
                              {/* {console.log('RESUME-DATA: ',resumeData.profileInfo)} */}
                  {resumeData?.template && (
                    <RenderResume 
                      templateId={resumeData.template.theme}
                      resumeData={resumeData}
                      colorPalette={resumeData.template.colorPalette || []}
                      containerWidth={baseWidth}
                    />
                  )}

                 
   



              


            <div ref={resumeRef} className="h-[100vh]">
                    {/* Resume Template */}
            </div>
          </div>
        </div> 
        
        <Modal 
          isOpen={openThemeSelector}
          onClose={() => setOpenThemeSelector(false)}
          title="Cambia el Tema">
            <div className="w-[90vw] h-[80vh]">
              <ThemeSelector
                selectedTheme={resumeData?.template}
                setSelectedTheme={(value) =>{
                  setResumeData((prevState) =>({
                    ...prevState,
                    template: value || prevState.template,
                  }));
                }}
                resumeData={null}
                onClose={() => setOpenThemeSelector(false)}
              />
            </div>
          


        </Modal>

        <Modal
          isOpen={openPreviewModal}
          onClose={() => setOpenPreviewModal(false)}
          title={resumeData.title}
          showActionBtn
          actionBtnText="Download"
          actionBtnIcon={<LuDownload className="text-[16px]" />}
          onActionClick={() => reactToPrintln()}
          >
            <div ref={resumeDownloadRef} className="w-[90vw] h-[90vh]">
                <RenderResume
                  templateId={resumeData?.template?.theme || ""}
                  resuemData={resumeData}
                  colorPalette={resumeData?.template?.colorPalette || []}
                  />
            </div>
            
          </Modal>



    </DashboardLayout>
  );
};

export {EditResume}