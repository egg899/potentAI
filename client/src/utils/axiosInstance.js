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
        console.error("Error en interceptor:", error);
        
        // Solo redirigir en errores 401 si no estamos en el proceso de registro o login
        if (error.response) {
            if (error.response.status === 401) {
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/signUp') && !currentPath.includes('/login')) {
                    console.log("Redirigiendo a login por error 401");
                    window.location.href = "/";
                }
            } else if (error.response.status === 500) {
                console.error("Error del Servidor (500):", error.response.data);
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Timeout de la solicitud:", error);
        } else {
            console.error("Error de red:", error);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
