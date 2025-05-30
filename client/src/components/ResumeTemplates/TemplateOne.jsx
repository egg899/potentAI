import React, {useState, useRef, useEffect} from 'react';
import ContactInfo from '../ResumeSections/ContactInfo';

import { formatYearMonth } from '../../utils/helper';
import {
  LuMapPin,
  LuMail,
  LuPhone,
  LuRss,
  LuGithub,
  LuUser
} from "react-icons/lu";

import { RiLinkedinLine } from "react-icons/ri";
import EducationInfo from '../ResumeSections/EducationInfo';
import LanguageSection from '../ResumeSections/LanguageSection';
import WorkExperience from '../ResumeSections/WorkExperience';
import ProjectInfo from '../ResumeSections/ProjectInfo';
import SkillSection from '../ResumeSections/SkillSection';
import CertificationInfo from '../ResumeSections/CertificationInfo';

const DEFAULT_THEME = ["#EBFDFF", "#A1F4F0", "#CEFAFE", "#0288C8", "#4A5565"];

const Title = ({  text, color }) => {
    return (
        <div className="relative w-fit mb-2.5">
            <span 
            className="absolute bottom-0 left-0 w-full h-2"
            style={{ backgroundColor: color }}>
            </span>
        <h2 className={'relative text-sm font-bold'}>{text}</h2>
        </div>
    )


}

const TemplateOne = ({
    resumeData,
    colorPalette,
    containerWidth,
}) => {
    const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
    
    const resumeRef = useRef(null);
    const  [baseWidth, setBaseWidth] = useState(800);
    const [scale, setScale] = useState(1);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        //Calcular la escala el facto basada en el ancho del contenedor
        
        const actualBaseWidth = resumeRef.current.offsetWidth;
        setBaseWidth(actualBaseWidth);
        setScale(containerWidth / baseWidth);
    }, [containerWidth]);

   
