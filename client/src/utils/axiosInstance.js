import axios from 'axios';
import { BASE_URL, API_PATHS } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 100000,
    headers: { // ← CAMBIO: era "header"
        "Content-Type": "application/json", 
        Accept: "application/json",
    },
});
console.log(BASE_URL);
// Interceptor de solicitud
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
            // console.log("Enviando token en Authorization:", accessToken);

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
                // const currentPath = window.location.pathname;
                // if (!currentPath.includes('/signUp') && !currentPath.includes('/login')) {
                //     console.log("Redirigiendo a login por error 401");
                //     console.log('Current: ', API_PATHS.AUTH.LOGIN);
                //     // if(API_PATHS.AUTH.LOGIN){
                //     //     alert();
                //     // }
                //     // window.location.href = "/";
                // }

                 const requestUrl = error.config.url || "";
                    if (!requestUrl.includes(API_PATHS.AUTH.LOGIN) &&
                        !requestUrl.includes(API_PATHS.AUTH.SIGNUP)) {
                        console.log("Redirigiendo a login por error 401");
                        window.location.href = "/";
                    }
                            } 
           
                  
               
            
            
            else if (error.response.status === 500) {
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
