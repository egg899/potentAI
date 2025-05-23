import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from "react-router-dom"; 
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext'; 
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState(null);
 // const [user, setUser] = useState("");

  //  const fetchUserInfo = async() => {
  //     try {
  //       const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
  //       console.log('Respuesta del Fetch User: ', response);
  //     }
  //     catch(error){
  //       console.error("Error para conseguir la información del usuario:", error);
  //     }
  //  }//fetchUserinfo
// console.log(API_PATHS);

console.log("API_PATHS.RESUME.GET_ALL:", API_PATHS.RESUME.GET_ALL);
  const fetchAllResumes = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setAllResumes(response.data);
    console.log('lOS resumes: ', response);
    }
    catch (error){
      console.error("Error para conseguir los CV'S", error);
    }
  };//fetchAllResumes

  useEffect(()=>{
    // fetchUserInfo();
    fetchAllResumes();
  }, []);

  useEffect(()=>{
    if(!loading) {
      // console.log("Usuario en el dashboard: ", user);
    }
  }, [user, loading]);

  return (
    <div>Dashboard</div>
  )
}

export  {Dashboard};