import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { LandingPage, Login, SignUp, Dashboard, EditResume, ProfileInfo } from './pages'
import UserProvider from './context/userContext.jsx'
import Footer from './components/Footer';
import ProtectedEmployerRoute from './components/ProtectedEmployerRoute';
import EmployerDashboard from './pages/EmployerDashboard';

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
              
              {/* Ruta protegida para empleadores */}
              <Route 
                path="/employer/dashboard" 
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
          <Footer />
        </Router>
      </div>
    </UserProvider>
  );
};

export default App