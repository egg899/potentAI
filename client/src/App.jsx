import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { LandingPage, Login, SignUp, Dashboard, EditResume, ProfileInfo, Analisis, VerificacionCorreo, ProcesarUrl, RemoteJobs, Confirmacion } from './pages'
import UserProvider from './context/userContext.jsx'
import Footer from './components/Footer';
import ProtectedEmployerRoute from './components/ProtectedEmployerRoute';
import EmployerDashboard from './pages/EmployerDashboard';
import JobListings from './pages/JobListings';
import Jobs from './pages/Jobs';
import JobSearch from './pages/JobSearch';
import JobDetails from './pages/JobDetails';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ChatBot from './components/ChatBot/ChatBot.jsx';


const App = () => {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Router>
          <div className="flex-1">
            <Routes>
              {/* Default Route */}
              <Route path="/" element={<LandingPage/>}/>
              <Route path="/home" element={<Navigate to="/" replace />}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/profile" element={<ProfileInfo/>}/>
              <Route path="/signUp" element={<SignUp/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/resume/:resumeId" element={<EditResume/>}/>
              <Route path="/jobs/remote-jobs" element={<RemoteJobs/>} />
              <Route path="/jobs" element={<JobSearch />} />
              <Route path="/job-details/:id" element={<JobDetails />} />
              <Route path="/job-listings/edit/:id" element={<JobListings />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/analisis/:id" element={<Analisis />} />
              <Route path="/auth/verify/:token" element={<VerificacionCorreo />}/>
              <Route path="/auth/forgot-password" element={<ForgotPassword/>}/>
              <Route path="/auth/reset-password/:token" element={<ResetPassword/>}/>
              <Route path="/procesar-url" element={<ProcesarUrl/>} />
              <Route path="/confirmacion"  element={<Confirmacion />} />
              {/* Rutas protegidas para empleadores */}
              <Route 
                path="/employer/dashboard" 
                element={
                  <ProtectedEmployerRoute>
                    <EmployerDashboard />
                  </ProtectedEmployerRoute>
                }
              />
              <Route 
                path="/employer/jobs" 
                element={
                  <ProtectedEmployerRoute>
                    <JobListings />
                  </ProtectedEmployerRoute>
                }
              />
              <Route 
                path="/jobs/create" 
                element={
                  <ProtectedEmployerRoute>
                    <EmployerDashboard />
                  </ProtectedEmployerRoute>
                }
              />
            </Routes>

            <Toaster
              toastOptions={{
                className:"",
                style: {
                  fontSize: "13px",
                },
              }}
            />
          </div>
          <ChatBot/>
          <Footer />
        </Router>
      </div>
    </UserProvider>
  );
};

export default App