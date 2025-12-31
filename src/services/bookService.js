import api from "./api";

const bookService = {
  // Get all books with optional filters
  getAllBooks: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/books?${params.toString()}`);
    return response.data;
  },

  // Get single book by ID
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Get featured books
  getFeaturedBooks: async () => {
    const response = await api.get("/books/featured");
    return response.data;
  },

  // Get books by category
  getBooksByCategory: async (category) => {
    const response = await api.get(`/books/category/${category}`);
    return response.data;
  },

  // Search books
  searchBooks: async (query) => {
    const response = await api.get(`/books/search?q=${query}`);
    return response.data;
  },

  // Create book (admin only)
  createBook: async (bookData) => {
    const response = await api.post("/books", bookData);
    return response.data;
  },

  // Update book (admin only)
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Delete book (admin only)
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

export default bookService;
