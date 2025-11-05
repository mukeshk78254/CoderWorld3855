import React, { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login');

  const [redirectPath, setRedirectPath] = useState(null);

  const openAuthModal = (modalMode = 'login', path = null) => {


    setMode(modalMode);
    setRedirectPath(path);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  const value = {
    isOpen,
    mode,
    redirectPath,
    openAuthModal,
    closeAuthModal
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};
