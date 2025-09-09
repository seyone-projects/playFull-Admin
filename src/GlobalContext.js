import React, { createContext, useState, useContext } from 'react';

// Create a Context
const GlobalContext = createContext();

// Create a Provider Component
export const GlobalProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAppError, setAppError] = useState(false);
    const [appErrorMessage, setAppErrorMessage] = useState("");
    const [appErrorTitle, setAppErrorTitle] = useState("");
    const [appErrorMode, setAppErrorMode] = useState("");
    const [appUser, setAppUser] = useState(null);
    const [isLogoutRequest, setIsLogoutRequest] = useState(false);

  return (
    <GlobalContext.Provider value={{ isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser, setAppUser, isLogin, setIsLogin, isLogoutRequest, setIsLogoutRequest }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook for Accessing Context
export const useGlobalContext = () => useContext(GlobalContext);
