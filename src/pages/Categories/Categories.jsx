import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext
import "./Categories.css";

const Categories = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, mockDB, getCategories, getBooks, addToCart } = useAuth();

  const selectedCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";

  // Real data from mock database
  const [categories, setCategories] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState({});

  // State for filters
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState([
    selectedCategory === "all" ? "all" : selectedCategory,
  ]);

  // Load data from mock database
  useEffect(() => {
    const dbCategories = getCategories();
    const dbBooks = getBooks();

    // Format categories for display
    const formattedCategories = [
      {
        id: 0,
        name: "All",
        count: dbBooks.length,
        slug: "all",
      },
      ...dbCategories.map((cat, index) => ({
        id: cat.id,
        name: cat.name,
        count: dbBooks.filter((book) => book.categoryId === cat.id).length,
        slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
      })),
    ];

    // Add sample categories if none exist
    if (dbCategories.length === 0) {
      formattedCategories.push(
        { id: 1, name: "Fiction", count: 150, slug: "fiction" },
        { id: 2, name: "Non-Fiction", count: 120, slug: "non-fiction" },
        { id: 3, name: "Science", count: 85, slug: "science" },
        { id: 4, name: "Biography", count: 65, slug: "biography" },
        { id: 5, name: "Technology", count: 90, slug: "technology" },
        { id: 6, name: "Children", count: 110, slug: "children" },
      );
    }

    setCategories(formattedCategories);

    // Format books for display
    const formattedBooks =
      dbBooks.length > 0
        ? dbBooks.map((book) => {
            const category = dbCategories.find((c) => c.id === book.categoryId);
            return {
              id: book.id,
              title: book.title,
              author: book.author,
              description: book.description,
              price: book.price,
              rating: 4.5, // Default rating for now
              category: category
                ? category.name.toLowerCase().replace(/\s+/g, "-")
                : "uncategorized",
              originalCategory: category?.name || "Uncategorized",
              categoryId: book.categoryId,
              stock: book.stock,
              image:
                book.imageUrl ||
                `https://via.placeholder.com/150x200/3498db/ffffff?text=${book.title.substring(0, 5)}`,
              isInStock: book.stock > 0,
              createdAt: book.createdAt,
            };
          })
        : getSampleBooks(); // Fallback to sample books

    setAllBooks(formattedBooks);
  }, [mockDB, getCategories, getBooks]);

  // Fallback sample books if database is empty
  const getSampleBooks = () => {
    return [
      {
        id: 1,
        title: "Sample Book 1",
        author: "Sample Author",
        price: 12.99,
        rating: 4.5,
        category: "fiction",
        originalCategory: "Fiction",
        stock: 15,
        image: "https://via.placeholder.com/150x200/3498db/ffffff?text=Book1",
        isInStock: true,
      },
      {
        id: 2,
        title: "Sample Book 2",
        author: "Sample Author",
        price: 15.99,
        rating: 4.8,
        category: "science",
        originalCategory: "Science",
        stock: 8,
        image: "https://via.placeholder.com/150x200/2ecc71/ffffff?text=Book2",
        isInStock: true,
      },
    ];
  };

  // Filter books based on selected category, search, and filters
  const filteredBooks = allBooks.filter((book) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !book.title.toLowerCase().includes(query) &&
        !book.author.toLowerCase().includes(query) &&
        !book.originalCategory.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Category filter
    if (
      !selectedCategories.includes("all") &&
      !selectedCategories.includes(book.category)
    ) {
      return false;
    }

    // Price filter
    if (book.price < priceRange[0] || book.price > priceRange[1]) {
      return false;
    }

    // Rating filter
    if (book.rating < minRating) {
      return false;
    }

    return true;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  // Handle category selection
  const handleCategoryClick = (categorySlug) => {
    if (categorySlug === "all") {
      setSelectedCategories(["all"]);
      navigate("/categories");
    } else {
      if (selectedCategories.includes("all")) {
        setSelectedCategories([categorySlug]);
        navigate(`/categories?category=${categorySlug}`);
      } else if (selectedCategories.includes(categorySlug)) {
        const newCategories = selectedCategories.filter(
          (cat) => cat !== categorySlug,
        );
        setSelectedCategories(
          newCategories.length > 0 ? newCategories : ["all"],
        );
        navigate(
          newCategories.length > 0
            ? `/categories?category=${newCategories[0]}`
            : "/categories",
        );
      } else {
        setSelectedCategories([...selectedCategories, categorySlug]);
        navigate(`/categories?category=${categorySlug}`);
      }
    }
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories(["all"]);
    setPriceRange([0, 100]);
    setMinRating(0);
    setSortBy("newest");
    navigate("/categories");
  };

  // Handle add to cart
  const handleAddToCart = async (book, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (
        window.confirm(
          "You need to login to add items to cart. Go to login page?",
        )
      ) {
        navigate("/login", { state: { from: "/categories" } });
      }
      return;
    }

    setIsAddingToCart((prev) => ({ ...prev, [book.id]: true }));

    try {
      await addToCart(book.id, 1);
      alert(`Added ${book.title} to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(`Failed to add ${book.title} to cart: ${error.message}`);
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [book.id]: false }));
    }
  };

  return (
    <div className="categories-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link> &gt; <span>Categories</span>
          {selectedCategory !== "all" && (
            <>
              {" "}
              &gt; <span className="current-category">{selectedCategory}</span>
            </>
          )}
        </div>
      </div>

      <div className="container categories-container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Browse Books by Category</h1>
          <p className="page-subtitle">
            Discover {filteredBooks.length} book
            {filteredBooks.length !== 1 ? "s" : ""} in our collection
            {searchQuery && (
              <span className="search-result"> for "{searchQuery}"</span>
            )}
          </p>
          {allBooks.length === 0 && user?.role === "admin" && (
            <div className="admin-prompt">
              <p>No books found. Add some books to get started!</p>
              <Link
                to="/admin/manage-books?tab=books"
                className="btn btn-primary btn-small"
              >
                Add Books
              </Link>
            </div>
          )}
        </div>

        <div className="categories-layout">
          {/* Sidebar - Filters */}
          <aside className="filters-sidebar">
            {/* Categories Filter */}
            <div className="filter-section">
              <h3 className="filter-title">Categories</h3>
              <div className="categories-list">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategories.includes(category.slug) ? "active" : ""}`}
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-section">
              <h3 className="filter-title">Price Range</h3>
              <div className="price-filter">
                <div className="price-range-display">
                  <span>$0 - ${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="price-slider"
                />
                <div className="price-labels">
                  <span>$0</span>
                  <span>$50</span>
                  <span>$100+</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-section">
              <h3 className="filter-title">Minimum Rating</h3>
              <div className="rating-filter">
                {[4, 3, 2, 1, 0].map((rating) => (
                  <button
                    key={rating}
                    className={`rating-btn ${minRating === rating ? "active" : ""}`}
                    onClick={() => setMinRating(rating)}
                  >
                    {rating === 0 ? "Any Rating" : `${rating}+ Stars`}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>

            {/* Database Info (for demo) */}
            {allBooks.length > 0 && (
              <div className="database-info">
                <p className="info-title">Database Info</p>
                <div className="info-item">
                  <span>Total Books:</span>
                  <span>{allBooks.length}</span>
                </div>
                <div className="info-item">
                  <span>Categories:</span>
                  <span>{categories.length - 1}</span>
                </div>
                <div className="info-item">
                  <span>Average Price:</span>
                  <span>
                    $
                    {(
                      allBooks.reduce((sum, book) => sum + book.price, 0) /
                      allBooks.length
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content - Books Grid */}
          <main className="books-main">
            {/* Sorting Options */}
            <div className="sorting-bar">
              <div className="sorting-options">
                <span className="sort-label">Sort by:</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              <div className="results-count">
                Showing {sortedBooks.length} of {allBooks.length} book
                {allBooks.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Books Grid */}
            {sortedBooks.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No books found</h3>
                <p>Try adjusting your filters or select different categories</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear All Filters
                </button>
                {allBooks.length === 0 && user?.role === "admin" && (
                  <Link
                    to="/admin/manage-books?tab=books"
                    className="btn btn-secondary"
                    style={{ marginLeft: "10px" }}
                  >
                    Add Books
                  </Link>
                )}
              </div>
            ) : (
              <div className="books-grid">
                {sortedBooks.map((book) => (
                  <div key={book.id} className="book-card-wrapper">
                    <Link to={`/book/${book.id}`} className="book-card">
                      <div className="book-image">
                        <img src={book.image} alt={book.title} />
                        <div className="book-category">
                          {book.originalCategory}
                        </div>
                        {!book.isInStock && (
                          <div className="book-badge out-of-stock">
                            Out of Stock
                          </div>
                        )}
                        {book.stock < 10 && book.stock > 0 && (
                          <div className="book-badge low-stock">Low Stock</div>
                        )}
                      </div>
                      <div className="book-info">
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">by {book.author}</p>
                        <div className="book-rating">
                          {"★".repeat(Math.floor(book.rating))}
                          {"☆".repeat(5 - Math.floor(book.rating))}
                          <span className="rating-number">({book.rating})</span>
                        </div>
                        <div className="book-price">
                          ${book.price.toFixed(2)}
                        </div>
                      </div>
                    </Link>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => handleAddToCart(book, e)}
                      disabled={isAddingToCart[book.id] || !book.isInStock}
                    >
                      {isAddingToCart[book.id] ? (
                        <>
                          <span className="spinner-small"></span>
                          Adding...
                        </>
                      ) : !book.isInStock ? (
                        "Out of Stock"
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination (Placeholder) */}
            {sortedBooks.length > 0 && (
              <div className="pagination">
                <button className="pagination-btn disabled">← Previous</button>
                <div className="pagination-pages">
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <span>...</span>
                  <button className="page-btn">10</button>
                </div>
                <button className="pagination-btn">Next →</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Categories;
