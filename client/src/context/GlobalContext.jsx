import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);

  return (
    <GlobalContext.Provider value={{ globalLoading, setGlobalLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
