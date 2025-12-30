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

  // Function to check and set user from localStorage
  const checkUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Check if user is logged in from localStorage on initial load
    checkUser();

    // Listen for storage events (login/logout from other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        checkUser();
      }
    };

    // Custom event for login/logout within same tab
    const handleAuthChange = () => {
      checkUser();
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-auth-change", handleAuthChange);

    setLoading(false);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-auth-change", handleAuthChange);
    };
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
          // Dispatch custom event for same tab
          window.dispatchEvent(new Event("user-auth-change"));
          resolve(adminUser);
        } else if (email === "test@example.com" && password === "password123") {
          const normalUser = {
            id: 2,
            email: "test@example.com",
            name: "Test User",
            role: "user",
            avatar: "👤",
          };
          setUser(normalUser);
          localStorage.setItem("user", JSON.stringify(normalUser));
          window.dispatchEvent(new Event("user-auth-change"));
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
    // Dispatch custom event for same tab
    window.dispatchEvent(new Event("user-auth-change"));
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("user-auth-change"));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
