// AccessLevelContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode }  from "jwt-decode"; 

const AccessLevelContext = createContext();

export const useAccessLevel = () => useContext(AccessLevelContext);

export const AccessLevelProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessLevel, setAccessLevel] = useState('Anonymous');
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setAccessLevel(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
        
      }
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
