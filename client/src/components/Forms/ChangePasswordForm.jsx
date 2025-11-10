import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ChangePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!currentPassword || !newPassword) {
            setError("Por favor completa todos los campos");
            return;
        }

        try {
            setLoading(true);
            
            // Aquí NO enviamos userId, el backend obtiene el usuario desde el token
            const response = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
                currentPassword,
                newPassword
            });

            setSuccess(response.data.message || "Contraseña cambiada correctamente");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "Error al cambiar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="br-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cambiar Contraseña</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>
            )}

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                <input
                    type="password"
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                        loading 
                        ? "bg-purple-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                >
                    {loading ? "Guardando..." : "Cambiar Contraseña"}
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
