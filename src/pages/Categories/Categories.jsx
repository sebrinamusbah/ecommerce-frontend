import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Categories.css";

const Categories = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";

  // Categories data
  const categories = [
    { id: 1, name: "All", count: 620, slug: "all" },
    { id: 2, name: "Fiction", count: 150, slug: "fiction" },
    { id: 3, name: "Non-Fiction", count: 120, slug: "non-fiction" },
    { id: 4, name: "Science", count: 85, slug: "science" },
    { id: 5, name: "Biography", count: 65, slug: "biography" },
    { id: 6, name: "Technology", count: 90, slug: "technology" },
    { id: 7, name: "Children", count: 110, slug: "children" },
    { id: 8, name: "Romance", count: 75, slug: "romance" },
    { id: 9, name: "Mystery", count: 60, slug: "mystery" },
    { id: 10, name: "Fantasy", count: 95, slug: "fantasy" },
    { id: 11, name: "History", count: 70, slug: "history" },
    { id: 12, name: "Business", count: 55, slug: "business" },
  ];

  // Sample books data
  const allBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      rating: 4.5,
      category: "fiction",
      image: "https://via.placeholder.com/150x200/3498db/ffffff?text=Book1",
    },
    {
      id: 2,
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      price: 15.99,
      rating: 4.8,
      category: "science",
      image: "https://via.placeholder.com/150x200/2ecc71/ffffff?text=Book2",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 10.99,
      rating: 4.7,
      category: "fiction",
      image: "https://via.placeholder.com/150x200/9b59b6/ffffff?text=Book3",
    },
    {
      id: 4,
      title: "Steve Jobs",
      author: "Walter Isaacson",
      price: 18.99,
      rating: 4.6,
      category: "biography",
      image: "https://via.placeholder.com/150x200/e74c3c/ffffff?text=Book4",
    },
    {
      id: 5,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      price: 15.99,
      rating: 4.9,
      category: "fantasy",
      image: "https://via.placeholder.com/150x200/f39c12/ffffff?text=Book5",
    },
    {
      id: 6,
      title: "Atomic Habits",
      author: "James Clear",
      price: 16.99,
      rating: 4.8,
      category: "non-fiction",
      image: "https://via.placeholder.com/150x200/1abc9c/ffffff?text=Book6",
    },
    {
      id: 7,
      title: "The Cat in the Hat",
      author: "Dr. Seuss",
      price: 8.99,
      rating: 4.4,
      category: "children",
      image: "https://via.placeholder.com/150x200/3498db/ffffff?text=Book7",
    },
    {
      id: 8,
      title: "The Lean Startup",
      author: "Eric Ries",
      price: 19.99,
      rating: 4.5,
      category: "business",
      image: "https://via.placeholder.com/150x200/2ecc71/ffffff?text=Book8",
    },
    {
      id: 9,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 9.99,
      rating: 4.6,
      category: "romance",
      image: "https://via.placeholder.com/150x200/9b59b6/ffffff?text=Book9",
    },
    {
      id: 10,
      title: "The Da Vinci Code",
      author: "Dan Brown",
      price: 13.99,
      rating: 4.3,
      category: "mystery",
      image: "https://via.placeholder.com/150x200/e74c3c/ffffff?text=Book10",
    },
    {
      id: 11,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      price: 17.99,
      rating: 4.7,
      category: "history",
      image: "https://via.placeholder.com/150x200/f39c12/ffffff?text=Book11",
    },
    {
      id: 12,
      title: "Clean Code",
      author: "Robert C. Martin",
      price: 29.99,
      rating: 4.9,
      category: "technology",
      image: "https://via.placeholder.com/150x200/1abc9c/ffffff?text=Book12",
    },
  ];

  // State for filters
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState([
    selectedCategory === "all" ? "all" : selectedCategory,
  ]);

  // Filter books based on selected category and filters
  const filteredBooks = allBooks.filter((book) => {
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
        return b.id - a.id; // Assuming higher ID = newer
    }
  });

  // Handle category selection
  const handleCategoryClick = (categorySlug) => {
    if (categorySlug === "all") {
      setSelectedCategories(["all"]);
    } else {
      if (selectedCategories.includes("all")) {
        setSelectedCategories([categorySlug]);
      } else if (selectedCategories.includes(categorySlug)) {
        setSelectedCategories(
          selectedCategories.filter((cat) => cat !== categorySlug)
        );
      } else {
        setSelectedCategories([...selectedCategories, categorySlug]);
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
  };

  return (
    <div className="categories-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link> &gt; <span>Categories</span>
        </div>
      </div>

      <div className="container categories-container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Browse Books by Category</h1>
          <p className="page-subtitle">
            Discover {filteredBooks.length} books in our collection
          </p>
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
                    className={`category-btn ${
                      selectedCategories.includes(category.slug) ? "active" : ""
                    }`}
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
                    className={`rating-btn ${
                      minRating === rating ? "active" : ""
                    }`}
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
                Showing {sortedBooks.length} of {allBooks.length} books
              </div>
            </div>

            {/* Books Grid */}
            {sortedBooks.length === 0 ? (
              <div className="no-results">
                <h3>No books found</h3>
                <p>Try adjusting your filters or select different categories</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="books-grid">
                {sortedBooks.map((book) => (
                  <Link
                    to={`/book/${book.id}`}
                    key={book.id}
                    className="book-card"
                  >
                    <div className="book-image">
                      <img src={book.image} alt={book.title} />
                      <div className="book-category">{book.category}</div>
                    </div>
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">by {book.author}</p>
                      <div className="book-rating">
                        {"★".repeat(Math.floor(book.rating))}
                        {"☆".repeat(5 - Math.floor(book.rating))}
                        <span className="rating-number">({book.rating})</span>
                      </div>
                      <div className="book-price">${book.price.toFixed(2)}</div>
                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Added ${book.title} to cart`);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </Link>
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
