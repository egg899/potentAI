import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { FiMapPin, FiDollarSign, FiClock, FiCalendar } from 'react-icons/fi';
import moment from 'moment';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3cff52]"></div>
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
                    className="text-[#3cff52] hover:underline mb-6 flex items-center"
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
                            onClick={() => window.location.href = `mailto:${job.employer?.email || ''}`}
                            className="bg-[#3cff52] text-white px-6 py-3 rounded-lg hover:bg-[#3cff52]/90 transition-colors"
                        >
                            Aplicar Ahora
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobDetails; 