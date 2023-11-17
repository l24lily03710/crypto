import React, { createContext, useContext, useState } from 'react';

// Creating the context
const AccessLevelContext = createContext();

// Custom hook for easy access to the context
export const useAccessLevel = () => useContext(AccessLevelContext);

// Provider component
export const AccessLevelProvider = ({ children }) => {
  // State to store the access level
  const [accessLevel, setAccessLevel] = useState('Anonymous'); // default value

  // Providing the accessLevel state and the setter function to the context
  return (
    <AccessLevelContext.Provider value={{ accessLevel, setAccessLevel }}>
      {children}
    </AccessLevelContext.Provider>
  );
};
