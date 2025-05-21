import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPaths';
import { uploadImage } from '../../utils/uploadImage';
import { LuCamera } from "react-icons/lu";
import ProfileInfoCard from '../../components/Cards/ProfileInfoCard';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Logo from '../../components/Logo';

const ProfileInfo = () => {
  const { user, loading, updateUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setPreview(user.profileImageUrl);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setIsEditingImage(true);
  };

  const handleEditImage = () => {
    setIsEditingImage(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsEditingImage(false);
    setEditedName(user.name);
    setProfilePic(null);
    setPreview(user.profileImageUrl);
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);

      let profileImageUrl = user.profileImageUrl;
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || profileImageUrl;
      }

      const updatedUserData = {
        ...user,
        name: editedName,
        profileImageUrl,
      };

      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, updatedUserData);
      updateUser(response.data);
      setSuccess("Perfil actualizado exitosamente");
      setIsEditing(false);
      setIsEditingImage(false);
    } catch (error) {
      setError(error.response?.data?.message || "Error al actualizar el perfil");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3cff52]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* NAVBAR */}
      <div className="container mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}> 
            <Logo size={60} className="mr-2" />
          </div>
          <ProfileInfoCard />
        </header>
      </div>
      {/* FIN NAVBAR */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Perfil de Usuario</h1>
            {!isEditing && !isEditingImage ? (
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-[#3cff52]/10 text-[#3cff52] rounded-lg hover:bg-[#3cff52]/20 transition-colors"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={handleEditImage}
                  className="px-4 py-2 bg-[#3cff52]/10 text-[#3cff52] rounded-lg hover:bg-[#3cff52]/20 transition-colors flex items-center gap-2"
                >
                  <LuCamera size={18} />
                  Cambiar Foto
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#3cff52] text-white rounded-lg hover:bg-[#3cff52]/90 transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Profile Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Profile Photo */}
            <div className="flex flex-col items-center">
              <ProfilePhotoSelector
                image={profilePic}
                setImage={setProfilePic}
                preview={preview}
                setPreview={setPreview}
                isEditing={isEditing || isEditingImage}
              />
              <p className="mt-2 text-sm text-gray-600">
                {isEditingImage ? "Haz clic para cambiar tu foto de perfil" : ""}
              </p>
            </div>

            {/* Right Column - User Information */}
            <div className="md:col-span-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Usuario
                  </label>
                  <p className="text-gray-900">
                    {user?.userType === 'job_seeker' ? 'Buscando empleo' : 'Ofreciendo empleo'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Registro
                  </label>
                  <p className="text-gray-900">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export { ProfileInfo };