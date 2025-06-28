import * as fs from 'fs';
import path from 'path';
import Resume from "../models/Resume.js";
import { fileURLToPath } from 'url';

// Estas 2 líneas reemplazan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Crear un curriculum
// export const createResume = async (req, res) => {
//     try {
//         const { title } = req.body;

//         const newResume = await Resume.create({
//             userId: req.user._id,
//             title,
//             profileInfo: {
//                 fullName: profileInfo?.fullName || "",
//                 designation: "",
//                 summary: "",
//                 profilePreviewUrl: ""
//             },
//             contactInfo: {
//                 email: "",
//                 phone: "",
//                 location: "",
//                 linkedin: "",
//                 github: "",
//                 website: ""
//             },
//             workExperience: [],
//             education: [],
//             skills: [],
//             projects: [],
//             certifications: [],
//             languages: [],
//             interests: []
//         });

//         res.status(201).json(newResume);
//     } catch (error) {
//         res.status(500).json({ message: "Se falló al crear el CV", error: error.message });
//     }
// };/// CreateResume

export const createResume = async (req, res) => {
  try {
    const {
      title,
      profileInfo = {},
      contactInfo = {},
      workExperience = [],
      education = [],
      skills = [],
      projects = [],
      certifications = [],
      languages = [],
      interests = [],
      jobId,
    } = req.body;

    //Verificar si ya existe un CV con el mismo titulo para este usuario
    const existingResume = await Resume.findOne({ userId: req.user._id, title  });

    if(existingResume) {
      return res.status(400).json({ message: "Ya existe un CV con ese titulo. Elegí otro por favor" });
    }//if existingResume

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      jobId,
      profileInfo: {
        fullName: profileInfo.fullName || "",
        designation: profileInfo.designation || "",
        summary: profileInfo.summary || "",
        profilePreviewUrl: profileInfo.profilePreviewUrl || ""
      },
      contactInfo: {
        email: contactInfo.email || "",
        phone: contactInfo.phone || "",
        location: contactInfo.location || "",
        linkedin: contactInfo.linkedin || "",
        github: contactInfo.github || "",
        website: contactInfo.website || ""
      },
      workExperience,
      education,
      skills,
      projects,
      certifications,
      languages,
      interests
    });

    res.status(201).json(newResume);
  } catch (error) {
    console.error("Error al crear el CV:", error);
    res.status(500).json({ message: "Se falló al crear el CV", error: error.message });
  }
};


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
       const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id }).populate('jobId');
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
                message: "CV no encontrado o no autorizado" });
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

