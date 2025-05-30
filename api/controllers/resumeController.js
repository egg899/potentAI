import * as fs from 'fs';
import path from 'path';
import Resume from "../models/Resume.js";
import { fileURLToPath } from 'url';

// Estas 2 líneas reemplazan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Crear un curriculum
export const createResume = async (req, res) => {
    try{
        const { title } = req.body;

        // Plantilla por default
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                profilepreviewUrl: null,
                // previewUrl:"",
                fullName:"",
                designation:"",
                summary:"",
            },
            contactInfo: {
                email:"",
                phone:"",
                location:"",
                linkedin:"",
                github:"",
                website:"",
            },
            workExperience: [
                {
                    company:"",
                    role:"",
                    startDate:"",
                    endDate:"",
                    description:""
                },
            ],
            education: [
                {
                    degree:"",
                    institution:"",
                    startDate:"",
                    endDate:"",
                },
            ],
            skills:[
                {
                    name: "",
                    progress: 0,
                },
            ],
            projects: [
                {
                    title:"",
                    description:"",
                    github:"",
                    liveDemo:"",
                }
            ],
            certifications: [
                {
                    title: "",
                    issuer: "",
                    year: "",
                },
        ],
        languages: [
            {
                name: "",
                progress: 0,
            },
        ],
        interests: [""],
        };//DefaultResume

        const newResume = await Resume.create ({
            userId: req.user._id,
            title,
            ...defaultResumeData,
        });

        res.status(201).json(newResume);
    } catch (error){
        res.status(500).json({ message: "Se falló al crear el CV", error: error.message});
    }
}/// CreateResume

//Ver todos los curriculums al hacer Log In
export const getUserResumes = async (req, res) => {
    try {
        console.log("Usuario en getUserResumes:", req.user);
            const resumes = await Resume.find({ userId: req.user._id}).sort({
                updatedAt:-1,
            });
            res.json(resumes);
    } catch (error) {
        res.status(500)
        .json({ message: "Se falló al conseguir los CV´s", error: error.message});

    }
};//getUserResumes

//Ver Curriculum por Id
export const getResumeById = async (req, res) => {
    try {
       const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
       if(!resume) {
        return res.status(404).json({ message:"CV no encontrado" })
       }     
       res.json(resume);
    } catch (error) {
        res.status(500)
        .json({ message: "Se falló al conseguir el CV´", error: error.message});

    }
};//getResumeById

//Actualizar un Curriculum
export const updateResume = async (req, res) => {
        try {
          const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
          });  

          if(!resume) {
            return res.status(404).json({
                message: "CV no encontrado o no autirizado" });
          }

          //Integrar actualizaciones de req.body dentro al existent
          Object.assign(resume, req.body);
                    
          // Guardar el CV actualizado
          const savedResume  = await resume.save();

          // Guardar CV actualizado
          res.json(savedResume);
            } catch (error) {
                res.status(500)
                .json({ message: "Se falló al conseguir los CV´s", error: error.message});

            }
};//UpdateResumes

//Borrar el Curriculum
export const deleteResume = async (req, res) => {
    try {
      const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });       

      if(!resume) {
        return res.status(401).json({ message: "CV no encontrado o no autorizado" });

        }
        //Borrar imagenes de thumbnailLink y profilePreviewUrl de la carpeta uploads
        const uploadsFolder = path.join(__dirname, '..', 'uploads');
        const baseUrl = `${req.protocoll}://${req.get("host")}`;
        
        if(resume.thumbnailLink){
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if(fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }

        if(resume.profileInfo?.profilePreviewUrl){
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
            if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }

        const deleted = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if(!deleted){
            return res.status(404).json({ message: "CV no encontrado o no autorizado" })
        }

      res.json({ message: "CV borrado exitosamente" });


    } catch (error) {
        res.status(500)
        .json({ message: "Se falló al conseguir el CV", error: error.message});

    }
};//deleteResume

