import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="admin-navbar">
        <div className="admin-navbar-container">
          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Brand/Logo */}
          <div className="admin-navbar-brand">
            <Link to="/admin" className="admin-logo">
              <span className="admin-logo-icon">👑</span>
              <span className="admin-logo-text">BookStore Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="admin-navbar-menu desktop-menu">
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
            {/* Desktop User Info */}
            <div className="admin-user-info desktop-user-info">
              <div className="user-avatar-container">
                <span className="user-avatar">{user?.avatar || "👤"}</span>
              </div>
              <div className="user-details">
                <div className="user-name">{user?.name || "Admin User"}</div>
                <div className="user-role">{user?.role || "Admin"}</div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="admin-actions desktop-actions">
              <Link to="/" className="view-site-btn" title="View Public Site">
                <span className="action-icon">👁️</span>
                <span className="action-text">View Site</span>
              </Link>
              <button onClick={logout} className="logout-btn" title="Logout">
                <span className="action-icon">🚪</span>
                <span className="action-text">Logout</span>
              </button>
            </div>

            {/* Mobile User Avatar */}
            <div className="mobile-user-avatar">
              <span className="user-avatar">{user?.avatar || "👤"}</span>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`mobile-dropdown-menu ${isMobileMenuOpen ? "open" : ""}`}
        >
          {/* Mobile User Info */}
          <div className="mobile-user-info">
            <div className="user-avatar-large">
              <span className="user-avatar">{user?.avatar || "👤"}</span>
            </div>
            <div className="user-details-large">
              <div className="user-name">{user?.name || "Admin User"}</div>
              <div className="user-role">{user?.role || "Admin"}</div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <ul className="mobile-nav-links">
            {navItems.map((item) => (
              <li key={item.path} className="mobile-nav-item">
                <Link
                  to={item.path}
                  className={`mobile-nav-link ${isActive(item.path)}`}
                  onClick={closeMobileMenu}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Actions */}
          <div className="mobile-actions">
            <Link
              to="/"
              className="mobile-view-site-btn"
              onClick={closeMobileMenu}
            >
              <span className="action-icon">👁️</span>
              <span className="action-text">View Public Site</span>
            </Link>
            <button
              onClick={() => {
                closeMobileMenu();
                logout();
              }}
              className="mobile-logout-btn"
            >
              <span className="action-icon">🚪</span>
              <span className="action-text">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </>
  );
};

export default AdminNavbar;
