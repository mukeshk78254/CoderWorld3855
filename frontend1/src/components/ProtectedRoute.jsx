import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    
    const intendedPath = location.pathname;
    console.log('ProtectedRoute: User not authenticated, redirecting to login for path:', intendedPath);
    return <Navigate to="/login" state={{ from: intendedPath }} replace />;
  }

  return children;
};

export default ProtectedRoute;
