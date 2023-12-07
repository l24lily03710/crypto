// AccessLevelContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessLevelContext = createContext();

export const useAccessLevel = () => useContext(AccessLevelContext);

export const AccessLevelProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessLevel, setAccessLevel] = useState('Anonymous');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Set access level based on the token or additional logic
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setAccessLevel('Anonymous');
    // Additional logout logic if needed
  };

  return (
    <AccessLevelContext.Provider value={{ isLoggedIn, setIsLoggedIn, accessLevel, setAccessLevel, logout }}>
      {children}
    </AccessLevelContext.Provider>
  );
};
export default AccessLevelContext ;
