import React from 'react'
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth';   
const ProtectedRoute = ({children}) => {
    const { isAuthenticated, user } = useAuth();
  return (
    <div>
      {isAuthenticated && user ? (
        children
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  )
}

export default ProtectedRoute