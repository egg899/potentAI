import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { LandingPage, Login, SignUp, Dashboard, EditResume } from './pages'
import UserProvider from './context/userContext.jsx'

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/login" element={<Login/>}/>
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
    </UserProvider>
  );
};

export default App