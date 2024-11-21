// ProtectedPage.js TODO EDIT   
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedPage = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while Firebase verifies the user
  }

  if (!user) {
    return <Navigate to="/SignIn" />; // Redirect to SignIn page if not authenticated
  }

  return <>{children}</>; // Render the wrapped content if the user is authenticated
};

export default ProtectedPage;
