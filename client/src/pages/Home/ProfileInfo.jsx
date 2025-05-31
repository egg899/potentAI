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
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setEditedName(user.name || '');
      setPreview(user.profileImageUrl || '');
      
      if (user.userType === 'job_seeker') {
        fetchUserResume();
      } else if (user.userType === 'employer') {
        fetchEmployerJobs();
      }
    }
  }, [user]);

  const fetchUserResume = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_USER_RESUMES);
      if (response.data && response.data.length > 0) {
        setResume(response.data[0]);
      }
    } catch (error) {
      console.error("Error al obtener el CV:", error);
      setError("Error al cargar el CV");
    }
  };

  const fetchEmployerJobs = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_EMPLOYER_JOBS);
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
      setError("Error al cargar las publicaciones");
    }
  };

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
    setEditedName(user?.name || '');
    setProfilePic(null);
    setPreview(user?.profileImageUrl || '');
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);

      let profileImageUrl = user?.profileImageUrl || '';
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Cargando información del usuario...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}> 
              <Logo size={160} className="mr-2" />
            </div>
            <ProfileInfoCard />
          </header>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
              <div className="bg-white shadow rounded-lg p-6">
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <h1 className="text-xl font-bold">{user?.name}</h1>
                  )}
                  
                  {user?.userType === 'job_seeker' && resume && (
                    <>
                      <p className="text-gray-700">{resume.profileInfo?.designation || "Sin cargo especificado"}</p>
                      <div className="mt-4 flex flex-wrap gap-4 justify-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate("/dashboard")}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Editar CV
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {user?.userType === 'job_seeker' && resume && (
                  <>
                    <hr className="my-6 border-t border-gray-300" />
                    <div className="flex flex-col">
                      <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Habilidades</span>
                      <ul>
                        {resume.skills?.map((skill, index) => (
                          <li key={index} className="mb-2">{skill.name}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="col-span-4 sm:col-span-9">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Perfil de Usuario</h1>
                  {!isEditing && !isEditingImage ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Editar Perfil
                      </button>
                      <button
                        onClick={handleEditImage}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <LuCamera size={18} />
                        Cambiar Foto
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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

                {user?.userType === 'job_seeker' && resume ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-4">Sobre Mí</h2>
                      <p className="text-gray-700">{resume.profileInfo?.summary || "Sin descripción"}</p>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-4">Experiencia Laboral</h2>
                      {resume.workExperience?.map((exp, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">{exp.role}</span>
                            <p>
                              <span className="text-gray-700 mr-2">en {exp.company}</span>
                              <span className="text-gray-700">{exp.startDate} - {exp.endDate}</span>
                            </p>
                          </div>
                          <p className="mt-2 text-gray-700">{exp.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-4">Educación</h2>
                      {resume.education?.map((edu, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">{edu.degree}</span>
                            <p>
                              <span className="text-gray-700 mr-2">{edu.institution}</span>
                              <span className="text-gray-700">{edu.startDate} - {edu.endDate}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : user?.userType === 'employer' ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-4">Publicaciones Activas</h2>
                      {jobs.length > 0 ? (
                        <div className="grid gap-4">
                          {jobs.map((job) => (
                            <div key={job._id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                      </svg>
                                      {job.location}
                                    </span>
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                      </svg>
                                      {job.type}
                                    </span>
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                      </svg>
                                      {job.salary}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {Array.isArray(job.requirements) ? (
                                      job.requirements.map((req, index) => (
                                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                          {req}
                                        </span>
                                      ))
                                    ) : job.requirements ? (
                                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                        {job.requirements}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => navigate(`/job-details/${job._id}`)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                  >
                                    Ver detalles
                                  </button>
                                  <button
                                    onClick={() => navigate(`/job-listings/edit/${job._id}`)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                  >
                                    Editar
                                  </button>
                                </div>
                              </div>
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                  <span>Publicado: {new Date(job.createdAt).toLocaleDateString()}</span>
                                  <span>{job.applications?.length || 0} postulantes</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600 mb-4">No hay publicaciones activas</p>
                          <button
                            onClick={() => navigate('/jobs/create')}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Crear nueva publicación
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileInfo };