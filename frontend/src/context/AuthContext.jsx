import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    console.log("🔍 AuthContext: Initializing...");
    
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    console.log("🔍 AuthContext: Token exists:", !!token);
    console.log("🔍 AuthContext: UserData exists:", !!userData);
    console.log("🔍 AuthContext: Raw userData:", userData);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("🔍 AuthContext: Parsed user:", parsedUser);
        console.log("🔍 AuthContext: User role:", parsedUser?.role);
        
        // ✅ Validate that user object has required properties
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.role) {
          setUser(parsedUser);
          console.log("✅ AuthContext: Valid user data loaded");
        } else {
          console.log("❌ AuthContext: Invalid user data - missing role or empty object");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("❌ AuthContext: Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } else {
      console.log("🔍 AuthContext: No token or userData found");
    }
    
    setLoading(false);
    console.log("🔍 AuthContext: Loading set to false");
  }, []);

  // Debug user state changes
  useEffect(() => {
    console.log("🔍 AuthContext: User state changed:", user);
    console.log("🔍 AuthContext: Loading state:", loading);
  }, [user, loading]);

  // Login API call
  const login = async (email, password) => {
    console.log("🔍 AuthContext: Login attempt for:", email);
    try {
      const response = await authAPI.login(email, password);
      console.log("🔍 AuthContext: Login response:", response);
      
      const { user, token } = response;
      
      console.log("🔍 AuthContext: Login user data:", user);
      console.log("🔍 AuthContext: Login token:", !!token);

      // Save in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update context state
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error("❌ AuthContext: Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Optional: manual login update (after login)
  const loginUpdate = (token, role) => {
    console.log("🔍 AuthContext: Manual login update - role:", role);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ role }));
    setUser({ role });
  };

  // Logout
  const logout = async () => {
    console.log("🔍 AuthContext: Logout called");
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("❌ AuthContext: Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      console.log("🔍 AuthContext: Logout complete");
    }
  };

  // Register
  const register = async (userData) => {
    console.log("🔍 AuthContext: Register attempt");
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response;

      console.log("🔍 AuthContext: Register user data:", user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error("❌ AuthContext: Register error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Password change failed",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    changePassword,
    loginUpdate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;