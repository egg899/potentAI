import React from 'react'
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

const Navbar = () => {
   const navigate = useNavigate();
  return (
    <div className="h-20 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-0 sticky top-0 z-30">
        
        <div className="container mx-auto flex items-center justify-between gap-5">
          <div className="cursor-pointer" onClick={() => navigate('/')}> 
            <Logo size={60} className="mr-2" />
          </div>
                      <h2 className="text-lg md:text-xl font-medium text-black leading-5">Constructor de Curriculums Vitae</h2>

            <Link to="/dashboard">
            </Link>

            <ProfileInfoCard/>
        </div>
    </div>
  )
}

export default Navbar;