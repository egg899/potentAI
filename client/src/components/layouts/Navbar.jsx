import React from 'react'
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
];

const Navbar = () => {
   const navigate = useNavigate();

  return (
    <div className="h-20 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-0 sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between gap-5">
            <div className="flex items-center gap-8">
                <div className="cursor-pointer" onClick={() => navigate('/')}> 
                    <Logo size={60} className="mr-2" />
                </div>
                <h2 className="text-lg md:text-xl font-medium text-black leading-5">Constructor de Curriculums Vitae</h2>
            </div>

            <div className="flex items-center space-x-8">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        className="text-gray-600 hover:text-[#3cff52] transition-colors"
                    >
                        {item.name}
                    </Link>
                ))}
                
                {/* Enlace de Trabajos destacado */}
                <Link
                    to="/jobs"
                    className="px-4 py-2 rounded-lg bg-[#3cff52] text-white hover:bg-[#3cff52]/90 transition-colors"
                >
                    Buscar Trabajos
                </Link>
            </div>

            <ProfileInfoCard/>
        </div>
    </div>
  )
}

export default Navbar;