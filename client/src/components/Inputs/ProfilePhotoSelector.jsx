import React, { useRef, useEffect, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import profileImg from '../../assets/images/perfil-logo.png';
const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  // Inicializar con preview si existe
  const isValidPreview = preview && typeof preview === 'string' && preview.trim() !== '';
  const [localPreview, setLocalPreview] = useState(isValidPreview ? preview : null);

  // Manejar cambios en preview e image
  useEffect(() => {
    console.log('ProfilePhotoSelector - image:', image, 'preview:', preview, 'localPreview:', localPreview);
    
    // Si hay una imagen nueva (File), tiene prioridad
    if (image && image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      setLocalPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    // Si no hay imagen nueva pero hay preview válido, usar preview
    else if (!image && preview && typeof preview === 'string' && preview.trim() !== '') {
      // Corregir URLs que empiezan con "undefined"
      let correctedPreview = preview;
      if (preview.startsWith('undefined')) {
        // Reconstruir la URL con la URL base correcta
        const baseUrl = window.location.origin;
        const path = preview.replace(/^undefined/, '');
        correctedPreview = `${baseUrl}${path}`;
        console.log('Corrigiendo URL:', preview, '->', correctedPreview);
      }
      setLocalPreview(correctedPreview);
    }
    // Si no hay imagen nueva y no hay preview válido, limpiar
    else if (!image && (!preview || (typeof preview === 'string' && preview.trim() === ''))) {
      setLocalPreview(null);
    }
  }, [image, preview]);

 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file); // Guarda el File en el estado principal

    if (setPreview) {
      const objectUrl = URL.createObjectURL(file); // ← NECESARIO para que funcione en un <img>
      setPreview(objectUrl); // Actualiza la preview
    }




    
  }
};


// const handleImageChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     setImage(file); // Solo si lo necesitas localmente

//     if (setPreview) {
//       const objectUrl = URL.createObjectURL(file);
//       setPreview(objectUrl);
//     }

//     // 👇 Este paso es CLAVE: guardás el File real en resumeData
//     setResumeData((prev) => ({
//       ...prev,
//       profileInfo: {
//         ...prev.profileInfo,
//         profileImageFile: file, // El archivo real para FormData
//         profilePreviewUrl: URL.createObjectURL(file), // Opcional, si usás esto para mostrar
//       },
//     }));
//   }
// };


  const handleRemoveImage = () => {
    setImage(null);
    setLocalPreview(null);
    if (setPreview) {
      setPreview(null);
    }
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {localPreview ? (
        <div className="relative"> 
          <div className="mask-img-perfil">
          <img
            src={localPreview}
            alt="Foto de Perfil"
            className="w-20 h-20 rounded-full object-cover"
             onError={(e) => {
                e.target.onerror = null;
                e.target.src = profileImg;
                                }}
          /></div>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-primary-turquoise text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      ) : (
        <div
          className="w-20 h-20 flex items-center justify-center bg-primary-turquoise-015 rounded-full relative"
        >
          <LuUser className="text-4xl text-[#010101]" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-primary-turquoise text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
