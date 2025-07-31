import React from 'react'
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth';   
const ProtectedRoute = ({children}) => {
    const { isAuthenticated, user, isLoadingAuth } = useAuth();
  return (
    <>
      {isLoadingAuth ? (
        <div className='flex justify-center items-center h-screen text-3xl'>Loading...</div>
      ) : user ? (
        children
      ) : (
        <Navigate to="/login" />
      )}
    </>
  )
}

export default ProtectedRoute