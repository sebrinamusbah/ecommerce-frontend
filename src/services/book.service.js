import api from "./api";

const bookService = {
    /**
     * Get all books with optional filters
     * @param {Object} params - Query parameters (page, limit, category, search, etc.)
     */
    getAllBooks: async(params = {}) => {
        try {
            const response = await api.get("/books", { params });
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch books" };
        }
    },

    /**
     * Get single book by ID
     * @param {string} id - Book ID
     */
    getBookById: async(id) => {
        try {
            const response = await api.get(`/books/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch book details" };
        }
    },

    /**
     * Search books
     * @param {string} query - Search query
     */
    searchBooks: async(query) => {
        try {
            const response = await api.get("/books/search", {
                params: { q: query },
            });
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Search failed" };
        }
    },

    /**
     * Get featured books
     */
    getFeaturedBooks: async() => {
        try {
            const response = await api.get("/books/featured");
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch featured books" };
        }
    },

    /**
     * Get books by category
     * @param {string} categoryId - Category ID
     */
    getBooksByCategory: async(categoryId) => {
        try {
            const response = await api.get(`/books/category/${categoryId}`);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch category books" };
        }
    },

    /**
     * Filter books with multiple criteria
     * @param {Object} filters - Filter criteria
     */
    filterBooks: async(filters) => {
        try {
            const response = await api.get("/books/filter", {
                params: filters,
            });
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Filter failed" };
        }
    },

    /**
     * Get book reviews
     * @param {string} bookId - Book ID
     */
    getBookReviews: async(bookId) => {
        try {
            const response = await api.get(`/books/${bookId}/reviews`);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch reviews" };
        }
    },

    /**
     * Add book review
     * @param {string} bookId - Book ID
     * @param {Object} reviewData - Review data
     */
    addBookReview: async(bookId, reviewData) => {
        try {
            const response = await api.post(`/books/${bookId}/reviews`, reviewData);
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to add review" };
        }
    },
};

export default bookService;