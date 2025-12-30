import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to check if link is active
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - Links to Home */}
        <div className="navbar-logo">
          <Link to="/" onClick={closeMobileMenu}>
            📚 BookStore
          </Link>
        </div>

        {/* Desktop Navigation Links - Hidden on mobile */}
        <div className="navbar-menu desktop-menu">
          <ul className="navbar-links">
            <li className="navbar-item">
              <Link to="/" className={`navbar-link ${isActive("/")}`}>
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/categories"
                className={`navbar-link ${isActive("/categories")}`}
              >
                Categories
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/cart" className={`navbar-link ${isActive("/cart")}`}>
                Cart <span className="cart-count">0</span>
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/login" className={`navbar-link ${isActive("/login")}`}>
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <div className="navbar-mobile-menu">
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-dropdown-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-links">
          <li className="mobile-nav-item">
            <Link
              to="/"
              className={`mobile-nav-link ${isActive("/")}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link
              to="/categories"
              className={`mobile-nav-link ${isActive("/categories")}`}
              onClick={closeMobileMenu}
            >
              Categories
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link
              to="/cart"
              className={`mobile-nav-link ${isActive("/cart")}`}
              onClick={closeMobileMenu}
            >
              Cart <span className="mobile-cart-count">0</span>
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link
              to="/login"
              className={`mobile-nav-link ${isActive("/login")}`}
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
