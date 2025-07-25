import { AuthContext } from "./AuthContext";
import { useContext } from "react";
// Custom hook to use the AuthContext
 const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;