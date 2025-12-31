import api from "./api";

const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  // Get user's orders
  getOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get all orders (admin only)
  getAllOrders: async () => {
    const response = await api.get("/orders/all");
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};

export default orderService;
