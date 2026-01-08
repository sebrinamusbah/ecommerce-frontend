import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AdminNavbar from "../../components/Admin/AdminNavbar";

//import "./Orders.css";

const AdminOrders = () => {
  const { get, put } = useApi();
  const { updateOrderStatus } = useAdmin();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    search: "",
  });

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Fetch orders
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await get("/orders?limit=1000");
      if (response && response.orders) {
        setOrders(response.orders);
        setFilteredOrders(response.orders);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = [...orders];

    // Status filter
    if (filters.status !== "all") {
      result = result.filter((order) => order.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      result = result.filter((order) => new Date(order.createdAt) >= startDate);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toString().includes(searchLower) ||
          order.user?.name?.toLowerCase().includes(searchLower) ||
          order.user?.email?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [filters, orders]);

  // Initialize
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        await fetchOrders(); // Refresh orders
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedOrders.length === 0) return;

    try {
      if (action === "mark_shipped") {
        await Promise.all(
          selectedOrders.map((orderId) => updateOrderStatus(orderId, "shipped"))
        );
      } else if (action === "mark_delivered") {
        await Promise.all(
          selectedOrders.map((orderId) =>
            updateOrderStatus(orderId, "delivered")
          )
        );
      } else if (action === "mark_cancelled") {
        await Promise.all(
          selectedOrders.map((orderId) =>
            updateOrderStatus(orderId, "cancelled")
          )
        );
      }

      await fetchOrders();
      setSelectedOrders([]);
    } catch (err) {
      console.error("Error performing bulk action:", err);
    }
  };

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="admin-orders">
        <AdminNavbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <AdminNavbar />

      <div className="admin-orders-layout">
        <AdminSidebar />

        <main className="admin-orders-main">
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">Order Management</h1>
              <p className="page-subtitle">
                {filteredOrders.length} orders found
                {filters.status !== "all" && ` • ${filters.status} orders`}
              </p>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                <span className="btn-icon">🖨️</span>
                Print Report
              </button>
              <button className="btn btn-secondary" onClick={fetchOrders}>
                <span className="btn-icon">🔄</span>
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="orders-filters">
            <div className="filter-group">
              <label>Status</label>
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date Range</label>
              <select
                className="filter-select"
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters({ ...filters, dateRange: e.target.value })
                }
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            <div className="filter-group search-group">
              <label>Search</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search by order ID or customer..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="bulk-actions">
              <div className="bulk-info">
                {selectedOrders.length} order(s) selected
              </div>
              <div className="bulk-buttons">
                <select
                  className="bulk-select"
                  onChange={(e) => handleBulkAction(e.target.value)}
                >
                  <option value="">Bulk Actions</option>
                  <option value="mark_shipped">Mark as Shipped</option>
                  <option value="mark_delivered">Mark as Delivered</option>
                  <option value="mark_cancelled">Mark as Cancelled</option>
                </select>
                <button
                  className="btn btn-outline"
                  onClick={() => setSelectedOrders([])}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === currentOrders.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(
                            currentOrders.map((order) => order.id)
                          );
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                  </th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders([...selectedOrders, order.id]);
                          } else {
                            setSelectedOrders(
                              selectedOrders.filter((id) => id !== order.id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="order-id"
                      >
                        #{order.id}
                      </Link>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-name">
                          {order.user?.name || "Unknown"}
                        </div>
                        <div className="customer-email">
                          {order.user?.email || "No email"}
                        </div>
                      </div>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="items-count">
                        {order.items?.length || 0} items
                      </span>
                    </td>
                    <td className="order-total">
                      ${order.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="action-btn view"
                          title="View Details"
                        >
                          👁️
                        </Link>
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No orders found</h3>
              <p>Try adjusting your filters or search criteria.</p>
              <button
                className="btn btn-primary"
                onClick={() =>
                  setFilters({ status: "all", dateRange: "all", search: "" })
                }
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      className={`page-number ${
                        page === currentPage ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
              </div>

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next →
              </button>
            </div>
          )}

          {/* Stats Summary */}
          <div className="orders-stats">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-number">
                  {orders.filter((o) => o.status === "pending").length}
                </div>
                <div className="stat-label">Pending Orders</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚚</div>
              <div className="stat-content">
                <div className="stat-number">
                  {orders.filter((o) => o.status === "processing").length}
                </div>
                <div className="stat-label">Processing</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">
                  {orders.filter((o) => o.status === "delivered").length}
                </div>
                <div className="stat-label">Delivered</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">
                  $
                  {orders
                    .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                    .toFixed(2)}
                </div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;
