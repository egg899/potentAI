import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extrae el public_id de una URL de Cloudinary
 * @param {string} imageUrl - URL completa de la imagen en Cloudinary
 * @returns {string|null} - public_id completo o null si no se puede extraer
 */
export const extractPublicId = (imageUrl) => {
    if (!imageUrl) return null;
    
    try {
        // Las URLs de Cloudinary tienen formato:
        // https://res.cloudinary.com/cloud_name/image/upload/v1234567890/potentai/filename.jpg
        // o
        // https://res.cloudinary.com/cloud_name/image/upload/potentai/filename.jpg
        
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');
        
        // Buscar el índice de 'upload' en la ruta
        const uploadIndex = pathParts.findIndex(part => part === 'upload');
        if (uploadIndex === -1) return null;
        
        // El public_id está después de 'upload' (puede haber un 'v' seguido de números)
        // Tomamos todo después de 'upload' excepto el último elemento si es solo 'v' + números
        let publicIdParts = pathParts.slice(uploadIndex + 1);
        
        // Si el primer elemento después de 'upload' es 'v' + números, lo saltamos
        if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
            publicIdParts = publicIdParts.slice(1);
        }
        
        // Unir las partes y remover la extensión
        const publicIdWithExt = publicIdParts.join('/');
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // Remover extensión
        
        return publicId || null;
    } catch (error) {
        console.error('Error al extraer public_id de Cloudinary:', error);
        return null;
    }
};

/**
 * Elimina una imagen de Cloudinary usando su URL
 * @param {string} imageUrl - URL completa de la imagen en Cloudinary
 * @returns {Promise<boolean>} - true si se eliminó correctamente, false en caso contrario
 */
export const deleteImageFromCloudinary = async (imageUrl) => {
    const publicId = extractPublicId(imageUrl);
    if (!publicId) {
        console.warn('No se pudo extraer public_id de la URL:', imageUrl);
        return false;
    }
    
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    } catch (error) {
        console.error('Error al eliminar imagen de Cloudinary:', error);
        return false;
    }
};

export default cloudinary;

