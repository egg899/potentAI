import React, {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom'; 
import HERO_IMG from '../assets/hero-img.png';
import Modal from '../components/Modal';
import { Login } from './Auth/Login';
import { SignUp } from './Auth/SignUp';
import { UserContext } from '../context/userContext';
import ProfileInfoCard from '../components/Cards/ProfileInfoCard';
import Logo from '../components/Logo';

const LandingPage = () => {
  const {user} = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if(!user){
      setOpenAuthModal(true);
    } else{
      navigate("/dashboard");
    }
  };

  const handleCloseModal = () => {
    setOpenAuthModal(false);
    setCurrentPage("login");
  };

  return (
    <div className="w-full min-h-full bg-white">
      <div className="container mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}> 
            <Logo size={60} className="mr-2" />
          </div>
          {user ? (
            <ProfileInfoCard />
          ) : (
            <button 
              className="bg-[#3cff52]/10 text-sm font-semibold text-black px-7 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
              onClick={() => setOpenAuthModal(true)}
            >
              Ingresar / Registrarse
            </button>
          )}
        </header>
<div className="flex flex-col md:flex-row items-center">
        {/* Hero Content */}
        <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Construye tu{" "}
            <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] bg-center animate-text-shin">
              Curriculum Vitae sin problema
            </span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Haz un Curriculum en minutos con nuestro inteligente e intuitivo constrctor de Curriculums.
          </p>
          <button 
            className="bg-black text-sm font-semibold text-white px-8 py-3 mb-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={handleCTA}
          >
            Empieza Aqui
          </button>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src={HERO_IMG}
            alt="Hero Image"
            className="w-full rounded-lg"
          />
        </div>
</div>
        <section className="mt-5">
          <h2 className="text-2xl font-bold text-center mb-12">
            Características que te hacen destacar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-3">Edición fácil</h3>
              <p className="text-gray-600">
                Actualiza tu currículum con vista previa en vivo y formato instantáneo.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-3">
                Plantillas hermosas
              </h3>
              <p className="text-gray-600">
                Elige entre plantillas modernas y profesionales que son fáciles de personalizar.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-3">Exportación con un clic</h3>
              <p className="text-gray-600">
                Descarga tu currículum al instante como un PDF de alta calidad con un solo clic.
              </p>
            </div>
          </div>
        </section>

        <Modal
          isOpen={openAuthModal}
          onClose={handleCloseModal}
          hideHeader
        >
          <div className="">
            {currentPage === "login" && <Login setCurrentPage={setCurrentPage} setOpenAuthModal={setOpenAuthModal}/>}
            {currentPage === "signUp" && (
              <SignUp setCurrentPage={setCurrentPage} setOpenAuthModal={setOpenAuthModal}/>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export {LandingPage}