import React, { useRef, useEffect, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(preview);

  useEffect(() => {
    // Actualizar el preview local cuando cambie el preview prop
    if (preview) {
      setLocalPreview(preview);
    }
  }, [preview]);

  useEffect(() => {
    // Manejar la imagen cuando es un archivo
    if (image && image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      setLocalPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

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
          <img
            src={localPreview}
            alt="Foto de Perfil"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-[#3cff52] text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      ) : (
        <div
          className="w-20 h-20 flex items-center justify-center bg-[#3cff52]/10 rounded-full relative"
        >
          <LuUser className="text-4xl text-[#3cff52]" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-[#3cff52] text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
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
