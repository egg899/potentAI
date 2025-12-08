import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from '../utils/apiPaths.js';

export const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('use User debe ser usado dentro de un UserProvider');
    }
    return context;
};

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) return;

        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
                //console.log('Este es el User: ',response);
            } catch (error) {
                console.error("Usuario no autenticado", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        // Solo guardar el token si existe (no se envía en actualizaciones de perfil)
        if (userData.token) {
            localStorage.setItem("token", userData.token);
        }
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;