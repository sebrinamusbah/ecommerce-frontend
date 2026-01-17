import axios from "axios";

// ✅ CORRECT for Vite - use VITE_ prefix
const API_BASE_URL =
    import.meta.env.VITE_API_URL;

// You created this as 'api' (lowercase)
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// ❌ WRONG: You're using 'API' but you created 'api'
// Request interceptor - CHANGE API to api
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - CHANGE API to api
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response ?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject({
            error: error.response ?.data ?.error || 'Something went wrong',
            message: error.response ?.data ?.message || error.message,
            status: error.response ?.status
        });
    }
);

// CHANGE ALL 'API' to 'api' in exports:

// AUTH SERVICES
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const getProfile = () => api.get('/auth/profile');

// BOOK SERVICES
export const getAllBooks = (params = {}) => api.get('/books', { params });
export const getBookById = (id) => api.get(`/books/${id}`);
export const searchBooks = (query) => api.get(`/books/search?q=${query}`);

// CATEGORY SERVICES
export const getAllCategories = () => api.get('/categories');
export const getCategoryBySlug = (slug) => api.get(`/categories/${slug}`);

// CART SERVICES
export const getCart = () => api.get('/cart');
export const addToCart = (bookId, quantity = 1) =>
    api.post('/cart/add', { bookId, quantity });
export const updateCartItem = (cartItemId, quantity) =>
    api.put(`/cart/${cartItemId}`, { quantity });
export const removeFromCart = (cartItemId) => api.delete(`/cart/${cartItemId}`);
export const clearCart = () => api.delete('/cart/clear');

// ORDER SERVICES
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getOrders = () => api.get('/orders');
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

// PAYMENT SERVICES
export const createPayment = (orderId, paymentData) =>
    api.post(`/payments/${orderId}`, paymentData);

// REVIEW SERVICES
export const getBookReviews = (bookId) => api.get(`/reviews/book/${bookId}`);
export const addReview = (bookId, reviewData) =>
    api.post(`/reviews/${bookId}`, reviewData);

// ADMIN SERVICES
export const addBook = (bookData) => api.post('/admin/books', bookData);
export const addCategory = (categoryData) => api.post('/admin/categories', categoryData);

// TEST CONNECTION
export const testConnection = () => api.get('/health');

// CHANGE THIS TOO:
export default api; // Not API