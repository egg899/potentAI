import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isProfilePage = location.pathname === "/profile";
    const isDashboardPage = location.pathname === "/employer/dashboard";

    const handleCTA = () => {
        navigate("/profile");
    };

    const handleDashboard = () => {
        navigate("/employer/dashboard");
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
                <img
                    src={user.profileImageUrl}
                    alt="imagen de perfil"
                    className="w-11 h-11 bg-gray-300 rounded-full mr-3"
                />
                <div>
                    <div className="text-[15px] font-bold leading-3">
                        {user.name || ""}
                    </div>
                    <div className="text-[12px] text-gray-600">
                        {getUserTypeText(user.userType)}
                    </div>
                    <div className="flex items-center gap-2">
                        {!isProfilePage && (
                            <button
                                className="text-[#3cff52] text-sm font-semibold cursor-pointer hover:underline"
                                onClick={handleCTA}
                            >
                                Perfil
                            </button>
                        )}
                        {user.userType === 'employer' && !isDashboardPage && (
                            <>
                                <span className="text-gray-400">|</span>
                                <button
                                    className="text-[#3cff52] text-sm font-semibold cursor-pointer hover:underline"
                                    onClick={handleDashboard}
                                >
                                    Dashboard
                                </button>
                            </>
                        )}
                        <span className="text-gray-400">|</span>
                        <button
                            className="text-[#3cff52] text-sm font-semibold cursor-pointer hover:underline"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ProfileInfoCard;