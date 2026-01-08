import { useState, useCallback, useRef } from "react";
import axios from "axios";

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    // Store active requests to cancel them if needed
    const activeRequests = useRef([]);

    // Create axios instance with default config
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // ✅ Correct
        timeout: 30000,
        headers: {
            "Content-Type": "application/json",
        },
    });
    // Request interceptor to add auth token
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Add request to active requests
            const source = axios.CancelToken.source();
            config.cancelToken = source.token;
            activeRequests.current.push(source);

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor for error handling
    api.interceptors.response.use(
        (response) => {
            // Remove completed request
            activeRequests.current = activeRequests.current.filter(
                req => req.token !== response.config.cancelToken
            );
            return response;
        },
        (error) => {
            // Remove failed request
            activeRequests.current = activeRequests.current.filter(
                req => req.token !== error.config ?.cancelToken
            );

            // Handle specific error cases
            if (error.response) {
                // Server responded with error
                switch (error.response.status) {
                    case 401:
                        // Unauthorized - clear token and redirect to login
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                        break;
                    case 403:
                        // Forbidden
                        setError("You don't have permission to perform this action.");
                        break;
                    case 404:
                        // Not found
                        setError("Resource not found.");
                        break;
                    case 422:
                        // Validation error
                        setError(error.response.data ?.error || "Validation failed.");
                        break;
                    case 500:
                        // Server error
                        setError("Server error. Please try again later.");
                        break;
                    default:
                        setError(error.response.data ?.error || "An error occurred.");
                }
            } else if (error.request) {
                // Request made but no response
                setError("Network error. Please check your connection.");
            } else {
                // Something else happened
                setError(error.message || "An error occurred.");
            }

            return Promise.reject(error);
        }
    );

    // GET request
    const get = useCallback(async(endpoint, params = {}, config = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(endpoint, {
                params,
                ...config,
                // Skip auth for certain endpoints
                headers: config.skipAuth ? {
                    ...api.defaults.headers,
                    Authorization: undefined
                } : api.defaults.headers
            });

            setData(response.data);
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (err) {
            // Don't set error if it's a cancelled request
            if (!axios.isCancel(err)) {
                setError(err.response ?.data ?.error || err.message || "Failed to fetch data");
            }
            return {
                success: false,
                error: err.response ?.data ?.error || err.message,
                status: err.response ?.status
            };
        } finally {
            setLoading(false);
        }
    }, [api]);

    // POST request
    const post = useCallback(async(endpoint, data = {}, config = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post(endpoint, data, {
                ...config,
                headers: config.skipAuth ? {
                    ...api.defaults.headers,
                    Authorization: undefined
                } : api.defaults.headers
            });

            setData(response.data);
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError(err.response ?.data ?.error || err.message || "Failed to create resource");
            }
            return {
                success: false,
                error: err.response ?.data ?.error || err.message,
                status: err.response ?.status
            };
        } finally {
            setLoading(false);
        }
    }, [api]);

    // PUT request
    const put = useCallback(async(endpoint, data = {}, config = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.put(endpoint, data, {
                ...config,
                headers: config.skipAuth ? {
                    ...api.defaults.headers,
                    Authorization: undefined
                } : api.defaults.headers
            });

            setData(response.data);
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError(err.response ?.data ?.error || err.message || "Failed to update resource");
            }
            return {
                success: false,
                error: err.response ?.data ?.error || err.message,
                status: err.response ?.status
            };
        } finally {
            setLoading(false);
        }
    }, [api]);

    // PATCH request
    const patch = useCallback(async(endpoint, data = {}, config = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.patch(endpoint, data, {
                ...config,
                headers: config.skipAuth ? {
                    ...api.defaults.headers,
                    Authorization: undefined
                } : api.defaults.headers
            });

            setData(response.data);
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError(err.response ?.data ?.error || err.message || "Failed to update resource");
            }
            return {
                success: false,
                error: err.response ?.data ?.error || err.message,
                status: err.response ?.status
            };
        } finally {
            setLoading(false);
        }
    }, [api]);

    // DELETE request
    const del = useCallback(async(endpoint, config = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.delete(endpoint, {
                ...config,
                headers: config.skipAuth ? {
                    ...api.defaults.headers,
                    Authorization: undefined
                } : api.defaults.headers
            });

            setData(response.data);
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError(err.response ?.data ?.error || err.message || "Failed to delete resource");
            }
            return {
                success: false,
                error: err.response ?.data ?.error || err.message,
                status: err.response ?.status
            };
        } finally {
            setLoading(false);
        }
    }, [api]);

    // Upload file
    const upload = useCallback(async(endpoint, file, config = {}) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post(endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...(config.skipAuth ? {} : { Authorization: api.defaults.headers.Authorization })
                },
                ...config
            });

            setData(response.data);
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError(err.response ?.data ?.error || err.message || "Failed to upload file");
            }
            return {
                success: false,
                error: err.response ?.data ?.error || err.message,
                status: err.response ?.status
            };
        } finally {
            setLoading(false);
        }
    }, [api]);

    // Cancel all active requests
    const cancelAllRequests = useCallback(() => {
        activeRequests.current.forEach(source => source.cancel("Request cancelled"));
        activeRequests.current = [];
    }, []);

    // Reset hook state
    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    // Clear error only
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Clear data only
    const clearData = useCallback(() => {
        setData(null);
    }, []);

    return {
        // State
        loading,
        error,
        data,

        // HTTP methods
        get,
        post,
        put,
        patch,
        delete: del,
        del,
        upload,

        // Control methods
        reset,
        clearError,
        clearData,
        cancelAllRequests,

        // Raw axios instance for custom requests
        api,
    };
};

