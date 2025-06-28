import React, {useState, useContext, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import HERO_IMG from '../assets/hero-img.png';
import Modal from '../components/Modal';
import { Login } from './Auth/Login';
import { SignUp } from './Auth/SignUp';
import { UserContext } from '../context/userContext';
import ProfileInfoCard from '../components/Cards/ProfileInfoCard';
import Logo from '../components/Logo';
import { capitalizeFirst } from '../utils/helper';

const LandingPage = () => {
  const {user} = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [bounce, setBounce] = useState(true);

  useEffect(() =>{
    const timer = setTimeout(() => setBounce(false), 1500); 
    return () => clearTimeout(timer);
  }, []);


  const handleCTA = () => {
    if(!user){
      setOpenAuthModal(true);
    } else{
      // navigate("/dashboard");
      
      navigate(`/analisis/${user._id}`)
    }
  };
// {console.log('user', user);}
  const handleCloseModal = () => {
    setOpenAuthModal(false);
    setCurrentPage("login");
  };

  return (
    <div className="w-full min-h-full bg-white">
      <div className="container mx-auto py-6">
        <header className="flex justify-between items-center px-8 mb-10">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}> 
            <Logo size={160} className="mr-2" />
          </div>
          {user ? (
            <ProfileInfoCard />
          ) : (
            <button 
              className="bg-primary-turquoise text-sm font-semibold text-white px-7 py-2.5 rounded-lg hover:bg-primary-black cursor-pointer"
              onClick={() => setOpenAuthModal(true)}
            >
              Ingresar / Registrarse
            </button>
          )}
        </header>
<div className="flex flex-col md:flex-row items-center px-10 py-8 bg-primary-turquoise-015 mb-10 rounded-md border-[1px] border-[#13afa4] shadow-lg">
        {/* Hero Content */}
        <div className="w-full md:w-1/2 pr-4 mb-4 md:mb-0 mb-10">
          <h1 className="text-5xl font-bold mb-6 leading-tight color-primary-black">
            {capitalizeFirst('diseñá el curriculum vitae')} {" "}
            <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#13afa4_0%,_#13afa4_100%)] bg-[length:200%_200%] bg-center animate-text-shin">
               {capitalizeFirst('que tu talento merece.')}
            </span>
          </h1>
          <p className="text-lg color-primary-black mb-8">
            Haz un Curriculum en minutos con nuestro inteligente e intuitivo constructor de Curriculums.
          </p>
          <button 
            className={`bg-[#13afa4] text-lg sm:text-xl font-bold text-white px-10 py-5 mb-6 
              rounded-xl hover:bg-gray-800 transition-all duration-300 
              transform hover:scale-105 shadow-lg cursor-pointer 
              border-4 border-white outline outline-[1.5px] outline-[#13afa4]
              ${bounce ? 'animate-bounce' : ''}`}
            onClick={handleCTA}
            >
              Empieza Aquí
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
        <section className="mt-10 px-4 py-10 mb-10">
          <h2 className="text-4xl font-bold text-center mb-12 color-primary-turquoise">
            {capitalizeFirst('características que te hacen destacar')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 text-center">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-center grid justify-items-center mb-2"><img src="../src/assets/images/edit_icon.png" alt="Icono plantilla" /></div>
              <h3 className="text-lg font-semibold mb-3">Edición fácil</h3>
              <p className="color-primary-black">
                Actualiza tu currículum con vista previa en vivo y formato instantáneo.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-center grid justify-items-center mb-2"><img src="../src/assets/images/plantillas_icon.png" alt="Icono plantilla" /></div>
              <h3 className="text-lg font-semibold mb-3">
                Plantillas hermosas
              </h3>
              <p className="text-gray-600">
                Elige entre plantillas modernas y profesionales que son fáciles de personalizar.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-center grid justify-items-center mb-2"><img src="../src/assets/images/download_icon.png" alt="icono editar" /></div>
              <h3 className="text-lg font-semibold mb-3">Exportación con un clic</h3>
              <p className="text-gray-600">
                Descarga tu currículum al instante como un PDF de alta calidad con un solo clic.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-center px-10 py-10 bg-primary-turquoise-015 mb-10 mt-10 bg-image-custom">
        <div className="w-full md:w-1/2 pr-4 mb-4 md:mb-0 mb-10">
          <h2 className="text-4xl font-bold mb-6 leading-tight color-primary-black">
            {capitalizeFirst('la confianza crece cada día')}
          </h2>
          <p className="text-lg text-gray-600 mb-8">Miles de usuarios creando currículums inteligentes, usando plantillas modernas y postulándose con éxito.</p>
          </div>
          <div className="w-full md:w-1/2">
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center grid justify-items-center mb-2">
              <img src="../src/assets/images/icon_users.png" alt="icono usuarios" />
              <h3 className="color-primary-black text-xl font-semibold text-center">+5.000</h3>
              <p className="text-sm color-primary-black">Miembros activos</p>
            </div>
            <div className="text-center grid justify-items-center mb-2">
              <img src="../src/assets/images/icon_selected.png" alt="icono usuarios" />
              <h3 className="color-primary-black text-xl font-semibold text-center">+10.000</h3>
              <p className="text-sm color-primary-black">Currículums generados</p>
            </div>
            <div className="text-center grid justify-items-center mb-2">
              <img src="../src/assets/images/icon_comunidad.png" alt="icono usuarios" />
              <h3 className="color-primary-black text-xl font-semibold text-center">+10</h3>
              <p className="text-sm color-primary-black">Plantillas disponibles</p>
            </div>
          </div>
          </div>
        </section>

        <section className="w-full px-10 py-10 mb-10 mt-10">
        <div className="w-full text-center px-10">
          <h2 className="text-4xl font-bold mb-6 leading-tight color-primary-black">
            {capitalizeFirst('conocé ')} 
             <span className="text-[#13afa4]">
                potentIA</span>
          </h2>
        <div className="w-full flex justify-center">
        <iframe width="853" height="480" src="https://www.youtube.com/embed/J5DM6qZcr70?rel=0&modestbranding=1&showinfo=0" title="Promo potentIA" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
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