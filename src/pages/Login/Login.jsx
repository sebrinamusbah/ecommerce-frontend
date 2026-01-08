import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { authenticate, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // For registration
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Check for remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    clearError();
    setAuthMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Only validate name for new users
    if (isNewUser && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    clearError();
    setAuthMessage("");

    console.log("=== LOGIN DEBUG ===");
    console.log("Email:", formData.email);
    console.log("Password length:", formData.password.length);

    try {
      // Try direct mock authentication
      console.log("Attempting authentication...");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials
      const isAdmin =
        formData.email === "sebrinm9@gmail.com" &&
        formData.password === "Sebrina@123";
      const isCustomer =
        formData.email === "customer@example.com" &&
        formData.password === "Customer@123";

      if (isAdmin || isCustomer) {
        console.log("✓ Credentials valid");

        const userData = isAdmin
          ? {
              id: 1,
              email: "sebrinm9@gmail.com",
              name: "Sebrina Musbah",
              role: "admin",
              token: "mock-admin-token",
            }
          : {
              id: 2,
              email: "customer@example.com",
              name: "Sample Customer",
              role: "user",
              token: "mock-user-token",
            };

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);

        console.log("User stored:", userData);

        // Remember me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Redirect
        if (isAdmin) {
          console.log("Redirecting to admin dashboard");
          navigate("/admin/dashboard", { replace: true });
        } else {
          console.log("Redirecting to home");
          navigate(from, { replace: true });
        }
      } else {
        // Auto-create new user
        console.log("Creating new user...");
        const newUser = {
          id: Date.now(),
          email: formData.email,
          name: formData.name || formData.email.split("@")[0],
          role: formData.email.toLowerCase().includes("admin")
            ? "admin"
            : "user",
          token: `new-user-token-${Date.now()}`,
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("token", newUser.token);

        setAuthMessage(`Welcome ${newUser.name}! Account created.`);

        // Small delay to show message
        setTimeout(() => {
          if (newUser.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        }, 1500);
      }
    } catch (err) {
      console.error("Error:", err);
      setErrors({
        general: "Login failed. Try: sebrinm9@gmail.com / Sebrina@123",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsNewUser(!isNewUser);
    setErrors({});
    clearError();
    setAuthMessage("");
  };

  // UPDATED WITH CORRECT SEED CREDENTIALS
  const handleQuickAdmin = () => {
    setFormData({
      email: "sebrinm9@gmail.com",
      password: "Sebrina@123",
      name: "Sebrina Admin",
    });
    setIsNewUser(false);
    setErrors({});
    clearError();
  };

  const handleQuickUser = () => {
    setFormData({
      email: "customer@example.com",
      password: "Customer@123",
      name: "Sample Customer",
    });
    setIsNewUser(false);
    setErrors({});
    clearError();
  };

  const handleNewUser = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
    });
    setIsNewUser(true);
    setErrors({});
    clearError();
    setAuthMessage("Please fill in your details to create a new account.");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Welcome Message */}
        <div className="login-left">
          <div className="welcome-content">
            <div className="logo">
              <h1>Readify</h1>
              <p className="tagline">Your Online Bookstore</p>
            </div>
            <div className="welcome-message">
              <h2>{isNewUser ? "Create Account" : "Welcome Back!"}</h2>
              <p>
                {isNewUser
                  ? "Join our community of book lovers. Create an account to get started."
                  : "Sign in to access your personalized book recommendations, track your orders, and continue your reading journey."}
              </p>
            </div>
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Access thousands of books</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <span>Fast & free delivery</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <span>Personalized recommendations</span>
              </div>
            </div>

            {/* UPDATED TEST CREDENTIALS */}
            <div className="test-credentials">
              <p className="test-title">Test Credentials:</p>
              <div className="credential-box">
                <p>
                  <strong>Admin:</strong> sebrinm9@gmail.com / Sebrina@123
                </p>
                <p>
                  <strong>Customer:</strong> customer@example.com / Customer@123
                </p>
              </div>
            </div>

            <div className="auth-mode-info">
              <p className="info-title">
                {isNewUser ? "Already have an account?" : "New to Readify?"}
              </p>
              <button onClick={toggleAuthMode} className="mode-toggle-button">
                {isNewUser ? "Sign In Here" : "Create Account Here"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="login-right">
          <div className="login-form-container">
            <div className="form-header">
              <h2 className="form-title">
                {isNewUser ? "Create Your Account" : "Sign In to Your Account"}
              </h2>
              <p className="form-subtitle">
                {isNewUser
                  ? "Fill in your details to get started"
                  : "Enter your credentials to access your account"}
              </p>
            </div>

            {/* Auth Message */}
            {authMessage && !error && (
              <div className="alert alert-info">
                <div className="alert-icon">ℹ️</div>
                <div className="alert-content">
                  <p>{authMessage}</p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="alert alert-error">
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">
                  <strong>Authentication Failed</strong>
                  <p>{error}</p>
                </div>
                <button className="alert-close" onClick={clearError}>
                  ×
                </button>
              </div>
            )}

            {/* Form Validation Error */}
            {errors.general && (
              <div className="alert alert-error">
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">
                  <strong>Error</strong>
                  <p>{errors.general}</p>
                </div>
                <button className="alert-close" onClick={() => setErrors({})}>
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Name field for new users */}
              {isNewUser && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name} // FIXED: Added value prop
                    onChange={handleChange}
                    className={`form-input ${errors.name ? "error" : ""}`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email} // FIXED: Added value prop
                  onChange={handleChange}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password} // FIXED: Added value prop
                    onChange={handleChange}
                    className={`form-input ${errors.password ? "error" : ""}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete={
                      isNewUser ? "new-password" : "current-password"
                    }
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {!isNewUser && (
                <div className="form-options">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    {isNewUser ? "Creating Account..." : "Signing In..."}
                  </>
                ) : isNewUser ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="quick-actions">
                <p className="quick-title">Quick Actions:</p>
                <div className="quick-buttons">
                  <button
                    type="button"
                    className="quick-button admin-button"
                    onClick={handleQuickAdmin}
                    disabled={isLoading}
                  >
                    Admin Login
                  </button>
                  <button
                    type="button"
                    className="quick-button user-button"
                    onClick={handleQuickUser}
                    disabled={isLoading}
                  >
                    Customer Login
                  </button>
                  <button
                    type="button"
                    className="quick-button new-button"
                    onClick={handleNewUser}
                    disabled={isLoading}
                  >
                    New User
                  </button>
                </div>
              </div>

              <div className="divider">
                <span>Or continue with</span>
              </div>

              <div className="social-login">
                <button
                  type="button"
                  className="social-button google-button"
                  disabled={isLoading}
                >
                  <span className="social-icon">G</span>
                  Continue with Google
                </button>
                <button
                  type="button"
                  className="social-button facebook-button"
                  disabled={isLoading}
                >
                  <span className="social-icon">f</span>
                  Continue with Facebook
                </button>
              </div>

              <div className="terms-agreement">
                {isNewUser && (
                  <p className="terms-text">
                    By creating an account, you agree to our{" "}
                    <Link to="/terms">Terms of Service</Link> and{" "}
                    <Link to="/privacy">Privacy Policy</Link>
                  </p>
                )}
              </div>

              {/* Debug section - can remove in production */}
              <div
                className="debug-section"
                style={{ marginTop: "15px", fontSize: "12px" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    console.log("Current form data:", formData);
                    console.log("LocalStorage:", {
                      token: localStorage.getItem("token"),
                      user: localStorage.getItem("user"),
                    });
                  }}
                  style={{
                    background: "#666",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                  }}
                >
                  Debug Info
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
