import api from "./api";

const orderService = {
    /**
     * Get user orders
     */
    getOrders: async() => {
        try {
            const response = await api.get("/orders");
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch orders" };
        }
    },

    /**
     * Get order by ID
     * @param {string} id - Order ID
     */
    getOrderById: async(id) => {
        try {
            const response = await api.get(`/orders/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch order" };
        }
    },

    /**
     * Create new order
     * @param {Object} orderData - Order data
     */
    createOrder: async(orderData) => {
        try {
            const response = await api.post("/orders", orderData);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to create order" };
        }
    },

    /**
     * Update order status
     * @param {string} id - Order ID
     * @param {string} status - New status
     */
    updateOrderStatus: async(id, status) => {
        try {
            const response = await api.put(`/orders/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to update order status" };
        }
    },

    /**
     * Cancel order
     * @param {string} id - Order ID
     */
    cancelOrder: async(id) => {
        try {
            const response = await api.put(`/orders/${id}/cancel`);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to cancel order" };
        }
    },

    /**
     * Get order history
     */
    getOrderHistory: async() => {
        try {
            const response = await api.get("/orders/history");
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch order history" };
        }
    },
};

export default orderService;