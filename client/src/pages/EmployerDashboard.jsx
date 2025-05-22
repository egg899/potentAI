import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import ProfileInfoCard from '../components/Cards/ProfileInfoCard';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const [jobPost, setJobPost] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        type: 'full-time' // full-time, part-time, contract
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await axiosInstance.post(API_PATHS.EMPLOYER.CREATE_JOB, jobPost);
            setSuccess('Publicación creada exitosamente');
            setJobPost({
                title: '',
                description: '',
                requirements: '',
                location: '',
                salary: '',
                type: 'full-time'
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Error al crear la publicación');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <div className="container mx-auto px-4 py-6">
                <header className="flex justify-between items-center mb-10">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}> 
                        <Logo size={60} className="mr-2" />
                    </div>
                    <ProfileInfoCard />
                </header>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Crear Nueva Publicación de Trabajo</h1>

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

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título del Puesto
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={jobPost.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3cff52] focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    name="description"
                                    value={jobPost.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3cff52] focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Requisitos
                                </label>
                                <textarea
                                    name="requirements"
                                    value={jobPost.requirements}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3cff52] focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ubicación
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={jobPost.location}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3cff52] focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Salario
                                    </label>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={jobPost.salary}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3cff52] focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Contrato
                                </label>
                                <select
                                    name="type"
                                    value={jobPost.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3cff52] focus:border-transparent"
                                    required
                                >
                                    <option value="full-time">Tiempo Completo</option>
                                    <option value="part-time">Medio Tiempo</option>
                                    <option value="contract">Contrato</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#3cff52] text-white py-2 px-4 rounded-lg hover:bg-[#3cff52]/90 transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? "CREANDO..." : "CREAR PUBLICACIÓN"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard; 