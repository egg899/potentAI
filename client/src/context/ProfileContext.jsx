import React, { createContext, useState, useContext } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [selectedResume, setSelectedResume] = useState(null);

  return (
    <ProfileContext.Provider value={{ selectedResume, setSelectedResume }}>
      {children}
    </ProfileContext.Provider>
  );
}; 