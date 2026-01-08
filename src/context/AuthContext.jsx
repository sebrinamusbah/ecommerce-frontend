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

            // Optional: Verify token by fetching fresh user data
            try {
              const response = await authService.getProfile();
              if (response.success && response.data.user) {
                setUser(response.data.user);
                localStorage.setItem(
                  "user",
                  JSON.stringify(response.data.user)
                );
              }
            } catch (err) {
              console.log("Could not fetch fresh profile, using cached data");
            }
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        authService.logout();
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

      if (response.success && response.data?.token) {
        // Auto-login after successful registration
        const loginResponse = await authService.login({
          email: userData.email,
          password: userData.password,
        });

        if (loginResponse.success && loginResponse.data?.user) {
          setUser(loginResponse.data.user);
          return loginResponse.data.user;
        }
      }

      // If no auto-login, just return success
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

  // Login function
  // In your AuthContext.js, update the login function:
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log("AuthContext: Attempting login with:", email);

      const response = await authService.login({ email, password });

      console.log("AuthContext: API Response:", response);

      // Check the correct response structure
      if (response.success && response.data?.user) {
        console.log("AuthContext: Login successful, user:", response.data.user);
        setUser(response.data.user);
        return response.data.user; // Return the user object
      } else if (response.success && response.data?.token) {
        // Alternative structure: token might be separate
        console.log("AuthContext: Alternative structure found");
        const user = response.data.user || { email, role: "user" };
        setUser(user);
        return user;
      } else {
        console.error("AuthContext: Unexpected response structure:", response);
        throw new Error(response.message || "Login failed - invalid response");
      }
    } catch (err) {
      console.error("AuthContext: Login catch error:", {
        message: err.message,
        error: err.error,
        details: err.details,
      });

      const errorMessage =
        err.error ||
        err.message ||
        err.details ||
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
    return user?.role === role;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
