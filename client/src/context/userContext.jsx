import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from '../utils/apiPaths.js';

export const UserContext = createContext();

const UserProvider =({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        if (user) return;

        const accessToken = localStorage.getItem("token");
        if(!accessToken){
            setLoading(false);
            return;
        }

        const fetchUser = async() => {
            try{
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
                //console.log('Este es el User: ',response);
            } catch(error){
                console.error("Usuario no autenticado", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };//fetchUser
        fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token); // Guarda el Token
        setLoading(false);
        };//updateUser

    
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    }//clearUser    

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};//UserProvider

export default UserProvider;