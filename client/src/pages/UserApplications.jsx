import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Link } from 'react-router-dom';

const UserApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadApplications = async () => {
        try {
            setLoading(true);

            const res = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS);
            setApplications(res.data);

        } catch (err) {
            console.error("Error al cargar mis aplicaciones: ", err);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const statusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-700";
            case "accepted": return "bg-green-100 text-green-700";
            case "rejected": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) return <DashboardLayout><p>Cargando...</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-5 py-10">
                
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Mis Aplicaciones
                </h1>

                {applications.length === 0 && (
                    <p className="text-gray-600">
                        Todavía no aplicaste a ningún trabajo.
                    </p>
                )}

                <div className="grid grid-cols-1 gap-5">

                    {applications.map((app) => (
                        <div 
                            key={app._id}
                            className="border border-gray-200 rounded-xl shadow-sm p-5 bg-white hover:shadow-md transition"
                        >
                            {/* Job Title */}
                            <h2 className="text-xl font-semibold text-gray-800">
                                {app.job?.title ?? "Sin título"}
                            </h2>

                            {/* Status */}
                            <span className={`inline-block px-3 py-1 mt-2 text-sm rounded-full ${statusColor(app.status)}`}>
                                {app.status ?? "sin estado"}
                            </span>

                            {/* Date */}
                            <p className="text-gray-500 text-sm mt-2">
                                Aplicado: {new Date(app.appliedAt).toLocaleDateString()}
                            </p>

                            {/* Resume */}
                            {app.resume && (
                                <p className="text-sm text-purple-600 mt-2">
                                    CV usado: {app.resume.title}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="mt-4 flex gap-3">

                                <Link
                                    to={`/job/${app.job?._id}`}
                                    className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                                >
                                    Ver Trabajo
                                </Link>

                                {app.coverLetter && (
                                    <Link
                                        to={`/cover-letter/${app._id}`}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                    >
                                        Ver Cover Letter
                                    </Link>
                                )}

                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </DashboardLayout>
    );
};

export { UserApplications };
