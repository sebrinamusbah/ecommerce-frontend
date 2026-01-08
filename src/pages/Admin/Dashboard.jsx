import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import DashboardStats from "../../components/Admin/DashboardStats";
import RecentOrders from "../../components/admin/RecentOrders";
import UserTable from "../../components/admin/UserTable";
import BookTable from "../../components/admin/BookTable";
import "./Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { adminStats, fetchAdminStats } = useAdmin();

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login", {
        state: { message: "Admin access required" },
      });
    }
  }, [user, navigate]);

  // Refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.role === "admin") {
        fetchAdminStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, fetchAdminStats]);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <div className="admin-dashboard-layout">
        <AdminSidebar />

        <main className="admin-dashboard-main">
          <div className="dashboard-header">
            <div className="welcome-section">
              <h1 className="welcome-title">
                Welcome back, <span className="admin-name">{user.name}</span>!
                👋
              </h1>
              <p className="welcome-subtitle">
                Here's what's happening with your bookstore today.
              </p>
            </div>
            <div className="dashboard-actions">
              <button className="action-btn primary">
                <span className="btn-icon">📊</span>
                <span>Generate Report</span>
              </button>
              <button className="action-btn secondary">
                <span className="btn-icon">➕</span>
                <span>Add New Book</span>
              </button>
              <button className="action-btn outline">
                <span className="btn-icon">🔄</span>
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          <DashboardStats />

          <div className="dashboard-grid">
            <div className="grid-column">
              <RecentOrders />
              <div className="dashboard-card">
                <h3 className="card-title">Top Selling Books</h3>
                <div className="top-books-list">
                  {[
                    {
                      title: "The Great Gatsby",
                      sales: 142,
                      revenue: "$1,842",
                    },
                    { title: "Atomic Habits", sales: 128, revenue: "$1,543" },
                    { title: "Clean Code", sales: 98, revenue: "$2,876" },
                    { title: "Sapiens", sales: 87, revenue: "$1,234" },
                    { title: "The Lean Startup", sales: 76, revenue: "$987" },
                  ].map((book, index) => (
                    <div key={index} className="top-book-item">
                      <div className="book-rank">{index + 1}</div>
                      <div className="book-info">
                        <div className="book-title">{book.title}</div>
                        <div className="book-stats">
                          <span className="book-sales">{book.sales} sales</span>
                          <span className="book-revenue">{book.revenue}</span>
                        </div>
                      </div>
                      <div className="book-trend positive">+12%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid-column">
              <UserTable limit={5} />
              <BookTable limit={5} />

              <div className="dashboard-card">
                <h3 className="card-title">Quick Actions</h3>
                <div className="quick-action-grid">
                  <button className="quick-action">
                    <span className="action-icon">📧</span>
                    <span className="action-text">Send Newsletter</span>
                  </button>
                  <button className="quick-action">
                    <span className="action-icon">📦</span>
                    <span className="action-text">Process Orders</span>
                  </button>
                  <button className="quick-action">
                    <span className="action-icon">🔄</span>
                    <span className="action-text">Update Inventory</span>
                  </button>
                  <button className="quick-action">
                    <span className="action-icon">📊</span>
                    <span className="action-text">View Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <h3 className="card-title">Recent Activity</h3>
            <div className="activity-timeline">
              {[
                {
                  time: "10:30 AM",
                  user: "John Doe",
                  action: "Placed new order #ORD-2024-001",
                  icon: "🛒",
                },
                {
                  time: "09:45 AM",
                  user: "Sarah Smith",
                  action: 'Reviewed "The Great Gatsby"',
                  icon: "⭐",
                },
                {
                  time: "09:15 AM",
                  user: "System",
                  action: "Database backup completed",
                  icon: "💾",
                },
                {
                  time: "Yesterday",
                  user: "Admin",
                  action: "Added 5 new books to inventory",
                  icon: "📚",
                },
                {
                  time: "Yesterday",
                  user: "Michael Brown",
                  action: "Registered new account",
                  icon: "👤",
                },
              ].map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-time">{activity.time}</div>
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <div className="activity-user">{activity.user}</div>
                    <div className="activity-action">{activity.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="system-info-footer">
            <div className="info-item">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Server Status:</span>
              <span className="info-value status-online">
                All Systems Operational
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">API Version:</span>
              <span className="info-value">v1.2.4</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
