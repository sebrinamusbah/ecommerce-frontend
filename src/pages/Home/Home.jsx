import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBooks, useCategories, useAuth } from "../../hooks";
import "./Home.css";

const Home = () => {
  const { books, loading: booksLoading, fetchBooks } = useBooks();
  const { categories, loading: categoriesLoading } = useCategories();
  const { user } = useAuth();

  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter and organize books when data loads
  useEffect(() => {
    if (!booksLoading && books.length > 0) {
      // Featured books (could be based on rating or manual flag)
      const featured = books
        .filter((book) => book.featured || book.rating >= 4.5)
        .slice(0, 6);
      setFeaturedBooks(featured);

      // Best sellers (could be based on sales count or manual flag)
      const bestSeller = books
        .filter((book) => book.bestSeller || book.salesCount > 100)
        .slice(0, 6);
      setBestSellers(bestSeller);

      // New releases (based on publication date)
      const newRelease = books
        .sort(
          (a, b) =>
            new Date(b.publishedDate || b.createdAt) -
            new Date(a.publishedDate || a.createdAt)
        )
        .slice(0, 6);
      setNewReleases(newRelease);

      setLoading(false);
    }
  }, [books, booksLoading]);

  // Filter books based on search and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      book.category === selectedCategory._id ||
      book.category?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled in filteredBooks
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  if (loading || booksLoading) {
    return (
      <div className="home-loading">
        <div className="spinner"></div>
        <p>Loading amazing books for you...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Favorite Book</h1>
          <p className="hero-subtitle">
            Explore thousands of books from bestselling authors, new releases,
            and timeless classics.
            {user
              ? ` Welcome back, ${user.name}!`
              : " Start your reading journey today!"}
          </p>

          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <span className="search-icon">🔍</span>
              Search
            </button>
          </form>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{books.length}+</span>
              <span className="stat-label">Books Available</span>
            </div>
            <div className="stat">
              <span className="stat-number">{categories.length}+</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Online Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <Link to="/categories" className="view-all">
              View All Categories →
            </Link>
          </div>

          <div className="categories-grid">
            {categories.slice(0, 8).map((category) => (
              <button
                key={category._id}
                className={`category-card ${
                  selectedCategory?._id === category._id ? "active" : ""
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                <div className="category-icon">{category.icon || "📚"}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">
                  {
                    books.filter((book) => book.category === category._id)
                      .length
                  }{" "}
                  books
                </p>
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="active-filter">
              <span>
                Showing books in: <strong>{selectedCategory.name}</strong>
              </span>
              <button onClick={clearFilters} className="clear-filter">
                ✕ Clear Filter
              </button>
            </div>
          )}
        </section>
      )}

      {/* Featured Books Section */}
      {featuredBooks.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">Featured Books</h2>
            <p className="section-subtitle">
              Curated selection of must-read books
            </p>
          </div>

          <div className="books-grid">
            {featuredBooks.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-image-container">
                  <img
                    src={book.coverImage || "/api/placeholder/200/300"}
                    alt={book.title}
                    className="book-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/200/300";
                    }}
                  />
                  {book.discount && (
                    <span className="discount-badge">-{book.discount}%</span>
                  )}
                  <button className="quick-add-btn" title="Add to cart">
                    🛒
                  </button>
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <div className="book-meta">
                    <span className="book-rating">
                      ⭐ {book.rating || "4.0"}
                      <span className="rating-count">
                        ({book.reviewCount || "0"})
                      </span>
                    </span>
                    <span className="book-category">
                      {categories.find((c) => c._id === book.category)?.name ||
                        "General"}
                    </span>
                  </div>
                  <div className="book-price">
                    {book.discount ? (
                      <>
                        <span className="original-price">
                          {formatPrice(book.price)}
                        </span>
                        <span className="discounted-price">
                          {formatPrice(book.price * (1 - book.discount / 100))}
                        </span>
                      </>
                    ) : (
                      <span className="current-price">
                        {formatPrice(book.price)}
                      </span>
                    )}
                  </div>
                  <Link to={`/books/${book._id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="bestsellers-section">
          <div className="section-header">
            <h2 className="section-title">Best Sellers</h2>
            <Link to="/bestsellers" className="view-all">
              View All Bestsellers →
            </Link>
          </div>

          <div className="books-grid">
            {bestSellers.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-badge">🔥 Bestseller</div>
                <div className="book-image-container">
                  <img
                    src={book.coverImage || "/api/placeholder/200/300"}
                    alt={book.title}
                    className="book-image"
                  />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <div className="book-price">
                    <span className="current-price">
                      {formatPrice(book.price)}
                    </span>
                  </div>
                  <div className="book-actions">
                    <Link to={`/books/${book._id}`} className="btn-outline">
                      Details
                    </Link>
                    <button className="btn-primary">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New Releases Section */}
      {newReleases.length > 0 && (
        <section className="newreleases-section">
          <div className="section-header">
            <h2 className="section-title">New Releases</h2>
            <p className="section-subtitle">Fresh off the press</p>
          </div>

          <div className="books-grid">
            {newReleases.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-badge new-badge">NEW</div>
                <div className="book-image-container">
                  <img
                    src={book.coverImage || "/api/placeholder/200/300"}
                    alt={book.title}
                    className="book-image"
                  />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <div className="book-meta">
                    <span className="release-date">
                      📅 {new Date(book.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="book-price">
                    <span className="current-price">
                      {formatPrice(book.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search Results */}
      {(searchQuery || selectedCategory) && filteredBooks.length > 0 && (
        <section className="search-results-section">
          <div className="section-header">
            <h2 className="section-title">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : `Books in ${selectedCategory.name}`}
              <span className="results-count">
                {" "}
                ({filteredBooks.length} books)
              </span>
            </h2>
          </div>

          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-image-container">
                  <img
                    src={book.coverImage || "/api/placeholder/200/300"}
                    alt={book.title}
                    className="book-image"
                  />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <Link to={`/books/${book._id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Start Your Reading Journey Today</h2>
          <p className="cta-subtitle">
            Join thousands of readers who have found their next favorite book on
            Readify.
            {!user &&
              " Create an account to save your favorites and track your orders."}
          </p>
          <div className="cta-buttons">
            {!user ? (
              <>
                <Link to="/register" className="btn-primary btn-lg">
                  Sign Up Free
                </Link>
                <Link to="/books" className="btn-outline btn-lg">
                  Browse All Books
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="btn-primary btn-lg">
                  My Profile
                </Link>
                <Link to="/books" className="btn-outline btn-lg">
                  Continue Shopping
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Loading Skeleton (hidden but ready) */}
      <div className="skeleton-loader" style={{ display: "none" }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-author"></div>
            <div className="skeleton-price"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
