import React, {createContext, useContext, useState} from 'react';

// Create Context
const AppContext = createContext<any>(null);

// Create Provider
export const AppProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [team, setTeam] = useState(null);
  const [status, setStatus] = useState(null);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        team,
        setTeam,
        status,
        setStatus,
      }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useAppContext = () => useContext(AppContext);
