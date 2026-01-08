import React, { createContext, useContext, useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { useAuth } from "./AuthContext";

const AdminContext = createContext();

export const useAdmin = () => {
  return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const { get, post, put, del } = useApi();

  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdminStats = async () => {
    if (!user || user.role !== "admin") return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all stats in parallel
      const [usersRes, booksRes, ordersRes] = await Promise.all([
        get("/admin/users?limit=1000"),
        get("/books?limit=1000"),
        get("/orders"),
      ]);

      const users = usersRes?.users || [];
      const books = booksRes?.books || [];
      const orders = ordersRes?.orders || [];

      // Calculate totals
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );

      const pendingOrders = orders.filter(
        (order) => order.status === "pending" || order.status === "processing"
      ).length;

      setAdminStats({
        totalUsers: users.length,
        totalBooks: books.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching admin stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // User Management
  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await put(`/admin/users/${userId}/role`, {
        role: newRole,
      });
      await fetchAdminStats(); // Refresh stats
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await del(`/admin/users/${userId}`);
      await fetchAdminStats();
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Book Management
  const createBook = async (bookData) => {
    try {
      const response = await post("/admin/books", bookData);
      await fetchAdminStats();
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateBook = async (bookId, bookData) => {
    try {
      const response = await put(`/admin/books/${bookId}`, bookData);
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const response = await del(`/admin/books/${bookId}`);
      await fetchAdminStats();
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Order Management
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await put(`/admin/orders/${orderId}/status`, { status });
      await fetchAdminStats();
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await del(`/admin/orders/${orderId}`);
      await fetchAdminStats();
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Fetch stats on mount and when user changes
  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminStats();
    }
  }, [user]);

  const value = {
    adminStats,
    isLoading,
    error,
    fetchAdminStats,
    updateUserRole,
    deleteUser,
    createBook,
    updateBook,
    deleteBook,
    updateOrderStatus,
    deleteOrder,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
