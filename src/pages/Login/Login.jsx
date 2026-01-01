import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { login, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    try {
      const user = await login(formData.email, formData.password);

      // Remember me functionality
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Show success message
      console.log("Login successful:", user);

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Error is already set in AuthContext, we'll show it in the UI
      console.error("Login error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    // For demo purposes - you can remove this if not needed
    setFormData({
      email: "test@example.com",
      password: "password123",
    });
  };

  const handleDemoAdminLogin = async () => {
    // For demo purposes - you can remove this if not needed
    setFormData({
      email: "admin@bookstore.com",
      password: "admin123",
    });
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
              <h2>Welcome Back!</h2>
              <p>
                Sign in to access your personalized book recommendations, track
                your orders, and continue your reading journey.
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
            <div className="test-credentials">
              <p className="test-title">Test Credentials:</p>
              <div className="credential-box">
                <p>
                  <strong>Admin:</strong> admin@bookstore.com / admin123
                </p>
                <p>
                  <strong>User:</strong> test@example.com / password123
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="login-form-container">
            <div className="form-header">
              <h2 className="form-title">Sign In to Your Account</h2>
              <p className="form-subtitle">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Backend Error Display */}
            {error && (
              <div className="alert alert-error backend-error">
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">
                  <strong>Login Failed</strong>
                  <p>{error}</p>
                </div>
                <button className="alert-close" onClick={clearError}>
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
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
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? "error" : ""}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete="current-password"
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

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="demo-buttons">
                <button
                  type="button"
                  className="demo-button guest-button"
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                >
                  Fill User Credentials
                </button>
                <button
                  type="button"
                  className="demo-button admin-button"
                  onClick={handleDemoAdminLogin}
                  disabled={isLoading}
                >
                  Fill Admin Credentials
                </button>
              </div>

              <div className="divider">
                <span>Or</span>
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

              <div className="register-link">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" className="register-text">
                    Create account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
