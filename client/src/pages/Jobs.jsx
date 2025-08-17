import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import moment from 'moment';
import Logo from '../components/Logo';
import { capitalizeFirst } from '../utils/helper';

// Componente para la barra de búsqueda y filtros
const SearchAndFilters = ({ searchTerm, setSearchTerm, filters, setFilters }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por título o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#32baa5] focus:border-transparent"
                />
            </div>
            <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Ubicación..."
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#32baa5] focus:border-transparent"
                />
            </div>
            <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#32baa5] focus:border-transparent appearance-none"
                >
                    <option value="all">Todos los tipos</option>
                    <option value="full-time">Tiempo Completo</option>
                    <option value="part-time">Medio Tiempo</option>
                    <option value="contract">Contrato</option>
                </select>
            </div>
            <button
                className="bg-[#32baa5] text-white py-3 px-6 rounded-lg hover:bg-[#32baa5]/90 transition-colors"
            >
                Buscar
            </button>
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

// Componente para mostrar una publicación individual
const JobCard = ({ job, onApply }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <div className="flex items-center text-gray-600 mb-4">
                    <FiMapPin className="mr-2" />
                    {job.location}
                </div>
                <JobTags type={job.type} salary={job.salary} />
                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Requisitos:</h3>
                    <p className="text-gray-700 line-clamp-2">{job.requirements}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Publicado el {moment(job.createdAt).format('DD/MM/YYYY')}
                    </p>
                    <button
                        onClick={() => onApply(job._id)}
                        className="bg-[#32baa5] text-white px-6 py-2 rounded-lg hover:bg-[#32baa5]/90 transition-colors"
                    >
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Componente principal de la página
const Jobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: 'all',
        location: ''
    });

    const fetchJobs = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.EMPLOYER.GET_JOBS);
            const jobsData = Array.isArray(response.data) ? response.data : [];
            setJobs(jobsData);
        } catch (error) {
            setError('Error al cargar las publicaciones');
            console.error('Error:', error);
            setJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        if (!job) return false;
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filters.type === 'all' || job.type === filters.type;
        const matchesLocation = !filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase());
        
        return matchesSearch && matchesType && matchesLocation;
    });

    const handleApply = (jobId) => {
        // Aquí implementaremos la lógica para aplicar al trabajo
        console.log('Aplicando al trabajo:', jobId);
    };

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#32baa5]"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50">
            <div className="text-red-500 text-center p-4">{error}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                            <Logo size={50} className="mr-2" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="bg-[#32baa5] text-white px-6 py-2 rounded-lg hover:bg-[#32baa5]/90 transition-colors cursor-pointer"
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-center">{capitalizeFirst('encuentra tu próximo trabajo')}</h1>
                    
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
                                    onApply={handleApply}
                                />
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Jobs; 