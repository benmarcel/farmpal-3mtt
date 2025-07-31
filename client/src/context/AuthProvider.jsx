import React, { useState, useCallback, useEffect } from "react";
import useFetch from "../hooks/useFetch"; // Adjust the path if your useFetch hook is in a different directory
import { AuthContext } from "./AuthContext";

 const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // State to manage loading status 
  const { request, loading, error } = useFetch();



  // --- Authentication Actions ---

  const login = useCallback(async (credentials) => {
    try {
      const data = await request("/auth/login", "POST", credentials);
      if (data && data.token && data.user) {
        localStorage.setItem("jwtToken", data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, message: "Login successful!" };
      } else {
        throw new Error(data?.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Ensure user is logged out on error
      localStorage.removeItem("jwtToken");
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, message: err?.message || "An unexpected error occurred during login." };
    }
  }, [request]);

  const signup = useCallback(async (userData) => {
    try {
      const data = await request("/auth/signup", "POST", userData);
      // console.log(userData);
      if (data && data.token && data.user) {
        localStorage.setItem("jwtToken", data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, message: "Signup successful! You are now logged in." };
      } else {
        throw new Error(data?.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      // Ensure user is logged out on error
      localStorage.removeItem("jwtToken");
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, message: err?.message || "An unexpected error occurred during signup." };
    }
  }, [request]);

  const logout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    setIsAuthenticated(false);
   
    return { success: true, message: "Logged out successfully." };
  }, []);

  const checkUserStatus = useCallback(async () => {
    setIsLoadingAuth(true); // Set loading state to true while checking status
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      localStorage.removeItem("jwtToken");
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false); // Set loading state to false
      return false;
    }

    try {
      // Assuming you have an endpoint like /auth/me that returns the current user's data
      // if the token is valid.
      const data = await request("/auth/me", "GET");
      if (data && data.user) {
        setUser(data.user); // Re-authenticate with the existing token
        setIsAuthenticated(true);
        console.log("User status checked successfully:", data.user);
        setIsLoadingAuth(false); // Set loading state to false
        return true;
      } else {
        setUser(null); // Token might be invalid or expired
        return false;
      }
    } catch (err) {
      console.error("Check user status error:", err);
       // Set loading state to false  
      setUser(null); // Clear status if there's an error
      return false;
    }finally {
      setIsLoadingAuth(false); // Ensure loading state is set to false after checking status
    }
  }, [request]);

  // Effect to check user status on component mount
  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]); // Run only once on mount

  const authContextValue = {
    user,
    isAuthenticated,
    isLoadingAuth,
    loading,
    error,
    login,
    signup,
    logout,
    
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;