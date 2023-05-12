import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
// eslint-disable-next-line import/extensions
import { UserContext } from '../contexts/userContext.js';

// eslint-disable-next-line react/prop-types
function PrivateRoutes({ children }) {
  const { userContextValue, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return userContextValue.userId ? children : <Navigate to="/login" />;
}

export default PrivateRoutes;
