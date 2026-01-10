import axios from "axios";

// ✅ CORRECT for Vite - use VITE_ prefix
const API_BASE_URL =
    import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Request interceptor
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
API.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response ?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error.response ?.data || error.message);
    }
);

// AUTH SERVICES
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const getProfile = () => API.get('/auth/profile');

// BOOK SERVICES
export const getAllBooks = (params) => API.get('/books', { params });
export const getBookById = (id) => API.get(`/books/${id}`);
export const searchBooks = (query) => API.get(`/books?search=${query}`);

// CATEGORY SERVICES
export const getAllCategories = () => API.get('/categories');
export const getCategoryBySlug = (slug) => API.get(`/categories/${slug}`);

// CART SERVICES
export const getCart = () => API.get('/cart');
export const addToCart = (bookId, quantity = 1) =>
    API.post('/cart/add', { bookId, quantity });
export const updateCartItem = (cartItemId, quantity) =>
    API.put(`/cart/${cartItemId}`, { quantity });
export const removeFromCart = (cartItemId) => API.delete(`/cart/${cartItemId}`);
export const clearCart = () => API.delete('/cart/clear');

// ORDER SERVICES
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getOrders = () => API.get('/orders');
export const getOrderById = (orderId) => API.get(`/orders/${orderId}`);

// PAYMENT SERVICES
export const createPayment = (orderId, paymentData) =>
    API.post(`/payments/${orderId}`, paymentData);
export const verifyPayment = (paymentId) => API.get(`/payments/verify/${paymentId}`);

// REVIEW SERVICES
export const addReview = (bookId, reviewData) =>
    API.post(`/reviews/${bookId}`, reviewData);
export const getBookReviews = (bookId) => API.get(`/reviews/book/${bookId}`);
export const updateReview = (reviewId, reviewData) =>
    API.put(`/reviews/${reviewId}`, reviewData);
export const deleteReview = (reviewId) => API.delete(`/reviews/${reviewId}`);

// ADMIN SERVICES
export const addCategory = (categoryData) => API.post('/admin/categories', categoryData);
export const addBook = (bookData) => API.post('/admin/books', bookData);