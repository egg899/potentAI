import * as fs from "fs";
import path from "path";
import Resume from "../models/Resume.js";
import upload from "../middlewares/uploadMiddleware.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// console.log(__dirname);
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
            const baseUrl = `${req.protocol}://${req.get("host")}`;

            const newThumbnail = req.files.thumbnail?.[0];
            const newProfileImage = req.files.profileImage?.[0];

            //Si un nuevo thumbnail se sube, borra el anterior
            if(newThumbnail) {
                if(resume.thumbnailLink){
                    const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
                    if(fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
                }
                resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
            }

            if(newProfileImage) {
                if(resume.profileInfo?.profilePreviewUrl) {
                    const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
                    if(fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
                }

                resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
            }

            await resume.save();

            res.status(200).json({
                message: "Imagen subida con éxito",
                thumbnailLink: resume.thumbnailLink,
                profilePreviewLink: resume.profileInfo.profilePreviewUrl,
            });
        });


    } catch(err){
        console.error("Error al subir las imagenes: ", err);
        res.status(500).json({messge:"Se ha fallaso al subir las imagenes", error: err.message});
    }
}