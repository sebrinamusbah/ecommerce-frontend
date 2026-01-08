import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
        <div className="admin-navbar-brand">
          <Link to="/admin" className="admin-logo">
            <span className="admin-logo-icon">👑</span>
            <span className="admin-logo-text">BookStore Admin</span>
          </Link>
        </div>

        <div className="admin-navbar-menu">
          <ul className="admin-nav-links">
            {navItems.map((item) => (
              <li key={item.path} className="admin-nav-item">
                <Link
                  to={item.path}
                  className={`admin-nav-link ${isActive(item.path)}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-navbar-user">
          <div className="user-info">
            <span className="user-avatar">{user?.avatar || "👤"}</span>
            <div className="user-details">
              <span className="user-name">{user?.name || "Admin"}</span>
              <span className="user-role">{user?.role || "Admin"}</span>
            </div>
          </div>
          <div className="admin-actions">
            <Link to="/" className="view-site-btn">
              👁️ View Site
            </Link>
            <button onClick={logout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
