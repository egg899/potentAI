import React from 'react'
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { NavLink, useNavigate } from 'react-router-dom';
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
          <h2 className="text-lg md:text-xl font-medium text-black leading-5">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-[#32baa5] font-semibold"
                  : "text-gray-800 hover:text-[#32baa5] transition-colors"
              }
            >
              Constructor de Curriculums Vitae
            </NavLink>
          </h2>
        </div>

        <div className="flex items-center space-x-8">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? "px-4 py-2 rounded-lg bg-[#32baa5] text-white hover:bg-[#32baa5]/90 transition-colors"
                  : "text-gray-600 hover:text-[#32baa5] transition-colors"
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Enlace de Trabajos destacado */}
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              isActive
                ? "px-4 py-2 rounded-lg bg-[#32baa5] text-white hover:bg-[#32baa5]/90 transition-colors"
                : "text-gray-600 hover:text-[#32baa5] transition-colors"
            }
          >
            Buscar Trabajos
          </NavLink>
        </div>

        <ProfileInfoCard />
      </div>
    </div>
  );
};

export default Navbar;
