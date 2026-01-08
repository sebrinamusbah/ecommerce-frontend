import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock database based on your seed data
  const mockUsersDB = [
    {
      id: 1,
      email: "sebrinm9@gmail.com",
      password: "Sebrina@123",
      name: "Sebrina Musbah",
      role: "admin",
      address: "Addis Ababa, Ethiopia",
      phone: "0985673299",
    },
    {
      id: 2,
      email: "customer@example.com",
      password: "Customer@123",
      name: "Sample Customer",
      role: "user",
      address: "Addis Ababa, Ethiopia",
      phone: "0992474781",
    },
  ];

  // Initialize auth
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Simple authenticate function that works
  const authenticate = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log("Authenticating:", email);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Check against mock database
      const foundUser = mockUsersDB.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (foundUser) {
        // Create user object without password
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          token: `mock-jwt-token-${Date.now()}-${foundUser.id}`,
        };

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);

        setUser(userData);

        return {
          success: true,
          user: userData,
          isNewUser: false,
          message: "Login successful",
        };
      } else {
        // Auto-register new user
        const newUser = {
          id: Date.now(),
          email,
          name: email.split("@")[0],
          role: email.toLowerCase().includes("admin") ? "admin" : "user",
          token: `mock-jwt-token-${Date.now()}`,
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("token", newUser.token);

        setUser(newUser);

        return {
          success: true,
          user: newUser,
          isNewUser: true,
          message: "Account created and logged in",
        };
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errorMessage = "Authentication failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    return authenticate(email, password);
  };

  // Register function
  const register = async (userData) => {
    return authenticate(userData.email, userData.password);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("token");
  };

  // Check if admin
  const isAdmin = () => {
    if (!user) return false;
    const role = user.role || user.userRole || user.type;
    return role === "admin" || role === "administrator";
  };

  const value = {
    user,
    loading,
    error,
    authenticate,
    login,
    register,
    logout,
    clearError,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
