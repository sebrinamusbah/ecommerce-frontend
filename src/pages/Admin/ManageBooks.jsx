import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AdminNavbar from "../../components/Admin/AdminNavbar";

//import "./ManageBooks.css";

const ManageBooks = () => {
  const { get, post, put, del } = useApi();
  const { createBook, updateBook, deleteBook } = useAdmin();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    status: "all",
    sortBy: "newest",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);

  // Form states
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "",
    isbn: "",
    pages: "",
    language: "English",
    publisher: "",
    publishedYear: new Date().getFullYear(),
    coverImage: "",
    isFeatured: false,
  });

  // Fetch books and categories
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        get("/books?limit=1000"),
        get("/categories"),
      ]);

      if (booksRes?.books) setBooks(booksRes.books);
      if (categoriesRes?.categories) setCategories(categoriesRes.categories);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  const filteredBooks = books.filter((book) => {
    // Category filter
    if (
      filters.category !== "all" &&
      book.categoryId !== parseInt(filters.category)
    ) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !book.title.toLowerCase().includes(searchLower) &&
        !book.author.toLowerCase().includes(searchLower) &&
        !book.isbn?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    // Status filter
    if (filters.status === "out_of_stock" && book.stock > 0) return false;
    if (filters.status === "low_stock" && (book.stock === 0 || book.stock > 10))
      return false;
    if (filters.status === "in_stock" && book.stock <= 0) return false;

    return true;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "stock_low":
        return a.stock - b.stock;
      case "stock_high":
        return b.stock - a.stock;
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "oldest":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  // Initialize
  useEffect(() => {
    fetchData();
  }, []);

  // Reset form
  const resetForm = () => {
    setBookForm({
      title: "",
      author: "",
      price: "",
      stock: "",
      categoryId: categories[0]?.id || "",
      description: "",
      isbn: "",
      pages: "",
      language: "English",
      publisher: "",
      publishedYear: new Date().getFullYear(),
      coverImage: "",
      isFeatured: false,
    });
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add new book
  const handleAddBook = async () => {
    try {
      const bookData = {
        ...bookForm,
        price: parseFloat(bookForm.price),
        stock: parseInt(bookForm.stock),
        pages: bookForm.pages ? parseInt(bookForm.pages) : null,
        publishedYear: bookForm.publishedYear
          ? parseInt(bookForm.publishedYear)
          : null,
        categoryId: parseInt(bookForm.categoryId),
      };

      const result = await createBook(bookData);
      if (result.success) {
        setShowAddModal(false);
        resetForm();
        await fetchData();
      }
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  // Edit book
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setBookForm({
      title: book.title || "",
      author: book.author || "",
      price: book.price || "",
      stock: book.stock || "",
      categoryId: book.categoryId || categories[0]?.id || "",
      description: book.description || "",
      isbn: book.isbn || "",
      pages: book.pages || "",
      language: book.language || "English",
      publisher: book.publisher || "",
      publishedYear: book.publishedYear || new Date().getFullYear(),
      coverImage: book.coverImage || "",
      isFeatured: book.isFeatured || false,
    });
    setShowEditModal(true);
  };

  // Update book
  const handleUpdateBook = async () => {
    if (!selectedBook) return;

    try {
      const bookData = {
        ...bookForm,
        price: parseFloat(bookForm.price),
        stock: parseInt(bookForm.stock),
        pages: bookForm.pages ? parseInt(bookForm.pages) : null,
        publishedYear: bookForm.publishedYear
          ? parseInt(bookForm.publishedYear)
          : null,
        categoryId: parseInt(bookForm.categoryId),
      };

      const result = await updateBook(selectedBook.id, bookData);
      if (result.success) {
        setShowEditModal(false);
        setSelectedBook(null);
        await fetchData();
      }
    } catch (err) {
      console.error("Error updating book:", err);
    }
  };

  // Delete book
  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const result = await deleteBook(bookId);
        if (result.success) {
          await fetchData();
        }
      } catch (err) {
        console.error("Error deleting book:", err);
      }
    }
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedBooks.length === 0) return;

    try {
      if (action === "delete") {
        if (window.confirm(`Delete ${selectedBooks.length} book(s)?`)) {
          await Promise.all(selectedBooks.map((bookId) => deleteBook(bookId)));
          await fetchData();
          setSelectedBooks([]);
        }
      } else if (action === "feature") {
        await Promise.all(
          selectedBooks.map((bookId) =>
            updateBook(bookId, { isFeatured: true })
          )
        );
        await fetchData();
        setSelectedBooks([]);
      } else if (action === "unfeature") {
        await Promise.all(
          selectedBooks.map((bookId) =>
            updateBook(bookId, { isFeatured: false })
          )
        );
        await fetchData();
        setSelectedBooks([]);
      }
    } catch (err) {
      console.error("Error performing bulk action:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="manage-books">
        <AdminNavbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-books">
      <AdminNavbar />

      <div className="manage-books-layout">
        <AdminSidebar />

        <main className="manage-books-main">
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">Manage Books</h1>
              <p className="page-subtitle">
                {books.length} total books • {filteredBooks.length} filtered
              </p>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
              >
                <span className="btn-icon">➕</span>
                Add New Book
              </button>
              <button className="btn btn-secondary" onClick={fetchData}>
                <span className="btn-icon">🔄</span>
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="books-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label>Category</label>
                <select
                  className="filter-select"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Stock Status</label>
                <select
                  className="filter-select"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="all">All Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock (&lt;10)</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Sort By</label>
                <select
                  className="filter-select"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="stock_low">Stock: Low to High</option>
                  <option value="stock_high">Stock: High to Low</option>
                </select>
              </div>

              <div className="filter-group search-group">
                <label>Search Books</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by title, author, or ISBN..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedBooks.length > 0 && (
            <div className="bulk-actions">
              <div className="bulk-info">
                {selectedBooks.length} book(s) selected
              </div>
              <div className="bulk-buttons">
                <select
                  className="bulk-select"
                  onChange={(e) => handleBulkAction(e.target.value)}
                >
                  <option value="">Bulk Actions</option>
                  <option value="feature">Mark as Featured</option>
                  <option value="unfeature">Remove Featured</option>
                  <option value="delete">Delete Selected</option>
                </select>
                <button
                  className="btn btn-outline"
                  onClick={() => setSelectedBooks([])}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Books Grid */}
          <div className="books-grid">
            {currentBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-card-header">
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBooks([...selectedBooks, book.id]);
                      } else {
                        setSelectedBooks(
                          selectedBooks.filter((id) => id !== book.id)
                        );
                      }
                    }}
                  />
                  <div className="book-status">
                    {book.isFeatured && (
                      <span className="badge featured">Featured</span>
                    )}
                    <span
                      className={`badge stock-${
                        book.stock > 10
                          ? "high"
                          : book.stock > 0
                          ? "low"
                          : "out"
                      }`}
                    >
                      {book.stock > 10
                        ? "In Stock"
                        : book.stock > 0
                        ? `Low (${book.stock})`
                        : "Out"}
                    </span>
                  </div>
                </div>

                <div className="book-image">
                  <img
                    src={
                      book.coverImage ||
                      `https://via.placeholder.com/150x200/cccccc/333333?text=${encodeURIComponent(
                        book.title.substring(0, 10)
                      )}`
                    }
                    alt={book.title}
                  />
                </div>

                <div className="book-info">
                  <h3 className="book-title" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="book-author">{book.author}</p>
                  <p className="book-category">
                    {categories.find((c) => c.id === book.categoryId)?.name ||
                      "Uncategorized"}
                  </p>
                  <div className="book-price">${book.price.toFixed(2)}</div>
                  <div className="book-stock">
                    Stock: <strong>{book.stock}</strong>
                  </div>
                </div>

                <div className="book-actions">
                  <Link
                    to={`/book/${book.id}`}
                    className="action-btn view"
                    target="_blank"
                  >
                    👁️ View
                  </Link>
                  <button
                    className="action-btn edit"
                    onClick={() => handleEditBook(book)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredBooks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No books found</h3>
              <p>Try adjusting your filters or add new books.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFilters({
                    category: "all",
                    search: "",
                    status: "all",
                    sortBy: "newest",
                  });
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      className={`page-number ${
                        page === currentPage ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
              </div>

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next →
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="books-stats">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-number">{books.length}</div>
                <div className="stat-label">Total Books</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-number">
                  {books.filter((b) => b.isFeatured).length}
                </div>
                <div className="stat-label">Featured</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-number">
                  {books.filter((b) => b.stock === 0).length}
                </div>
                <div className="stat-label">Out of Stock</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">
                  $
                  {books
                    .reduce((sum, book) => sum + book.price * book.stock, 0)
                    .toFixed(2)}
                </div>
                <div className="stat-label">Inventory Value</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Book</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={bookForm.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={bookForm.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={bookForm.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={bookForm.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="categoryId"
                    value={bookForm.categoryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={bookForm.isbn}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Pages</label>
                  <input
                    type="number"
                    name="pages"
                    value={bookForm.pages}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Language</label>
                  <input
                    type="text"
                    name="language"
                    value={bookForm.language}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    value={bookForm.publisher}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Published Year</label>
                  <input
                    type="number"
                    name="publishedYear"
                    value={bookForm.publishedYear}
                    onChange={handleInputChange}
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Cover Image URL</label>
                  <input
                    type="text"
                    name="coverImage"
                    value={bookForm.coverImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/book-cover.jpg"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={bookForm.description}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={bookForm.isFeatured}
                      onChange={handleInputChange}
                    />
                    Mark as Featured
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddBook}>
                Add Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && selectedBook && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Book</h2>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Same form structure as Add Book Modal */}
              <div className="form-grid">
                {/* ... Same form fields as Add Book Modal ... */}
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={bookForm.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* ... All other form fields ... */}

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={bookForm.isFeatured}
                      onChange={handleInputChange}
                    />
                    Mark as Featured
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateBook}>
                Update Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
