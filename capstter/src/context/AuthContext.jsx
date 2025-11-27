// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { decodeToken, getToken, removeToken } from "../utils/token";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // decoded token payload
  const [loading, setLoading] = useState(true);

  const loadUserFromToken = useCallback(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const decoded = decodeToken();
    if (!decoded) {
      removeToken();
      setUser(null);
    } else {
      setUser(decoded); // contains user_id, role, name, etc
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromToken();

    // Listen for token changes across tabs
    window.addEventListener("storage", loadUserFromToken);
    return () => window.removeEventListener("storage", loadUserFromToken);
  }, [loadUserFromToken]);

  const login = (token) => {
    localStorage.setItem("token", token);
    loadUserFromToken();
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
