import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { FiSearch } from 'react-icons/fi';
import moment from 'moment';
import Modal from '../components/Modal';
import RenderResume from '../components/ResumeTemplates/RenderResume';

// Componente para la barra de búsqueda y filtros
const SearchAndFilters = ({ searchTerm, setSearchTerm, filters, setFilters }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por título o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3cff52] focus:border-transparent"
                />
            </div>
            <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3cff52] focus:border-transparent"
            >
                <option value="all">Todos los tipos</option>
                <option value="full-time">Tiempo Completo</option>
                <option value="part-time">Medio Tiempo</option>
                <option value="contract">Contrato</option>
            </select>
            <input
                type="text"
                placeholder="Filtrar por ubicación..."
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3cff52] focus:border-transparent"
            />
        </div>
    </div>
);

// Componente para mostrar las etiquetas de tipo de trabajo y salario
const JobTags = ({ type, salary }) => (
    <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            {type === 'full-time' ? 'Tiempo Completo' : 
             type === 'part-time' ? 'Medio Tiempo' : 'Contrato'}
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {salary}
        </span>
    </div>
);

// Componente para los botones de acción de cada publicación
const JobActions = ({ onEdit, onDelete }) => (
    <div className="flex gap-2">
        <button
            onClick={onEdit}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
            Editar
        </button>
        <button
            onClick={onDelete}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
            Eliminar
        </button>
    </div>
);

// Componente para mostrar una publicación individual
const JobCard = ({ job, onEdit, onDelete, onViewApplications }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-4">{job.location}</p>
                <JobTags type={job.type} salary={job.salary} />
                <p className="text-gray-700 mb-4">{job.description}</p>
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Requisitos:</h3>
                    <p className="text-gray-700">{job.requirements}</p>
                </div>
                <p className="text-sm text-gray-500">
                    Publicado el {moment(job.createdAt).format('DD/MM/YYYY')}
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <JobActions 
                    onEdit={() => onEdit(job._id)} 
                    onDelete={() => onDelete(job._id)} 
                />
                <button
                    className="bg-[#32baa5] text-white px-6 py-3 rounded-lg hover:bg-[#32baa5]/90 transition-colors cursor-pointer"
                    onClick={() => onViewApplications(job._id)}
                >
                    Postulaciones
                </button>
            </div>
        </div>
    </div>
);

