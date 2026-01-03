import api from "./api";

const bookService = {
    getAllBooks: async(params = {}) => {
        try {
            const response = await api.get("/books", { params });
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch books" };
        }
    },

    getFeaturedBooks: async() => {
        try {
            const response = await api.get("/books/featured");
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch featured books" };
        }
    },

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
};

export default bookService;