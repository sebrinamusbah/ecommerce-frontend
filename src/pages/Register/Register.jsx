import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;
    const totalRequirements = Object.keys(requirements).length;

    return {
      strength: Math.round((metRequirements / totalRequirements) * 100),
      requirements,
    };
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const passwordStrength = checkPasswordStrength(formData.password);

    // First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength.strength < 60) {
      newErrors.password = "Password is too weak";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Registration attempt:", {
        ...formData,
        password: "***", // Don't log actual password
      });

      // Simulate successful registration
      alert(
        `Welcome ${formData.firstName}! Your account has been created successfully.`
      );

      // Store registration data (in real app, use context/Redux)
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem(
        "userName",
        `${formData.firstName} ${formData.lastName}`
      );

      // Redirect to home page
      navigate("/");

      setIsLoading(false);
    }, 2000);
  };

  // Get password strength color
  const getPasswordStrengthColor = (strength) => {
    if (strength < 40) return "#e74c3c"; // Red
    if (strength < 70) return "#f39c12"; // Orange
    return "#2ecc71"; // Green
  };

  const passwordStrength = checkPasswordStrength(formData.password);

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Benefits */}
        <div className="register-left">
          <div className="benefits-content">
            <h1 className="benefits-title">Join Our Community</h1>
            <p className="benefits-subtitle">
              Create an account and unlock exclusive features for book lovers.
            </p>

            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">🎁</span>
                <div className="benefit-text">
                  <h3>Exclusive Discounts</h3>
                  <p>Get member-only discounts and early access to sales</p>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">📱</span>
                <div className="benefit-text">
                  <h3>Reading Tracker</h3>
                  <p>Track your reading progress and set reading goals</p>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">📚</span>
                <div className="benefit-text">
                  <h3>Personalized Library</h3>
                  <p>Build your digital library with notes and bookmarks</p>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">👥</span>
                <div className="benefit-text">
                  <h3>Community Access</h3>
                  <p>Join book clubs and discuss with fellow readers</p>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Readers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Books Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Customer Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="register-right">
          <div className="register-form-container">
            <div className="form-header">
              <h2 className="form-title">Create Your Account</h2>
              <p className="form-subtitle">
                Fill in your details to get started
              </p>
            </div>

            {/* Registration Form */}
            <form className="register-form" onSubmit={handleSubmit} noValidate>
              {/* Name Fields - Two Columns */}
              <div className="name-fields">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? "error" : ""}`}
                    placeholder="John"
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <div className="error-message">{errors.firstName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? "error" : ""}`}
                    placeholder="Doe"
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <div className="error-message">{errors.lastName}</div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="john.doe@example.com"
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
                    Password *
                  </label>
                  <button
                    type="button"
                    className="show-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈 Hide" : "👁️ Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-meter">
                      <div
                        className="strength-bar"
                        style={{
                          width: `${passwordStrength.strength}%`,
                          backgroundColor: getPasswordStrengthColor(
                            passwordStrength.strength
                          ),
                        }}
                      ></div>
                    </div>
                    <div className="strength-label">
                      Password strength:
                      <span
                        style={{
                          color: getPasswordStrengthColor(
                            passwordStrength.strength
                          ),
                        }}
                      >
                        {passwordStrength.strength < 40
                          ? " Weak"
                          : passwordStrength.strength < 70
                          ? " Fair"
                          : " Strong"}
                      </span>
                    </div>

                    {/* Password Requirements */}
                    <div className="password-requirements">
                      <div
                        className={`requirement ${
                          passwordStrength.requirements.length ? "met" : ""
                        }`}
                      >
                        {passwordStrength.requirements.length ? "✓" : "○"} At
                        least 8 characters
                      </div>
                      <div
                        className={`requirement ${
                          passwordStrength.requirements.uppercase ? "met" : ""
                        }`}
                      >
                        {passwordStrength.requirements.uppercase ? "✓" : "○"}{" "}
                        One uppercase letter
                      </div>
                      <div
                        className={`requirement ${
                          passwordStrength.requirements.lowercase ? "met" : ""
                        }`}
                      >
                        {passwordStrength.requirements.lowercase ? "✓" : "○"}{" "}
                        One lowercase letter
                      </div>
                      <div
                        className={`requirement ${
                          passwordStrength.requirements.number ? "met" : ""
                        }`}
                      >
                        {passwordStrength.requirements.number ? "✓" : "○"} One
                        number
                      </div>
                      <div
                        className={`requirement ${
                          passwordStrength.requirements.special ? "met" : ""
                        }`}
                      >
                        {passwordStrength.requirements.special ? "✓" : "○"} One
                        special character
                      </div>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password *
                  </label>
                  <button
                    type="button"
                    className="show-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "🙈 Hide" : "👁️ Show"}
                  </button>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.confirmPassword ? "error" : ""
                  }`}
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="form-group terms-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (errors.terms) {
                        setErrors({ ...errors, terms: "" });
                      }
                    }}
                    className="checkbox-input"
                    disabled={isLoading}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="terms-text">
                    I agree to the{" "}
                    <a href="/terms" className="terms-link">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="terms-link">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <div className="error-message">{errors.terms}</div>
                )}
              </div>

              {/* Newsletter Opt-in */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    disabled={isLoading}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="newsletter-text">
                    Send me updates about new books, promotions, and
                    recommendations
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Divider */}
              <div className="divider">
                <span>Already have an account?</span>
              </div>

              {/* Login Link */}
              <div className="login-link">
                <Link to="/login" className="login-btn">
                  Sign In to Your Account
                </Link>
              </div>
            </form>

            {/* Security Info */}
            <div className="security-info">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <span>Your data is securely encrypted</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🛡️</span>
                <span>We never share your personal information</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
