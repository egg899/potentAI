import React, { useState, useContext } from 'react';
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { UserContext } from '../../context/userContext';



const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const {user} = useContext(UserContext);

// console.log(user)

  const navigation = [
  { name: 'Inicio', href: '/' },
  ...(user ? [{ name: 'Análisis de CV', href: `/analisis/${user._id}` }] : []),
  { name: 'Dashboard', href: '/dashboard' },
  
];
// console.log('user desde el Nav', user);
  return (
    <div className="h-auto bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-0 sticky top-0 z-30">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Logo y título */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo size={40} className="mr-2 sm:size-[60px]" />
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-medium text-black leading-5">
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

        {/* Botón hamburguesa (solo mobile) */}
        <div className="sm:hidden">
          <button
            className="text-gray-700 focus:outline-none cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Enlaces de navegación (desktop) */}
        <div className="hidden sm:flex items-center space-x-4 lg:space-x-8">
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


             {/* {user.userType === 'job_seeker' &&  (
            <NavLink
            to="/mis-aplicaciones"
            className={({ isActive }) =>
              isActive
                ? "px-4 py-2 rounded-lg bg-[#32baa5] text-white hover:bg-[#32baa5]/90 transition-colors"
                : "text-gray-600 hover:text-[#32baa5] transition-colors"
            }
          >
            Mis Aplicaciones
          </NavLink>

          )} */}

           <NavLink
            to="/mis-aplicaciones"
            className={({ isActive }) =>
              isActive
                ? "px-4 py-2 rounded-lg bg-[#32baa5] text-white hover:bg-[#32baa5]/90 transition-colors"
                : "text-gray-600 hover:text-[#32baa5] transition-colors"
            }
          >
            Mis Aplicaciones
          </NavLink>

        </div>

        {/* Perfil (siempre visible) */}
        <div className="mt-2 sm:mt-0">
          <ProfileInfoCard />
        </div>

        {/* Menú desplegable en mobile */}
        {menuOpen && (
          <div className="w-full sm:hidden mt-4 flex flex-col space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 rounded-lg bg-[#32baa5] text-white hover:bg-[#32baa5]/90 transition-colors"
                    : "block px-4 py-2 text-gray-600 hover:text-[#32baa5] transition-colors"
                }
              >
                {item.name}
              </NavLink>
            ))}

            

            <NavLink
              to="/jobs"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block px-4 py-2 rounded-lg bg-[#32baa5] text-white hover:bg-[#32baa5]/90 transition-colors"
                  : "block px-4 py-2 text-gray-600 hover:text-[#32baa5] transition-colors"
              }
            >
              Buscar Trabajos
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
