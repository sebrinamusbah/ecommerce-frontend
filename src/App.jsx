// In src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Categories from "./pages/Categories/Categories";
import BookDetails from "./pages/BookDetails/BookDetails";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Admin/Dashboard";
import ManageBooks from "./pages/Admin/ManageBooks";
import Orders from "./pages/Admin/Orders";
import Users from "./pages/Admin/Users";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

// Create simple placeholder components for missing admin pages
const ManageBooksPlaceholder = () => (
  <div className="admin-page">
    <h1>Manage Books Page</h1>
  </div>
);
const OrdersPlaceholder = () => (
  <div className="admin-page">
    <h1>Orders Page</h1>
  </div>
);
const UsersPlaceholder = () => (
  <div className="admin-page">
    <h1>Users Page</h1>
  </div>
);
const ReportsPlaceholder = () => (
  <div className="admin-page">
    <h1>Reports Page</h1>
  </div>
);
const SettingsPlaceholder = () => (
  <div className="admin-page">
    <h1>Settings Page</h1>
  </div>
);

function App() {
  return (
    <Router>
      {" "}
      {/* ✅ Changed from AuthProvider to Router */}
      <div className="app-container">
        {/* Only show main navbar on non-admin routes */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Navbar />} />
        </Routes>

        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes - Protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/books"
              element={
                <ProtectedRoute requireAdmin>
                  <ManageBooksPlaceholder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute requireAdmin>
                  <OrdersPlaceholder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <UsersPlaceholder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requireAdmin>
                  <ReportsPlaceholder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAdmin>
                  <SettingsPlaceholder />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Only show footer on non-admin routes */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
