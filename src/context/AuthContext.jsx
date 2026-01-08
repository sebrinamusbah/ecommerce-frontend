import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock admin credentials
        if (email === "admin@bookstore.com" && password === "admin123") {
          const adminUser = {
            id: 1,
            email: "admin@bookstore.com",
            name: "Admin User",
            role: "admin",
            avatar: "👑",
          };
          setUser(adminUser);
          localStorage.setItem("user", JSON.stringify(adminUser));
          resolve(adminUser);
        } else if (email === "user@example.com" && password === "password123") {
          const normalUser = {
            id: 2,
            email: "user@example.com",
            name: "Normal User",
            role: "user",
            avatar: "👤",
          };
          setUser(normalUser);
          localStorage.setItem("user", JSON.stringify(normalUser));
          resolve(normalUser);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
