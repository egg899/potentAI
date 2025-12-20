import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom"; 
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext'; 
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { LuCirclePlus } from 'react-icons/lu';
import moment from 'moment';
import ResumeSummaryCard from '../../components/Cards/ResumeSummaryCard';
import CreateResumeForm from './CreateResumeForm.jsx';
import Modal from '../../components/Modal.jsx';
import toast from 'react-hot-toast';
import RenderResume from '../../components/ResumeTemplates/RenderResume';
import { useProfile } from '../../context/ProfileContext';
import SecondaryModal from '../../components/SecondaryModal.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const { setSelectedResume } = useProfile();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState(null);

  // Animación para el grid completo
  const [showGrid, setShowGrid] = useState(false);

  // Animación de las tarjetas de resume
  const [visibleResumes, setVisibleResumes] = useState(0);

  useEffect(() => {
    // Mostrar grid con transición
    const timeout = setTimeout(() => setShowGrid(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const fetchAllResumes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setAllResumes(response.data);
    } catch (error) {
      console.error("Error para conseguir los CV'S", error);
      toast.error("Error al cargar los CVs");
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("CV eliminado exitosamente");
      fetchAllResumes();
    } catch (error) {
      console.error("Error al eliminar el CV:", error);
      toast.error("Error al eliminar el CV");
    }
  };

  useEffect(() => {
    fetchAllResumes();
    return () => {
      setAllResumes(null);
      setOpenCreateModal(false);
    };
  }, []);

  // Animación de aparición escalonada de las tarjetas
  useEffect(() => {
    if (!allResumes) return;

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setVisibleResumes(index);
      if (index >= allResumes.length) clearInterval(interval);
    }, 100); // 100ms entre cada tarjeta
    return () => clearInterval(interval);
  }, [allResumes]);

  return (
    <DashboardLayout>
      <div
        className={`grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-7 pt-1 pb-6 md:px-0
          transform transition-all duration-700 ease-out
          ${showGrid ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}
      >
        {/* ICONO ADHERIR NUEVO CV */}
        <div
          className={`h-[300px] flex flex-col gap-5 items-center justify-center bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:bg-purple-50/5 cursor-pointer transform transition-all duration-500 ease-out
            ${showGrid ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}
          onClick={() => setOpenCreateModal(true)}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-purple-200/60 rounded-2xl">
            <LuCirclePlus className="text-xl text-purple-500" />
          </div>
          <h3 className="font-medium text-gray-800">Adherir un CV Nuevo</h3>
        </div>

        {/* TARJETAS DE RESUME CON FADE-IN ESCALONADO */}
        {allResumes?.map((resume, index) => (
          <div
            key={resume._id}
            className={`transform transition-all duration-700 ease-out
              ${index < visibleResumes ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
            `}
          >
            <ResumeSummaryCard
              title={resume.title}
              lastUpdated={resume?.updatedAt ? moment(resume.updatedAt).format("DD MMM YYYY") : ""}
              onSelect={() => navigate(`/resume/${resume._id}`)}
              onDelete={() => handleDeleteResume(resume._id)}
              onSelectButtonClick={() => setSelectedResume(resume)}
            >
              <div
                style={{
                  transform: 'scale(0.25)',
                  transformOrigin: 'top left',
                  width: 800,
                  height: 1131,
                  pointerEvents: 'none',
                  overflow: 'hidden'
                }}
              >
                <RenderResume
                  templateId={resume?.template?.theme}
                  resumeData={resume}
                  colorPalette={resume?.template?.colorPalette || []}
                  containerWidth={800}
                />
              </div>
            </ResumeSummaryCard>
          </div>
        ))}
      </div>

      {/* <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <CreateResumeForm
          onSuccess={() => {
            setOpenCreateModal(false);
            fetchAllResumes();
          }}
        />
      </Modal> */}
      <SecondaryModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <CreateResumeForm
          onSuccess={() => {
            setOpenCreateModal(false);
            fetchAllResumes();
          }}
        />
      </SecondaryModal>
    </DashboardLayout>
  );
};

export { Dashboard };
