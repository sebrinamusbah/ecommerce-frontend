import api from "./api";

const authService = {
    /**
     * Register a new user
     */
    register: async(userData) => {
        try {
            const response = await api.post("/auth/register", userData);
            return response.data;
        } catch (error) {
            throw error.response ?.data || { error: "Registration failed" };
        }
    },

    /**
     * Login user
     */
    login: async(credentials) => {
        try {
            const response = await api.post("/auth/login", credentials);

            if (response.data ?.token || response.data ?.data ?.token) {
                // Handle both response structures
                const token = response.data.token || response.data.data.token;
                const user = response.data.user || response.data.data.user;

                if (token) localStorage.setItem("token", token);
                if (user) localStorage.setItem("user", JSON.stringify(user));
            }

            return response.data;
        } catch (error) {
            console.error("Auth Service Login Error:", error.response ?.data || error);
            throw error.response ?.data || {
                error: "Login failed",
                message: "Check your credentials and try again"
            };
        }
    },

    /**
     * Get current user profile
     */
    getProfile: async() => {
        try {
            const response = await api.get("/auth/me");
            return response.data;
        } catch (error) {
            throw error.response ?.data || { error: "Failed to fetch profile" };
        }
    },

    /**
     * Update user profile
     */
    updateProfile: async(userData) => {
        try {
            const response = await api.put("/auth/profile", userData);

            if (response.data.success && response.data.data ?.user) {
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response ?.data || { error: "Failed to update profile" };
        }
    },

    /**
     * Change password
     */
    changePassword: async(passwordData) => {
        try {
            const response = await api.put("/auth/change-password", passwordData);
            return response.data;
        } catch (error) {
            throw error.response ?.data || { error: "Failed to change password" };
        }
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: () => {
        return !!localStorage.getItem("token");
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            return null;
        }
    },

    /**
     * Get auth token
     */
    getToken: () => {
        return localStorage.getItem("token");
    },

    /**
     * Forgot password request
     */
    forgotPassword: async(email) => {
        try {
            const response = await api.post("/auth/forgot-password", { email });
            return response.data;
        } catch (error) {
            throw error.response ?.data || { error: "Failed to send reset email" };
        }
    },

    /**
     * Reset password with token
     */
    resetPassword: async(token, password) => {
        try {
            const response = await api.post(`/auth/reset-password/${token}`, {
                password,
            });
            return response.data;
        } catch (error) {
            throw error.response ?.data || { error: "Failed to reset password" };
        }
    },
};

export default authService;