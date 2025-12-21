import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { FiSearch } from 'react-icons/fi';
import moment from 'moment';
import Modal from '../components/Modal';
import RenderResume from '../components/ResumeTemplates/RenderResume';
import SecondaryModal from '../components/SecondaryModal';
import CVModal from '../components/CVModal';

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
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [currentJobId, setCurrentJobId] = useState(null);


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
        setCurrentJobId(jobId);
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

    const handleUpdateApplicationStatus = async (status) => {
        if (!selectedApplication) return;
        
        setUpdatingStatus(true);
        try {
            console.log('Actualizando estado:', {
                applicationId: selectedApplication._id,
                status,
                url: API_PATHS.APPLICATIONS.UPDATE_STATUS(selectedApplication._id)
            });

            const res = await axiosInstance.patch(
                API_PATHS.APPLICATIONS.UPDATE_STATUS(selectedApplication._id),
                { status }
            );
            
            console.log('Respuesta del servidor:', res.data);
            
            // Actualizar la aplicación seleccionada
            setSelectedApplication(res.data.application);
            
            // Actualizar la lista de aplicaciones
            const updatedApplications = applications.map(app => 
                app._id === selectedApplication._id 
                    ? { ...app, status: status }
                    : app
            );
            setApplications(updatedApplications);
            
        } catch (error) {
            console.error('Error completo al actualizar el estado:', error);
            console.error('Detalles del error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText
            });
            
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.error 
                || error.message 
                || 'Error del servidor';
            
            alert(`Error al actualizar el estado: ${errorMessage}`);
        } finally {
            setUpdatingStatus(false);
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
                <div className="w-full mt-10">
                    {loadingApplications && (
                        <div className="flex justify-center items-center py-12">
                            <p className="text-gray-600">Cargando postulaciones...</p>
                        </div>
                    )}
                    {errorApplications && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {errorApplications}
                        </div>
                    )}
                    {!loadingApplications && applications.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p>No hay postulaciones para este trabajo.</p>
                        </div>
                    )}
                    <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                        {applications.map((app) => (
                            <div 
                                key={app._id} 
                                className="relative bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Badge de estado en la esquina superior derecha */}
                                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                                    app.status === 'accepted' 
                                        ? 'bg-green-50 text-green-700 border border-green-200' 
                                        : app.status === 'rejected'
                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                }`}>
                                    {app.status === 'accepted' 
                                        ? 'Aceptado' 
                                        : app.status === 'rejected'
                                        ? 'Rechazado'
                                        : 'Pendiente'}
                                </span>

                                {/* Información del postulante */}
                                <div className="pr-24 ">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        {app.applicant?.name || app.applicant?.email || 'Usuario'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Postulado el {moment(app.appliedAt).format('DD/MM/YYYY')}
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                        CV: <span className="text-gray-900">{app.resume?.title || 'Sin título'}</span>
                                    </p>
                                </div>

                                {/* Botón de acción */}
                                <div className="mt-4">
                                    <button
                                        className="w-full px-4 py-2.5 bg-[#32baa5] text-white rounded-lg font-medium hover:bg-[#2aa894] transition-colors cursor-pointer shadow-sm hover:shadow-md"
                                        onClick={() => { 
                                            setSelectedResume(app.resume); 
                                            setSelectedApplication(app);
                                            setShowResumeModal(true); 
                                        }}
                                    >
                                        Ver CV y Postulación
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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
            <CVModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} title={selectedResume?.title || 'CV'} hideHeader={true}>
                <div className="relative w-full bg-white" style={{ overflowX: 'hidden' }}>
                    {/* Área del CV sin scroll propio - el scroll está en el Modal */}
                    <div className="flex justify-center w-full py-4" style={{ overflowX: 'hidden', maxWidth: '100%' }}>
                        {selectedResume && (
                            <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
                                <RenderResume
                                    templateId={selectedResume.template?.theme || '01'}
                                    resumeData={selectedResume}
                                    colorPalette={selectedResume.template?.colorPalette || ['#EBFDFF', '#A1F4F0', '#CEFAFE', '#0288C8', '#4A5565']}
                                    containerWidth={Math.min(window.innerWidth - 160, 900)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sección de información de la postulación */}
                    {selectedApplication && (
                        <div className="border-t border-gray-200 bg-white px-6 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Estado actual</p>
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            selectedApplication.status === 'accepted' 
                                                ? 'bg-green-50 text-green-700' 
                                                : selectedApplication.status === 'rejected'
                                                ? 'bg-red-50 text-red-700'
                                                : 'bg-yellow-50 text-yellow-700'
                                        }`}>
                                            {selectedApplication.status === 'accepted' 
                                                ? 'Aceptado' 
                                                : selectedApplication.status === 'rejected'
                                                ? 'Rechazado'
                                                : 'Pendiente'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Fecha de postulación</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {moment(selectedApplication.appliedAt).format('DD/MM/YYYY')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleUpdateApplicationStatus('accepted')}
                                    disabled={updatingStatus || selectedApplication.status === 'accepted'}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                        selectedApplication.status === 'accepted'
                                            ? 'bg-[#32baa5] text-white cursor-not-allowed opacity-50'
                                            : 'bg-[#32baa5] text-white hover:bg-[#2aa894] cursor-pointer'
                                    } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {updatingStatus ? 'Actualizando...' : 'Aceptar'}
                                </button>
                                <button
                                    onClick={() => handleUpdateApplicationStatus('rejected')}
                                    disabled={updatingStatus || selectedApplication.status === 'rejected'}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                        selectedApplication.status === 'rejected'
                                            ? 'bg-gray-600 text-white cursor-not-allowed opacity-50'
                                            : 'bg-gray-600 text-white hover:bg-gray-700 cursor-pointer'
                                    } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {updatingStatus ? 'Actualizando...' : 'Rechazar'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </CVModal>

        </DashboardLayout>
    );
};

export default JobListings; 