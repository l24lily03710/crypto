import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AccessLevelContext = createContext();

export const useAccessLevel = () => useContext(AccessLevelContext);

export const AccessLevelProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessLevel, setAccessLevel] = useState('Anonymous');
  const [userRole, setUserRole] = useState('anonymous');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);

        if (decoded.role || decoded.user.role) {
          setIsLoggedIn(true);
          setAccessLevel(decoded.role || decoded.user.role);
          setUserRole(decoded.role || decoded.user.role);
          console.log('Updated userRole:', decoded.role || decoded.user.role);
        } else {
          console.error('Role not found in token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole('anonymous');
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
    setUserRole('anonymous');
    setAccessLevel('Anonymous');
  };

  const setTokenMethod = newToken => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <AccessLevelContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        accessLevel,
        setAccessLevel,
        userRole,
        setUserRole,
        logout,
        setToken: setTokenMethod,
      }}
    >
      {children}
    </AccessLevelContext.Provider>
  );
};