// Optional: Create a separate hook for specific API endpoints
export const useBookApi = () => {
    const api = useApi();

    const bookApi = {
        // Books
        getAllBooks: (params) => api.get('/books', params),
        getBook: (id) => api.get(`/books/${id}`),
        createBook: (data) => api.post('/books', data),
        updateBook: (id, data) => api.put(`/books/${id}`, data),
        deleteBook: (id) => api.delete(`/books/${id}`),
        searchBooks: (query) => api.get('/books/search', { params: { q: query } }),

        // Categories
        getCategories: () => api.get('/categories'),
        getCategoryBooks: (categoryId) => api.get(`/books/category/${categoryId}`),
    };

    return {...api, ...bookApi };
};

export const useAuthApi = () => {
    const api = useApi();

    const authApi = {
        login: (credentials) => api.post('/auth/login', credentials, { skipAuth: true }),
        register: (userData) => api.post('/auth/register', userData, { skipAuth: true }),
        logout: () => api.post('/auth/logout'),
        getProfile: () => api.get('/auth/profile'),
        updateProfile: (data) => api.put('/auth/profile', data),
        changePassword: (data) => api.put('/auth/change-password', data),
    };

    return {...api, ...authApi };
};

export const useCartApi = () => {
    const api = useApi();

    const cartApi = {
        getCart: () => api.get('/cart'),
        addToCart: (data) => api.post('/cart/add', data),
        updateCartItem: (id, data) => api.put(`/cart/update/${id}`, data),
        removeFromCart: (id) => api.delete(`/cart/remove/${id}`),
        clearCart: () => api.delete('/cart/clear'),
    };

    return {...api, ...cartApi };
};

export const useOrderApi = () => {
    const api = useApi();

    const orderApi = {
        getOrders: () => api.get('/orders'),
        getOrder: (id) => api.get(`/orders/${id}`),
        createOrder: (data) => api.post('/orders', data),
        cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
        updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    };

    return {...api, ...orderApi };
};

export const useAdminApi = () => {
    const api = useApi();

    const adminApi = {
        // User Management
        getUsers: (params) => api.get('/admin/users', params),
        updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
        deleteUser: (id) => api.delete(`/admin/users/${id}`),

        // Book Management
        getAllBooksAdmin: (params) => api.get('/admin/books', params),
        createBookAdmin: (data) => api.post('/admin/books', data),
        updateBookAdmin: (id, data) => api.put(`/admin/books/${id}`, data),
        deleteBookAdmin: (id) => api.delete(`/admin/books/${id}`),

        // Order Management
        getAllOrders: (params) => api.get('/admin/orders', params),
        updateOrderAdmin: (id, data) => api.put(`/admin/orders/${id}`, data),

        // Reports
        getSalesReport: (period) => api.get(`/admin/reports/sales?period=${period}`),
        getUserReport: () => api.get('/admin/reports/users'),
        getInventoryReport: () => api.get('/admin/reports/inventory'),
    };

    return {...api, ...adminApi };
};