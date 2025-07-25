import { useState, useCallback } from "react";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

//  Custom hook for making API requests with JWT authentication.
//  Automatically adds Authorization header if a JWT is found in localStorage.
//  Handles 401/403 responses by clearing the token.

function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    setError(null);
    // Base configuration for request
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Retrieve JWT from localStorage and add to Authorization header if present
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Add body for appropriate HTTP methods
    if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      config.data = body;
    }

    try {
      const url = baseURL + endpoint;
      console.log(body)
      const response = await axios({
        url,
        ...config,
      });
      return response.data;
    } catch (err) {
      let errorMessage = "An unknown error occurred.";

      if (axios.isAxiosError(err) && err.response) {
        // Prioritize server-provided message
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.statusText) {
          // Use statusText if available
          errorMessage = err.response.statusText;
        } else {
          // Fallback to generic message with status code
          errorMessage = `Error: ${err.response.status}`;
        }

        // Handle 401 Unauthorized or 403 Forbidden responses specifically
        if (err.response.status === 401 || err.response.status === 403) {
          localStorage.removeItem("jwtToken"); // Clear token
          // You might want a more specific message for these cases if the server doesn't provide one
          errorMessage = err.response.data?.message || "Unauthorized. Please log in again.";
        }
      } else if (err.message) {
        // For network errors or other non-Axios errors
        errorMessage = err.message;
      }

      setError(new Error(errorMessage));
      throw new Error(errorMessage); // Re-throw the error for the caller to handle

    } finally {
      setLoading(false);
    }
  }, []);
  // useCallback dependencies: empty array means it memoizes once.

  return { request, loading, error };
}

export default useFetch;
