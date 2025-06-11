import React from 'react';
import ProfilePhotoSelector from "../../../components/Inputs/ProfilePhotoSelector"
import Input from "../../../components/Inputs/Input"

const ProfileInfoForm = ({profileData, updateSection}) => {
  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        Información Personal
      </h2>

      <div className="mt-4">
        <ProfilePhotoSelector
          image={profileData?.profileImg}
          setImage={(value) => updateSection("profileImg", value)}
          preview={profileData?.profilePreviewUrl}
          setPreview={(value) => updateSection("profilePreviewUrl", value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={profileData?.fullName || ""}
            onChange={({ target }) => updateSection("fullName", target.value)}
            label="Nombre Completo"
            placeholder="Ingresa tu nombre completo"
            type="text"
          />

          <Input
            value={profileData?.designation || ""}
            onChange={({ target }) => updateSection("designation", target.value)}
            label="Cargo"
            placeholder="Ingresa tu cargo actual"
            type="text"
          />

          <div className="col-span-2 mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resumen
            </label>
            <textarea
              value={profileData?.summary || ""}
              onChange={({ target }) => updateSection("summary", target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3cff52] focus:border-transparent"
              rows="4"
              placeholder="Escribe un breve resumen sobre ti y tu experiencia profesional..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoForm;