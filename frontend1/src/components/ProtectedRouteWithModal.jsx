import React from 'react';
import { useSelector } from 'react-redux';
import { useAuthModal } from '../context/AuthModalContext';

const ProtectedRouteWithModal = ({ children, fallback = null }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { openAuthModal } = useAuthModal();

  if (!isAuthenticated) {
   
    React.useEffect(() => {
      openAuthModal('login', window.location.pathname);
    }, [openAuthModal]);

    return fallback;
  }

  return children;
};

export default ProtectedRouteWithModal;











