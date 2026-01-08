import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/auth.service";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.isAuthenticated();
        if (token) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);

            // Verify token is still valid
            try {
              await authService.getProfile();
            } catch (profileErr) {
              console.log("Token expired, logging out");
              authService.logout();
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.register(userData);

      if (response.success && (response.token || response.data?.token)) {
        // Auto-login after successful registration
        const loginResponse = await authService.login({
          email: userData.email,
          password: userData.password,
        });

        if (loginResponse.success && loginResponse.user) {
          const user = loginResponse.user || loginResponse.data?.user;
          if (user) {
            setUser(user);
            return { success: true, user };
          }
        }
      }

      return {
        success: true,
        message: response.message || "Registration successful",
      };
    } catch (err) {
      const errorMessage =
        err.error || err.message || "Registration failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login function - SIMPLIFIED AND FIXED
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log("AuthContext: Attempting login for:", email);

      const response = await authService.login({ email, password });

      console.log("AuthContext: Login response:", response);

      // Handle different response structures
      let user = null;

      if (response.user) {
        user = response.user;
      } else if (response.data?.user) {
        user = response.data.user;
      } else if (response.success && response.data) {
        // Try to extract user from response.data
        user = response.data;
      }

      if (user) {
        console.log("AuthContext: Setting user:", user);
        setUser(user);
        return user;
      } else {
        console.error("AuthContext: No user data in response:", response);
        throw new Error(
          response.message || "Login failed - no user data received"
        );
      }
    } catch (err) {
      console.error("AuthContext: Login error:", err);
      const errorMessage =
        err.error ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.updateProfile(userData);

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (err) {
      const errorMessage =
        err.error || err.message || "Update failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.changePassword({
        currentPassword,
        newPassword,
      });

      return response;
    } catch (err) {
      const errorMessage =
        err.error || err.message || "Failed to change password.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.forgotPassword(email);
      return response;
    } catch (err) {
      const errorMessage =
        err.error || err.message || "Request failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.resetPassword(token, password);
      return response;
    } catch (err) {
      const errorMessage =
        err.error || err.message || "Reset failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && authService.isAuthenticated();
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;

    // Check multiple possible role properties
    const userRole = user.role || user.userRole || user.type || user.roleName;
    return userRole === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    if (!user) return false;

    const userRole = user.role || user.userRole || user.type || user.roleName;
    return userRole === "admin" || userRole === "administrator";
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
    isAuthenticated,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
