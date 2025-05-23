import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { FiSearch, FiFilter } from 'react-icons/fi';
import moment from 'moment';

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
const JobCard = ({ job, onEdit, onDelete }) => (
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
            <JobActions 
                onEdit={() => onEdit(job._id)} 
                onDelete={() => onDelete(job._id)} 
            />
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
    const [refreshKey, setRefreshKey] = useState(0); // Para forzar la actualización

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
    }, [refreshKey]); // Se ejecuta cuando cambia refreshKey

    const filteredJobs = jobs.filter(job => {
        if (!job) return false;
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filters.type === 'all' || job.type === filters.type;
        const matchesLocation = !filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase());
        
        return matchesSearch && matchesType && matchesLocation;
    });

    const handleDelete = async (jobId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
            try {
                const response = await axiosInstance.delete(`${API_PATHS.EMPLOYER.DELETE_JOB}/${jobId}`);
                
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

    // Función para recargar la lista
    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (isLoading) return (
        <DashboardLayout>
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3cff52]"></div>
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
                    <div className="flex gap-4">
                        <button
                            onClick={handleRefresh}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Actualizar
                        </button>
                        <button
                            onClick={() => navigate('/employer/dashboard')}
                            className="bg-[#3cff52] text-white px-6 py-2 rounded-lg hover:bg-[#3cff52]/90 transition-colors"
                        >
                            Nueva Publicación
                        </button>
                    </div>
                </div>

                <SearchAndFilters 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                />

                <div className="grid grid-cols-1 gap-6">
                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron publicaciones
                        </div>
                    ) : (
                        filteredJobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onEdit={(id) => navigate(`/edit-job/${id}`)}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobListings; 