import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance';

export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    //Ingresa imagen a los datos del formulario

    formData.append('image', imageFile);

    try{
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type' : 'multipart/form-data', //Header para subir el archivo
            },
        });
        return response.data;//Devuelve la respuesta
    }
    catch (error){
        console.error('Error al subir la imagen:', error);
        throw error;//Devuelve el error
    }


};

