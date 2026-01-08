import React from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import "./Admin.css";

const Dashboard = () => {
  // Sample data
  const stats = [
    {
      title: "Total Sales",
      value: "$24,580",
      change: "+12.5%",
      icon: "💰",
      color: "#2ecc71",
    },
    {
      title: "Total Orders",
      value: "1,248",
      change: "+8.2%",
      icon: "📦",
      color: "#3498db",
    },
    {
      title: "Total Users",
      value: "5,642",
      change: "+5.7%",
      icon: "👥",
      color: "#9b59b6",
    },
    {
      title: "Total Books",
      value: "2,451",
      change: "+3.4%",
      icon: "📚",
      color: "#e74c3c",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD001",
      customer: "John Doe",
      date: "2024-01-15",
      amount: "$45.99",
      status: "Delivered",
    },
    {
      id: "#ORD002",
      customer: "Jane Smith",
      date: "2024-01-14",
      amount: "$89.50",
      status: "Processing",
    },
    {
      id: "#ORD003",
      customer: "Bob Johnson",
      date: "2024-01-14",
      amount: "$32.99",
      status: "Shipped",
    },
    {
      id: "#ORD004",
      customer: "Alice Brown",
      date: "2024-01-13",
      amount: "$67.25",
      status: "Pending",
    },
    {
      id: "#ORD005",
      customer: "Charlie Wilson",
      date: "2024-01-12",
      amount: "$120.75",
      status: "Delivered",
    },
  ];

  const quickActions = [
    {
      title: "Add New Book",
      icon: "➕",
      link: "/admin/books/add",
      color: "#3498db",
    },
    {
      title: "View Orders",
      icon: "📋",
      link: "/admin/orders",
      color: "#2ecc71",
    },
    {
      title: "Manage Users",
      icon: "👥",
      link: "/admin/users",
      color: "#9b59b6",
    },
    {
      title: "Generate Report",
      icon: "📊",
      link: "/admin/reports",
      color: "#e74c3c",
    },
  ];

  return (
    <div className="admin-page">
      <AdminNavbar />

      <div className="admin-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-change">
                  <span
                    className={`change-indicator ${
                      stat.change.startsWith("+") ? "positive" : "negative"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="change-text"> from last month</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Recent Orders */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Recent Orders</h3>
              <Link to="/admin/orders" className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="card-content">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span
                          className={`status-badge status-${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn view-btn">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="card-content">
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <Link
                    to={action.link}
                    key={index}
                    className="quick-action-card"
                  >
                    <div
                      className="action-icon"
                      style={{ color: action.color }}
                    >
                      {action.icon}
                    </div>
                    <h4 className="action-title">{action.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sales Chart Placeholder */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Sales Overview</h3>
              <select className="time-select">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="card-content">
              <div className="chart-placeholder">
                <div className="chart-bars">
                  {[40, 65, 80, 60, 75, 90, 70].map((height, index) => (
                    <div
                      key={index}
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <div className="chart-labels">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="card-content">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">📚</div>
                  <div className="activity-content">
                    <p>
                      <strong>New book added:</strong> "The Psychology of Money"
                    </p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <p>
                      <strong>New user registered:</strong> jane.doe@email.com
                    </p>
                    <span className="activity-time">4 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💰</div>
                  <div className="activity-content">
                    <p>
                      <strong>Order completed:</strong> #ORD006 for $67.50
                    </p>
                    <span className="activity-time">6 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🔄</div>
                  <div className="activity-content">
                    <p>
                      <strong>Inventory updated:</strong> 15 books restocked
                    </p>
                    <span className="activity-time">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
