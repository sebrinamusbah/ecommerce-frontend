// src/context/AppContext.js - UPDATED
import React, { createContext, useState, useContext, useEffect } from "react";
import * as api from "../services/api";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCart();
      fetchCategories();
    }
  }, []);

  // 1. REGISTRATION FLOW
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.registerUser(userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setError("");
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.error || "Registration failed");
      return { success: false, error: err.error };
    } finally {
      setLoading(false);
    }
  };

  // 2. LOGIN FLOW
  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await api.loginUser(credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      await fetchCart(); // Fetch cart after login
      setError("");
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.error || "Login failed");
      return { success: false, error: err.error };
    } finally {
      setLoading(false);
    }
  };

  // 3. FETCH BOOKS (User browses books)
  const fetchBooks = async (params = {}) => {
    setLoading(true);
    try {
      const data = await api.getAllBooks(params);
      setBooks(data.data || data);
      return data;
    } catch (err) {
      setError("Failed to fetch books");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 4. FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const data = await api.getAllCategories();
      setCategories(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      return [];
    }
  };

  // 5. ADD TO CART
  const addToCart = async (bookId, quantity = 1) => {
    if (!user) {
      return { success: false, error: "Please login first" };
    }

    try {
      const data = await api.addToCart(bookId, quantity);
      await fetchCart(); // Refresh cart
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.error || "Failed to add to cart" };
    }
  };

  // 6. FETCH CART
  const fetchCart = async () => {
    if (!user) return;

    try {
      const data = await api.getCart();
      setCart(data.items || []);
      return data;
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // 7. CHECKOUT → CREATE ORDER
  const checkout = async (orderData) => {
    try {
      const data = await api.createOrder(orderData);

      // Clear cart after successful order
      await api.clearCart();
      await fetchCart();

      return { success: true, order: data };
    } catch (err) {
      return { success: false, error: err.error || "Checkout failed" };
    }
  };

  // 8. PROCESS PAYMENT
  const processPayment = async (orderId, paymentData) => {
    try {
      const data = await api.createPayment(orderId, paymentData);
      return { success: true, payment: data };
    } catch (err) {
      return { success: false, error: err.error || "Payment failed" };
    }
  };

  // 9. ADD REVIEW
  const addReview = async (bookId, reviewData) => {
    try {
      const data = await api.addReview(bookId, reviewData);
      return { success: true, review: data };
    } catch (err) {
      return { success: false, error: err.error || "Failed to add review" };
    }
  };

  // 10. LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
    window.location.href = "/login";
  };

  const value = {
    user,
    cart,
    books,
    categories,
    loading,
    error,
    register,
    login,
    logout,
    fetchBooks,
    fetchCategories,
    fetchCart,
    addToCart,
    checkout,
    processPayment,
    addReview,
    setError: (msg) => setError(msg),
  };

  return <AppContext.Provider value={value}> {children} </AppContext.Provider>;
};