useEffect(() => {
  const img = resumeData.profileInfo?.profileImg;

  if (!img) {
    setImageUrl(null);
    return;
  }

  if (typeof img === "string") {
    // Es una URL válida (por ejemplo, de Mongo o Cloudinary)
    setImageUrl(img);
  } else if (img instanceof File) {
    // Es un archivo cargado manualmente
    const url = URL.createObjectURL(img);
    setImageUrl(url);

    // Limpieza cuando el componente se desmonta o la imagen cambia
    return () => URL.revokeObjectURL(url);
  } else if (img?.data && Array.isArray(img.data)) {
    // Caso Mongo con buffer (img = { data: [Uint8Array], contentType: 'image/jpeg' })
    const blob = new Blob([new Uint8Array(img.data)], { type: img.contentType });
    const url = URL.createObjectURL(blob);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }
}, [resumeData.profileInfo]);


  return (
    
    <div
      ref={resumeRef}
      className="p-3 bg-white"
      style={{ 
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin : "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        height: "auto",
       }}
    >
        <div className="grid grid-cols-12 gap-8">
            <div 
                className="col-span-4 py-10"
                style={{ backgroundColor : themeColors[0] }}
            >
                <div className="flex flex-col items-center px-2">
                    <div 
                        className="w-[100px] h-[100px] max-w-[110px] max-h-[110px] rounded-full flex items-center justify-center"
                        style={{ backgroundColor : themeColors[1] }}>
                          { console.log('la imagen',imageUrl)}
                         
                            {imageUrl ? (
                               
                                <img 
                                    src={imageUrl}
                                    className="w-[90px] h-[90px] rounded-full"/>
                                
                            ):(
                            
                            <div className="w-[90px] h-[90px] flex items-center justify-center text-5xl rounded-full"
                                style={{ color: themeColors[4] }}>
                                    <LuUser/>
                            </div>)}

                            {/* {resumeData.profileInfo.profilePreviewUrl ? (
                               
                                <img 
                                    src={resumeData.profileInfo.profilePreviewUrl}
                                    className="w-[90px] h-[90px] rounded-full"/>
                                
                            ):(
                            
                            <div className="w-[90px] h-[90px] flex items-center justify-center text-5xl rounded-full"
                                style={{ color: themeColors[4] }}>
                                    <LuUser/>
                            </div>

                            
                            
                            )} */}

                            </div>
                            <h2 className="text-xl font-bold mt-3">
                                {resumeData.profileInfo.fullName}
                            </h2>
                            <p className="text-sm text-center">
                                {resumeData.profileInfo.designation}
                            </p> 
                            </div>

                       <div className="my-6 mx-6">
                            <div className="flex flex-col gap-4">
                                <ContactInfo
                                  icon={<LuMapPin />}
                                  iconBG={themeColors[2]}
                                  value={resumeData.contactInfo.location}
                                />
                            

                             <ContactInfo
                                  icon={<LuMail />}
                                  iconBG={themeColors[2]}
                                  value={resumeData.contactInfo.email}
                                />

                                 <ContactInfo
                                  icon={<LuPhone />}
                                  iconBG={themeColors[2]}
                                  value={resumeData.contactInfo.phone}
                                />

                               {resumeData.contactInfo.linkedin && (

                                  <ContactInfo
                                  icon={<RiLinkedinLine />}
                                  iconBG={themeColors[2]}
                                  value={resumeData.contactInfo.linkedin}
                                />

                               )}


                               {resumeData.contactInfo.github && (

                                  <ContactInfo
                                  icon={<LuGithub />}
                                  iconBG={themeColors[2]}
                                  value={resumeData.contactInfo.github}
                                />

                               )}


                               {resumeData.contactInfo.website && (

                                  <ContactInfo
                                  icon={<LuRss />}
                                  iconBG={themeColors[2]}
                                  value={resumeData.contactInfo.website}
                                />

                               )}







                                
                            </div>

                        <div className="mt-5">
                            <Title text="Education" color={themeColors[1]}/>

                            {resumeData.education.map((data, index) => {
                                // {console.log('Template Education: ',data)}
                                return (
                                <EducationInfo
                                  key={`education_${index}`}
                                  degree={data.degree}
                                  institution={data.institution}
                                  duration={`${formatYearMonth(
                                    data.startDate)} - ${formatYearMonth(data.endDate)}`}
                                />
                                  )
                            })}
                        </div>

                            <div className="mt-5">
                              <Title text="Languages" color={themeColors[1]}/>

                              <LanguageSection
                                languages={resumeData.languages}
                                accentColor={themeColors[3]}
                                bgColor={themeColors[2]}
                              />
                            </div>

                     </div>   
                </div>
                      <div className="col-span-8 pt-10 mr-10 pb-5">
                        <div>
                           {/* {console.log('Descripcion: ',resumeData.profileInfo)} */}
                          <Title text="Descripción Profesional" color={themeColors[1]}/>
                            <p className="text-sm font-medium">
                              {resumeData.profileInfo.summary}
                            </p>
                        </div>
                       <div className="mt-4">
                            <Title text="Experiencia Laboral" color={themeColors[1]}/>
                            {resumeData.workExperience.map((data, index) =>(
                              <WorkExperience
                                key={`work_${index}`}
                                company={data.company}
                                role={data.role}
                                duration={`${formatYearMonth(
                                    data.startDate
                                  )} - ${data.endDate && data.endDate !=="Present" && data.endDate !== "Presente" ? formatYearMonth(data.endDate): "Presente"}`}
                                  durtionColor={themeColors[4]}
                                  description={data.description}

                                />
                            ))}
                      
                      </div>
                      <div className="mt-4">
    
                      <Title text="Proyectos" color={themeColors[1]}/>

                        {resumeData.projects.map((project, index) =>(
                          <ProjectInfo
                         key={`projects_${index}`}
                         title={project.title}
                         description={project.description}
                         liveDemoUrl={project.liveDemo}
                         githubLink={project.github}

                         bgColor={themeColors[2]}
                      />
                        ))}
                      </div>


                         <div className="mt-4">
    
                      <Title text="Habilidades" color={themeColors[1]}/>

                          <SkillSection
                         skills={resumeData.skills}
                         accentColor={themeColors[3]}
                         bgColor={themeColors[2]}
                      />
                        
                      </div>

                          <div className="mt-4">
    
                              <Title text="Certificaciones" color={themeColors[1]}/>
                                {resumeData.certifications.map((data, index) => (
                                  <CertificationInfo
                                    key={`cert_${index}`}
                                    title={data.title}
                                    issuer={data.issuer}
                                    year={data.year}
                                    bgColor={themeColors[2]}
                                  />
                                ))}
                          
                      </div>

                         {resumeData.interests.length > 0 && resumeData.interests[0] != "" && (
                           <div className="mt-4">
                            <Title text="Intereses" color={themeColors[1]}/>
                            <div className="flex items-center flex-wrap gap-3 mt-4">
                              {resumeData.interests.map((interest, index) =>{
                                if(!interest) return null;
                                  return (
                                    <div
                                      key={`interst_${index}`}
                                      className="text-[10px] font-medium py-1 px-3 rounded-lg"
                                      style={{ backgroundColor: themeColors[2] }}>
                                          {interest}
                                      </div>
                                  );
                                    
                                  
                              })}
                            </div>
                          </div>
                         )
                         }       
                         


                      </div>

                      


            </div>
        </div>

    
  );
}

export default TemplateOne