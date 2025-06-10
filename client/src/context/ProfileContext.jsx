import React, { createContext, useState, useContext, useEffect } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [selectedResume, setSelectedResumeState] = useState(null);

  // Guardar en localStorage cada vez que cambia
  useEffect(() => {
    if (selectedResume) {
      localStorage.setItem('selectedResume', JSON.stringify(selectedResume));
    }
  }, [selectedResume]);

  // Restaurar del localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem('selectedResume');
    if (stored) {
      setSelectedResumeState(JSON.parse(stored));
    }
  }, []);

  // Setter que también guarda en localStorage
  const setSelectedResume = (resume) => {
    setSelectedResumeState(resume);
    if (resume) {
      localStorage.setItem('selectedResume', JSON.stringify(resume));
    } else {
      localStorage.removeItem('selectedResume');
    }
  };

  return (
    <ProfileContext.Provider value={{ selectedResume, setSelectedResume }}>
      {children}
    </ProfileContext.Provider>
  );
}; 