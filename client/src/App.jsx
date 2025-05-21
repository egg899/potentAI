import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { LandingPage, Login, SignUp, Dashboard, EditResume, ProfileInfo } from './pages'
import UserProvider from './context/userContext.jsx'
import Footer from './components/Footer';

const App = () => {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Router>
            <Routes>
              {/* Default Route */}
              <Route path="/" element={<LandingPage/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/profile" element={<ProfileInfo/>}/>
              <Route path="/signUp" element={<SignUp/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/resume/:resumeId" element={<EditResume/>}/>
            </Routes>
          </Router>

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
      </div>
    </UserProvider>
  );
};

export default App