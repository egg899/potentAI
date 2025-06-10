import * as fs from "fs";
import path from "path";
import Resume from "../models/Resume.js";
import upload from "../middlewares/uploadMiddleware.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log('El dirname de uploadImages',__dirname);
export const uploadResumeImages = async (req, res) => {
    try {
        upload.fields([{name: 'thumbnail'}, {name: 'profileImage'}]) (req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "La subida del archivo falló", error: err.message });
            }

            const resumeId = req.params.id;
            const resume = await Resume.findOne({_id: resumeId, userId: req.user._id});

            if(!resume) {
                return res.status(404).json({ message: "CV no encontrado o no autorizado" });
            }

            const uploadsFolder = path.join(__dirname, '..', 'uploads');
            
            // Asegurarse de que la carpeta uploads existe
            if (!fs.existsSync(uploadsFolder)) {
                fs.mkdirSync(uploadsFolder, { recursive: true });
            }

            // Construir la URL base correctamente
            const baseUrl = process.env.NODE_ENV === 'production' 
                ? process.env.API_URL 
                : `${req.protocol}://${req.get("host")}`;

            const newThumbnail = req.files.thumbnail?.[0];
            const newProfileImage = req.files.profileImage?.[0];

            //Si un nuevo thumbnail se sube, borra el anterior
            if(newThumbnail) {
                if(resume.thumbnailLink){
                    const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
                    if(fs.existsSync(oldThumbnail)) {
                        try {
                            fs.unlinkSync(oldThumbnail);
                        } catch (error) {
                            console.error("Error al eliminar el thumbnail anterior:", error);
                        }
                    }
                }
                resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
            }

            if(newProfileImage) {
                if(resume.profileInfo?.profilePreviewUrl) {
                    const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
                    if(fs.existsSync(oldProfile)) {
                        try {
                            fs.unlinkSync(oldProfile);
                        } catch (error) {
                            console.error("Error al eliminar la imagen de perfil anterior:", error);
                        }
                    }
                }
                resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
            }

            await resume.save();

            // Verificar que los archivos existen antes de enviar la respuesta
            if (newThumbnail && !fs.existsSync(path.join(uploadsFolder, newThumbnail.filename))) {
                throw new Error('El archivo thumbnail no se guardó correctamente');
            }
            if (newProfileImage && !fs.existsSync(path.join(uploadsFolder, newProfileImage.filename))) {
                throw new Error('El archivo de perfil no se guardó correctamente');
            }

            res.status(200).json({
                message: "Imagen subida con éxito",
                thumbnailLink: resume.thumbnailLink,
                profilePreviewLink: resume.profileInfo.profilePreviewUrl,
            });
        });
    } catch(err) {
        console.error("Error al subir las imagenes: ", err);
        res.status(500).json({message: "Se ha fallado al subir las imagenes", error: err.message});
    }
}