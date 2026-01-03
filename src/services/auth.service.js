import api from "./api";

const authService = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     */
    register: async(userData) => {
        try {
            const response = await api.post("/auth/register", userData);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Registration failed" };
        }
    },

    /**
     * Login user
     * @param {Object} credentials - Email and password
     */
    login: async(credentials) => {
        try {
            const response = await api.post("/auth/login", credentials);

            if (response.data.data ? .token) {
                // Store auth data in localStorage
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Login failed" };
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
            throw error.response ? .data || { error: "Failed to fetch profile" };
        }
    },

    /**
     * Update user profile
     * @param {Object} userData - Updated user data
     */
    updateProfile: async(userData) => {
        try {
            const response = await api.put("/auth/profile", userData);

            // Update stored user data if successful
            if (response.data.success) {
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to update profile" };
        }
    },

    /**
     * Change password
     * @param {Object} passwordData - Current and new password
     */
    changePassword: async(passwordData) => {
        try {
            const response = await api.put("/auth/change-password", passwordData);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to change password" };
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
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Forgot password request
     * @param {string} email - User email
     */
    forgotPassword: async(email) => {
        try {
            const response = await api.post("/auth/forgot-password", { email });
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to send reset email" };
        }
    },

    /**
     * Reset password with token
     * @param {string} token - Reset token
     * @param {string} password - New password
     */
    resetPassword: async(token, password) => {
        try {
            const response = await api.post(`/auth/reset-password/${token}`, {
                password,
            });
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to reset password" };
        }
    },
};

export default authService;