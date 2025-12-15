import React, {useState, useContext} from 'react';
// import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import profileImg from '../../assets/images/perfil-logo.png';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isProfilePage = location.pathname === "/profile";
    const isDashboardPage = location.pathname === "/employer/dashboard";
    const isJobsPage = location.pathname === "/jobs";

    const [isOpen, setIsOpen] = useState(false);

     const handleInicio = () => {
        navigate("/");
    };

    const handleCTA = () => {
        navigate("/profile");
    };

       const handleAnalizar = () => {
        navigate(`/analisis/${user._id}`);
    };

    const handleDashboard = (buscando = false) => {
        
        if(buscando) {
             navigate("/dashboard");
        } else {
            navigate("/employer/dashboard");
        }
    };

    const handleJobs = () => {
        navigate("/jobs");
    };

    const handleLogout = () =>{
        localStorage.clear();
        clearUser();
        navigate('/');
    };

    const getUserTypeText = (type) => {
        return type === 'job_seeker' ? 'Buscando empleo' : 'Ofreciendo empleo';
    };

    return (
        user && (
            <div className="flex items-center">
                <div>
                <img
                    src={user.profileImageUrl || profileImg }
                    alt="imagen de perfil"
                    className="w-11 h-11 bg-gray-300 rounded-full mr-3"
                    
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = profileImg;
                    }}
                    
                />
                </div>
                <div className="relative inline-block">
                    <div className="text-[15px] font-bold leading-3 flex items-center gap-1">
                        {user.name || ""}
                        
                         <button onClick={() => setIsOpen(!isOpen)}  className="focus:outline-none mt-2 text-[#32baa5] flex items-center">
                    
                            <ChevronDown
                                size={20}
                                strokeWidth={2.5}
                                className={`transition-transform duration-300 cursor-pointer ${isOpen ? "rotate-180" : ""}`}
                            />

                        </button>


                    </div>

                    <div className="text-[12px] text-gray-600">
                        {getUserTypeText(user.userType)}
                       
                    </div>

                
                    
                {/* Menú desplegable */}

                {isOpen && (
                    <div className="absolute left-0 mt-2 bg-white shadow-lg rounded p-3 z-50 min-w-[180px] flex flex-col space-y-1">
                            
                             {isProfilePage && (
                            <button
                                className="text-left text-[#32baa5] text-sm font-semibold hover:underline cursor-pointer"
                                onClick={() => {
                                setIsOpen(false);
                                handleInicio();
                                }}
                            >
                                Inicio
                            </button>
                            )}
                            {!isProfilePage && (
                            <button
                                className="text-left text-[#32baa5] text-sm font-semibold hover:underline cursor-pointer"
                                onClick={() => {
                                setIsOpen(false);
                                handleCTA();
                                }}
                            >
                                Perfil
                            </button>
                            )}

                             {user.userType === 'job_seeker' && !isJobsPage && (
                            <button
                                className="text-left text-[#32baa5] text-sm font-semibold hover:underline cursor-pointer"
                                onClick={() => {
                                setIsOpen(false);
                                handleAnalizar();
                                }}
                            >
                                Analizar CV
                            </button>
                            )}

                            {user.userType === 'job_seeker' && !isJobsPage && (
                            <button
                                className="text-left text-[#32baa5] text-sm font-semibold hover:underline cursor-pointer"
                                onClick={() => {
                                setIsOpen(false);
                                handleJobs();
                                }}
                            >
                                Buscar Trabajos
                            </button>
                            )}

                            {user.userType === 'employer' && !isDashboardPage && (
                            <button
                                className="text-left text-[#32baa5] text-sm font-semibold hover:underline cursor-pointer"
                                onClick={() => {
                                setIsOpen(false);
                                handleDashboard();
                                }}
                            >
                                Dashboard
                            </button>
                            )}

                             {user.userType === 'job_seeker' && !isDashboardPage && (
                            <button
                                className="text-left text-[#32baa5] text-sm font-semibold hover:underline cursor-pointer"
                                onClick={() => {
                                setIsOpen(false);
                                handleDashboard(true);
                                }}
                            >
                                Dashboard
                            </button>
                            )}

                            <button
                                className="text-left text-[#32baa5] text-sm font-semibold hover:underline cursor-pointer"
                                onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                                }}
                            >
                            Logout
                            </button>
                        </div>

                )}
                    
                </div>
            </div>
        )
    );
};

export default ProfileInfoCard;