import axios from 'axios';
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { // ← CAMBIO: era "header"
        "Content-Type": "application/json", // ← CAMBIO: era "applocation/json"
        Accept: "application/json",
    },
});

// Interceptor de solicitud
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        //console.log('Token: ',accessToken);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Manejo global de errores comunes
        if (error.response) {
            if (error.response.status === 401) { // ← CAMBIO: era "error.esponse"
                window.location.href = "/"; // Redirige al login
            } else if (error.response.status === 500) {
                console.error("Error del Servidor. Por favor, vuelva a intentar después.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("La solicitud se demoró demasiado. Por favor, intente nuevamente.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
