import Resume from "../models/Resume.js";
import upload from "../middlewares/uploadMiddleware.js";
import { deleteImageFromCloudinary } from "../config/cloudinary.js";

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

            const newThumbnail = req.files.thumbnail?.[0];
            const newProfileImage = req.files.profileImage?.[0];

            // Si un nuevo thumbnail se sube, elimina el anterior de Cloudinary
            if(newThumbnail) {
                if(resume.thumbnailLink){
                    await deleteImageFromCloudinary(resume.thumbnailLink);
                }
                // La URL de Cloudinary viene en req.file.path
                resume.thumbnailLink = newThumbnail.path;
            }

            if(newProfileImage) {
                if(resume.profileInfo?.profilePreviewUrl) {
                    await deleteImageFromCloudinary(resume.profileInfo.profilePreviewUrl);
                }
                // La URL de Cloudinary viene en req.file.path
                resume.profileInfo.profilePreviewUrl = newProfileImage.path;
            }

            await resume.save();

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