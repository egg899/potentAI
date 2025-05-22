import React, { useRef } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if(file) {
            setImage(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
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

            {image ? (
                <div className="relative">
                    <img 
                        src={URL.createObjectURL(image)}
                        alt="Foto de Perfil"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-[#3cff52] text-white rounded-full
                        absolute -bottom-1 -right-1 cursor-pointer"
                        onClick={handleRemoveImage}
                    >
                        <LuTrash/>
                    </button>
                </div>
            ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-[#3cff52]/10 
                rounded-full relative">
                    <LuUser className="text-4xl text-[#3cff52]"/>
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-[#3cff52]
                        text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                        onClick={onChooseFile}
                    >
                        <LuUpload/>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;