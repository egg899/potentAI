import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from "react-router-dom"; 
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext'; 
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import  {LuCirclePlus} from 'react-icons/lu';
import moment from 'moment';
import ResumeSummaryCard from '../../components/Cards/ResumeSummaryCard';
import CreateResumeForm from './CreateResumeForm.jsx';
import Modal from '../../components/Modal.jsx';
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
    // <div>Dashboard</div>
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-7 pt-1 pb-6 md:px-0">
        <div className="h-[300px] flex flex-col gap-5 items-center justify-center bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:bg-purple-50/5 cursor-pointer" 
          onClick={()=> setOpenCreateModal(true)}>
          <div className="w-12 h-12 flex items-center justify-center bg-purple-200/60 rounded-2xl">
              <LuCirclePlus className="text-xl text-purple-500" />
          </div>

          <h3 className="font-medium text-gray-800">Adherir un CV Nuevo</h3>
        </div>
      
        {allResumes?.map((resume) => {
            return (
              <ResumeSummaryCard 
                key={resume?._id}
                imgUrl={resume?.thumbnailLink || null}
                title={resume.title}
                lastUpdated={
                  resume?.updatedAt ? moment(resume.updatedAt).format("DD MMM YYYY") : ""
                }
                onSelect={()=>navigate(`/resume/${resume?._id}`)}
              />
            );
          })}
      </div>

          <Modal 
            isOpen={openCreateModal}
            onClose={()=>{
              setOpenCreateModal(false);
            }}
            hideHeader
          >
            <div className="">
              <CreateResumeForm/>
            </div>
          </Modal>
    </DashboardLayout>
  )
}

export  {Dashboard};