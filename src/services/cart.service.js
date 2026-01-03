import api from "./api";

const cartService = {
    /**
     * Get user's cart
     */
    getCart: async() => {
        try {
            const response = await api.get("/cart");
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch cart" };
        }
    },

    /**
     * Add item to cart
     * @param {string} bookId - Book ID
     * @param {number} quantity - Quantity (default: 1)
     */
    addToCart: async(bookId, quantity = 1) => {
        try {
            const response = await api.post("/cart", { bookId, quantity });
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to add to cart" };
        }
    },

    /**
     * Update cart item quantity
     * @param {string} itemId - Cart item ID
     * @param {number} quantity - New quantity
     */
    updateCartItem: async(itemId, quantity) => {
        try {
            const response = await api.put(`/cart/${itemId}`, { quantity });
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to update cart item" };
        }
    },

    /**
     * Remove item from cart
     * @param {string} itemId - Cart item ID
     */
    removeFromCart: async(itemId) => {
        try {
            const response = await api.delete(`/cart/${itemId}`);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to remove from cart" };
        }
    },

    /**
     * Clear entire cart
     */
    clearCart: async() => {
        try {
            const response = await api.delete("/cart");
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to clear cart" };
        }
    },

    /**
     * Get cart item count
     */
    getCartCount: async() => {
        try {
            const response = await api.get("/cart/count");
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to get cart count" };
        }
    },

    /**
     * Move item to wishlist
     * @param {string} itemId - Cart item ID
     */
    moveToWishlist: async(itemId) => {
        try {
            const response = await api.post(`/cart/${itemId}/move-to-wishlist`);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to move to wishlist" };
        }
    },
};

export default cartService;