// Componente principal de la página
const JobListings = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: 'all',
        location: ''
    });
    const [showApplicationsModal, setShowApplicationsModal] = useState(false);
    const [applications, setApplications] = useState([]);
    const [loadingApplications, setLoadingApplications] = useState(false);
    const [errorApplications, setErrorApplications] = useState('');
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);


    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(API_PATHS.EMPLOYER.GET_JOBS);
            
            if (response.data) {
                const jobsData = Array.isArray(response.data) ? response.data : [];
                setJobs(jobsData);
                setError(null);
            } else {
                throw new Error('No se recibieron datos del servidor');
            }
        } catch (error) {
            console.error('Error completo:', error);
            if (error.response) {
                setError('Error al cargar las publicaciones: ' + (error.response.data?.message || 'Error del servidor'));
            } else if (error.request) {
                setError('No se pudo conectar con el servidor. Por favor, intenta de nuevo.');
            } else {
                setError('Error al procesar la solicitud. Por favor, intenta de nuevo.');
            }
            setJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleEdit = (jobId) => {
        navigate(`/employer/dashboard?edit=${jobId}`);
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
            try {
                const response = await axiosInstance.delete(API_PATHS.EMPLOYER.DELETE_JOB(jobId));
                
                if (response.status === 200 || response.status === 204) {
                    setJobs(jobs.filter(job => job._id !== jobId));
                    alert('Publicación eliminada exitosamente');
                } else {
                    throw new Error('Error al eliminar la publicación');
                }
            } catch (error) {
                console.error('Error al eliminar:', error);
                if (error.response) {
                    alert('Error al eliminar la publicación: ' + (error.response.data?.message || 'Error del servidor'));
                } else if (error.request) {
                    alert('No se pudo conectar con el servidor. Por favor, intenta de nuevo.');
                } else {
                    alert('Error al procesar la solicitud. Por favor, intenta de nuevo.');
                }
            }
        }
    };

    const handleViewApplications = async (jobId) => {
        setShowApplicationsModal(true);
        setLoadingApplications(true);
        setErrorApplications('');
        try {
            const res = await axiosInstance.get(`/api/applications/job/${jobId}`);
            setApplications(res.data);
        } catch {
            setErrorApplications('Error al cargar las postulaciones');
            setApplications([]);
        } finally {
            setLoadingApplications(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        if (!job) return false;
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filters.type === 'all' || job.type === filters.type;
        const matchesLocation = !filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase());
        
        return matchesSearch && matchesType && matchesLocation;
    });

    if (isLoading) return (
        <DashboardLayout>
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        </DashboardLayout>
    );

    if (error) return (
        <DashboardLayout>
            <div className="text-red-500 text-center p-4">{error}</div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Publicaciones de Trabajo</h1>
                    <button
                        onClick={() => navigate('/employer/dashboard')}
                        className="bg-[#32baa5] text-white px-6 py-3 rounded-lg hover:bg-[#32baa5]/90 transition-colors cursor-pointer"
                    >
                        Nueva Publicación
                    </button>
                </div>

                <SearchAndFilters 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                />

                <div className="grid gap-6">
                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron publicaciones
                        </div>
                    ) : (
                        filteredJobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onViewApplications={handleViewApplications}
                            />
                        ))
                    )}
                </div>
            </div>
            <Modal isOpen={showApplicationsModal} onClose={() => setShowApplicationsModal(false)} title="Postulaciones recibidas">
                <div className="w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center">
                    {loadingApplications && <p>Cargando postulaciones...</p>}
                    {errorApplications && <p className="text-red-500">{errorApplications}</p>}
                    {!loadingApplications && applications.length === 0 && <p>No hay postulaciones para este trabajo.</p>}
                    {applications.map((app) => (
                        <div key={app._id} className="border p-3 rounded mb-5">
                            <div className="font-semibold">{app.applicant?.name || app.applicant?.email || 'Usuario'}</div>
                            <div className="text-xs text-gray-500 mb-2">Postulado el {moment(app.appliedAt).format('DD/MM/YYYY')}</div>
                            <div className="font-medium">CV: {app.resume?.title || 'Sin título'}</div>
                            <button
                                className="mt-2 px-3 py-1 bg-[#32baa5] text-white rounded hover:bg-[#32baa5]/90 cursor-pointer"
                                onClick={() => { 
                                    setSelectedResume(app.resume); 
                                    setSelectedApplication(app);
                                    setShowResumeModal(true); 
                                    
                                }}
                            >
                                Ver CV y Postulación
                            </button>

                      
                      

                        </div>
                    ))}
                </div>
            </Modal>
            
            {/* <Modal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} title={selectedResume?.title || 'CV'} hideHeader={true}>
                <div className="relative w-full flex flex-col items-center justify-center min-h-[80vh]">
                    <button
                        className="absolute top-4 right-4 z-50 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
                        onClick={() => setShowResumeModal(false)}
                        aria-label="Cerrar CV"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="w-full max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl overflow-auto bg-white rounded-lg shadow-lg p-2 md:p-6">
                        {selectedResume && (
                            <RenderResume
                                templateId={selectedResume.template?.theme || '01'}
                                resumeData={selectedResume}
                                colorPalette={selectedResume.template?.colorPalette || ['#EBFDFF', '#A1F4F0', '#CEFAFE', '#0288C8', '#4A5565']}
                                containerWidth={Math.min(window.innerWidth - 40, 900)}
                            />
                        )}
                    </div>
                </div>
            </Modal> */}
            <Modal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} title={selectedResume?.title || 'CV'} hideHeader={true}>
    <div className="relative w-full flex flex-col items-center justify-center">
        <button
            className="absolute top-4 right-4 z-50 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setShowResumeModal(false)}
            aria-label="Cerrar CV"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="w-full  max-h-[90vh] overflow-auto bg-white rounded-lg shadow-lg p-2 md:p-6">
            {selectedResume && (
                <RenderResume
                    templateId={selectedResume.template?.theme || '01'}
                    resumeData={selectedResume}
                    colorPalette={selectedResume.template?.colorPalette || ['#EBFDFF', '#A1F4F0', '#CEFAFE', '#0288C8', '#4A5565']}
                    containerWidth={Math.min(window.innerWidth * 0.6, 700)}
                />
            )}

            {selectedApplication && (
                <div className="mt-6 w-full border-t pt-4">
                <p><strong>Estado:</strong> {selectedApplication.status}</p>
                {/* <p><strong>Carta de presentación:</strong> {selectedApplication.coverLetter || "No enviada"}</p> */}
                <p><strong>Fecha de postulación:</strong> {moment(selectedApplication.appliedAt).format('DD/MM/YYYY')}</p>
                </div>
            )}
        </div>
    </div>
</Modal>

        </DashboardLayout>
    );
};

export default JobListings; 