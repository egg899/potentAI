import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'; 
import HERO_IMG from '../assets/hero-img.png';
import Modal from '../components/Modal';
import { Login } from './Auth/Login';
import { SignUp } from './Auth/SignUp';
const LandingPage = () => {
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {

  };

  return (
    <div className="w-full min-h-full bg-white pb-96">
      <div className="container mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-16">
          <div className="text-xl font-bold">potentIA</div>
          <button className="bg-purple-100 text-sm font-semibold text-black px-7 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
            onClick={()=> setOpenAuthModal(true)}>
              Login / Sign Up
            </button>
            
        </header>

          {/* Hero Content */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Contruye tu{" "}
              <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] bg-center animate-text-shin">
              Curriculum Vitae sin problema
              </span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Haz un Curriculum en minutos con nuestro inteligente e intuitivo constrctor de Curriculums.
            </p>
            <button className="bg-black text-sm font-semibold text-white px-8 py-3 mb-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={handleCTA}>Empieza Aqui</button>
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
            Features That Make You Shine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-3">Easy Editing</h3>
            <p className="text-gray-600">
              Update your resume section with live preview and instant
              formatting.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-3">
              Beatiful Templates
            </h3>
            <p className="text-gray-600">
              Choose from modern, professional templates that are easy to customize.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-3">One-click Export</h3>
            <p className="text-gray-600">
              Download your resume instantly as a high-quality PDF with one click.
            </p>
          </div>

        <Modal
          isOpen={openAuthModal}
          onClose={()=>{
            setOpenAuthModal(false);
            setCurrentPage("login");
          }}
          hideHeader
        >
            <div className="">
              {currentPage === "login" && <Login setCurrentPage={setCurrentPage}/>}
              {currentPage === "signUp" && (
                <SignUp setCurrentPage={setCurrentPage}/>
              )}
            </div>



        </Modal>



          </div>
        </section>
      </div>
    </div>
      
  )
}

export {LandingPage}