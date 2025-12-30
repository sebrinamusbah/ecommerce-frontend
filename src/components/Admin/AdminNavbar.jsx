import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminNavbar.css"; // Make sure this file exists

const AdminNavbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/books", label: "Manage Books", icon: "📚" },
    { path: "/admin/categories", label: "Categories", icon: "🏷️" },
    { path: "/admin/orders", label: "Orders", icon: "📦" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/reports", label: "Reports", icon: "📈" },
    { path: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        {/* Brand/Logo */}
        <div className="admin-navbar-brand">
          <Link to="/admin" className="admin-logo">
            <span className="admin-logo-icon">👑</span>
            <span className="admin-logo-text">BookStore Admin</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="admin-navbar-menu">
          <ul className="admin-nav-links">
            {navItems.map((item) => (
              <li key={item.path} className="admin-nav-item">
                <Link
                  to={item.path}
                  className={`admin-nav-link ${isActive(item.path)}`}
                  title={item.label}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* User Section - Right Side */}
        <div className="admin-navbar-right">
          {/* User Info */}
          <div className="admin-user-info">
            <div className="user-avatar-container">
              <span className="user-avatar">{user?.avatar || "👤"}</span>
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || "Admin User"}</div>
              <div className="user-role">{user?.role || "Admin"}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="admin-actions">
            <Link to="/" className="view-site-btn" title="View Public Site">
              <span className="action-icon">👁️</span>
              <span className="action-text">View Site</span>
            </Link>
            <button onClick={logout} className="logout-btn" title="Logout">
              <span className="action-icon">🚪</span>
              <span className="action-text">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
