import api from "./api";

const categoryService = {
    /**
     * Get all categories
     */
    getAllCategories: async() => {
        try {
            const response = await api.get("/categories");
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch categories" };
        }
    },

    /**
     * Get category by ID
     * @param {string} id - Category ID
     */
    getCategoryById: async(id) => {
        try {
            const response = await api.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch category" };
        }
    },

    /**
     * Get categories with book counts
     */
    getCategoriesSummary: async() => {
        try {
            const response = await api.get("/categories/summary");
            return response.data;
        } catch (error) {
            throw (
                error.response ? .data || { error: "Failed to fetch categories summary" }
            );
        }
    },

    /**
     * Search categories
     * @param {string} query - Search query
     */
    searchCategories: async(query) => {
        try {
            const response = await api.get("/categories/search", {
                params: { q: query },
            });
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Search failed" };
        }
    },

    /**
     * Get category by slug
     * @param {string} slug - Category slug
     */
    getCategoryBySlug: async(slug) => {
        try {
            const response = await api.get(`/categories/slug/${slug}`);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch category" };
        }
    },
};

export default categoryService;