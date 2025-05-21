import React, { useRef } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({image, setImage, preview, setPreview, isEditing}) => {
    const inputRef = useRef(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if(file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            if(setPreview) {
                setPreview(preview);
            }
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        if(setPreview) {
            setPreview(null);
        }
    };

    const onChooseFile = () => {
        if (isEditing) {
            inputRef.current.click();
        }
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

            {!preview ? (
                <div className={`w-20 h-20 flex items-center justify-center bg-[#3cff52]/10 
                rounded-full relative ${isEditing ? 'cursor-pointer' : ''}`}>
                    <LuUser className="text-4xl text-[#3cff52]"/>
                    {isEditing && (
                        <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center bg-[#3cff52]
                            text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                            onClick={onChooseFile}
                        >
                            <LuUpload/>
                        </button>
                    )}
                </div>
            ) : (
                <div className="relative">
                    <img 
                        src={preview}
                        alt="Foto de Perfil"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    {isEditing && (
                        <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center bg-[#3cff52] text-white rounded-full
                            absolute -bottom-1 -right-1 cursor-pointer"
                            onClick={handleRemoveImage}
                        >
                            <LuTrash/>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;