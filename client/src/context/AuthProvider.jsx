import React, { useState, useCallback } from "react";
import useFetch from "../hooks/useFetch"; // Adjust the path if your useFetch hook is in a different directory
import { AuthContext } from "./AuthContext";

 const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    // You might want to also send a request to a logout endpoint on your backend
    // if you need to invalidate sessions on the server side.
    // e.g., request("/auth/logout", "POST");
    return { success: true, message: "Logged out successfully." };
  }, []);

  // const checkUserStatus = useCallback(async () => {
  //   const token = localStorage.getItem("jwtToken");
  //   if (!token) {
  //     localStorage.removeItem("jwtToken");
  //     setUser(null);
  //     setIsAuthenticated(false);
  //     return false;
  //   }

  //   try {
  //     // Assuming you have an endpoint like /auth/me that returns the current user's data
  //     // if the token is valid.
  //     const data = await request("/auth/me", "GET");
  //     if (data && data.user) {
  //       setAuthStatus(data.user, token); // Re-authenticate with the existing token
  //       return true;
  //     } else {
  //       setAuthStatus(null, null); // Token might be invalid or expired
  //       return false;
  //     }
  //   } catch (err) {
  //     console.error("Check user status error:", err);
  //     setAuthStatus(null, null); // Clear status if there's an error
  //     return false;
  //   }
  // }, [request, setAuthStatus]);

  // Effect to check user status on component mount
  // useEffect(() => {
  //   checkUserStatus();
  // }, [checkUserStatus]); // Run only once on mount

  const authContextValue = {
    user,
    isAuthenticated,
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