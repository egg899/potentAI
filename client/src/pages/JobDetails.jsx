import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { FiMapPin, FiDollarSign, FiClock, FiCalendar } from 'react-icons/fi';
import moment from 'moment';
import Modal from '../components/Modal';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [userResumes, setUserResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [applyError, setApplyError] = useState('');
    const [applySuccess, setApplySuccess] = useState('');
    const [isApplying, setIsApplying] = useState(false);

console.log()
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get(`${API_PATHS.JOBS.GET_ONE}/${id}`);
                setJob(response.data);
                setError(null);
            } catch (error) {
                console.error('Error al cargar los detalles del trabajo:', error);
                setError('No se pudieron cargar los detalles del trabajo. Por favor, intenta de nuevo.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobDetails();
       
    }, [id]);
     console.log('Set Jobs: ', job);
     console.log('User: ', user);

    const handleCTA = () => {
        // alert();
        const laburo = localStorage.setItem("Laburo", JSON.stringify(job));
        navigate(`/analisis/${user._id}`);
    }//handleCTA

    // Obtener los CVs del usuario al abrir el modal
    const fetchUserResumes = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.RESUME.GET_USER_RESUMES);
            setUserResumes(res.data);
        } catch {
            setUserResumes([]);
        }
    };

    useEffect(() => {
        if (showApplyModal) fetchUserResumes();
    }, [showApplyModal]);

    const handleApply = async () => {
        if (!selectedResumeId) {
            setApplyError('Selecciona un CV para postularte.');
            return;
        }
        setIsApplying(true);
        setApplyError('');
        setApplySuccess('');
        try {
            await axiosInstance.post('/api/applications', {
                jobId: job._id,
                resumeId: selectedResumeId
            });
            setApplySuccess('¡Postulación enviada con éxito!');
            setTimeout(() => setShowApplyModal(false), 1500);
        } catch (err) {
            setApplyError(err.response?.data?.message || 'Error al postularte.');
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#32baa5]"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="text-red-500 text-center p-4">{error}</div>
            </DashboardLayout>
        );
    }

    if (!job) {
        return (
            <DashboardLayout>
                <div className="text-center p-4">Trabajo no encontrado</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/jobs')}
                    className="text-[#32baa5] hover:underline mb-6 flex items-center cursor-pointer"
                >
                    ← Volver a la lista de trabajos
                </button>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                        <div className="flex items-center text-gray-600 mb-4">
                            <FiMapPin className="mr-1" />
                            {job.location}
                        </div>
                        <div className="flex gap-4 mb-4">
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center">
                                <FiClock className="mr-1" />
                                {job.type === 'full-time' ? 'Tiempo Completo' : 
                                 job.type === 'part-time' ? 'Medio Tiempo' : 'Contrato'}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                                <FiDollarSign className="mr-1" />
                                {job.salary}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                                <FiCalendar className="mr-1" />
                                Publicado el {moment(job.createdAt).format('DD/MM/YYYY')}
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">Requisitos</h2>
                        <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">Empresa</h2>
                        <p className="text-gray-700">{job.employer?.companyName || 'Empresa no especificada'}</p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowApplyModal(true)}
                            className="bg-[#32baa5] text-white px-6 py-3 rounded-lg hover:bg-[#32baa5]/90 transition-colors cursor-pointer"
                        >
                            Aplicar Ahora
                        </button>
                    </div>
                </div>
            </div>
            <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Selecciona un CV para postularte">
                <div className="space-y-4 m-8">
                    {userResumes.length === 0 && <p>No tienes CVs guardados.</p>}
                    {userResumes.map((resume) => (
                        <div key={resume._id} className={`border p-3 rounded flex items-center gap-4 cursor-pointer hover:border-[#3cff52] hover:bg-[#eaffea] transition-colors ${selectedResumeId === resume._id ? 'border-[#3cff52] bg-[#eaffea]' : 'border-gray-200'}`} onClick={() => setSelectedResumeId(resume._id)}>
                            <span className="font-semibold">{resume.title}</span>
                            <span className="text-xs text-gray-500 ml-auto">Actualizado: {new Date(resume.updatedAt).toLocaleDateString()}</span>
                        </div>
                    ))}
                    {applyError && <p className="text-red-500 text-sm">{applyError}</p>}
                    {applySuccess && <p className="text-green-600 text-sm">{applySuccess}</p>}
                    <button
                        className="bg-[#32baa5] text-white px-4 py-2 rounded hover:bg-[#32baa5]/90 transition-colors w-full mt-2 cursor-pointer"
                        onClick={handleApply}
                        disabled={isApplying}
                    >
                        {isApplying ? 'Enviando...' : 'Confirmar Postulación'}
                    </button>
                    <button className="bg-[#32baa5] text-white px-4 py-2 rounded hover:bg-[#32baa5]/90 transition-colors w-full mt-2 cursor-pointer"
                        onClick={handleCTA}> Crear CV para esta posición </button>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default JobDetails; 