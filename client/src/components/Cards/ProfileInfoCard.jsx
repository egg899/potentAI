import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    console.log("User data in ProfileInfoCard:", user); // Debug log

    //console.log("User from context: ", user);


     const handleCTA = () => {
      
        navigate("/profile");
      
  };//handleCTA

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
            <button
                className="text-purple-500 text-sm font-semibold cursor-pointer hover:underline"
                onClick={handleCTA}
            >
                Perfil
            </button> 
            <span className="mx-2 text-gray-400">|</span>
                
                <button
                className="text-purple-500 text-sm font-semibold cursor-pointer hover:underline"
                onClick={handleLogout}
            >
                 Logout
            </button>
        </div>
    </div>
    )
  );
};


export default ProfileInfoCard;