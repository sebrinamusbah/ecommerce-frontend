import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Add this import
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Use AuthContext
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // Handle form submission - UPDATED VERSION
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Use the AuthContext login function
      const user = await login(formData.email, formData.password);

      // Remember me functionality
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Success message
      alert(
        `Welcome ${
          user.role === "admin" ? "Admin" : ""
        }! You are now logged in.`
      );

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setErrors({
        general:
          "Invalid email or password. Try: test@example.com / password123 or admin@bookstore.com / admin123",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    alert(`Redirecting to ${provider} login...`);
    // In real app: Redirect to OAuth endpoint
    // window.location.href = `/api/auth/${provider}`;
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    const email = prompt(
      "Please enter your email address to reset your password:"
    );
    if (email && /\S+@\S+\.\S+/.test(email)) {
      alert(`Password reset instructions have been sent to ${email}`);
    } else if (email) {
      alert("Please enter a valid email address");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Welcome Message */}
        <div className="login-left">
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome Back</h1>
            <p className="welcome-subtitle">
              Sign in to access your personalized book recommendations,
              wishlist, and order history.
            </p>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <div className="feature-text">
                  <h3>Personalized Recommendations</h3>
                  <p>Get book suggestions based on your reading history</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">❤️</span>
                <div className="feature-text">
                  <h3>Save Your Wishlist</h3>
                  <p>Keep track of books you want to read later</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">📦</span>
                <div className="feature-text">
                  <h3>Track Your Orders</h3>
                  <p>Monitor your purchases and delivery status</p>
                </div>
              </div>
            </div>

            <div className="test-account">
              <h4>Test Accounts:</h4>
              <p>
                <strong>Admin:</strong> admin@bookstore.com / admin123
              </p>
              <p>
                <strong>User:</strong> test@example.com / password123
              </p>
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

            {/* Social Login Buttons */}
            <div className="social-login">
              <button
                className="social-btn google-btn"
                onClick={() => handleSocialLogin("Google")}
              >
                <span className="social-icon">🔍</span>
                Continue with Google
              </button>

              <button
                className="social-btn facebook-btn"
                onClick={() => handleSocialLogin("Facebook")}
              >
                <span className="social-icon">👥</span>
                Continue with Facebook
              </button>
            </div>

            <div className="divider">
              <span>or continue with email</span>
            </div>

            {/* Login Form */}
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Show general error if exists */}
              {errors.general && (
                <div className="general-error">{errors.general}</div>
              )}

              {/* Email Field */}
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
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <button
                    type="button"
                    className="show-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈 Hide" : "👁️ Show"}
                  </button>
                </div>
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
                  />
                  <button
                    type="button"
                    className="forgot-password-btn"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    Forgot?
                  </button>
                </div>
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox-input"
                    disabled={isLoading}
                  />
                  <span className="checkbox-custom"></span>
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Register Link */}
              <div className="register-link">
                <p>
                  New to BookStore?{" "}
                  <Link to="/register" className="register-text">
                    Create an account
                  </Link>
                </p>
              </div>
            </form>

            {/* Terms & Privacy */}
            <div className="terms-privacy">
              <p>
                By signing in, you agree to our{" "}
                <a href="/terms" className="link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="link">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
