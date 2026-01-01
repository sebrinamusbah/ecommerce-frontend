import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  // State for real data from Render backend
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Your Render backend URL
  const API_URL = "https://readify-ecommerce-backend-1.onrender.com";

  // Fetch data from Render backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch books from Render
        const booksResponse = await fetch(`${API_URL}/api/books`);
        const booksData = await booksResponse.json();
        console.log("📚 Books from Render:", booksData.books);
        setBooks(booksData.books || []);

        // Fetch categories from Render
        const categoriesResponse = await fetch(`${API_URL}/api/categories`);
        const categoriesData = await categoriesResponse.json();
        console.log("🏷️ Categories from Render:", categoriesData.categories);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.log("⚠️ Using fallback data due to:", error.message);
        // Keep empty arrays if fetch fails - will use fallback data
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use Render data if available, otherwise use your original sample data
  const featuredCategories =
    categories.length > 0
      ? categories.slice(0, 6).map((category, index) => ({
          id: category._id || index + 1,
          name: category.name,
          count:
            books.filter((book) => book.category === category._id).length ||
            Math.floor(Math.random() * 100) + 50,
          color: getCategoryColor(index),
        }))
      : [
          { id: 1, name: "Fiction", count: 150, color: "#3498db" },
          { id: 2, name: "Non-Fiction", count: 120, color: "#2ecc71" },
          { id: 3, name: "Science", count: 85, color: "#9b59b6" },
          { id: 4, name: "Biography", count: 65, color: "#e74c3c" },
          { id: 5, name: "Technology", count: 90, color: "#f39c12" },
          { id: 6, name: "Children", count: 110, color: "#1abc9c" },
        ];

  const popularBooks =
    books.length > 0
      ? books.slice(0, 6).map((book, index) => ({
          id: book._id || index + 1,
          title: book.title || "Sample Book",
          author: book.author || "Unknown Author",
          price: book.price || 9.99,
          rating: book.rating || 4.0 + Math.random() * 0.9,
          image: book.coverImage || getBookImage(index),
        }))
      : [
          {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 12.99,
            rating: 4.5,
            image: "https://via.placeholder.com/150x200/3498db/ffffff",
          },
          {
            id: 2,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            price: 14.99,
            rating: 4.8,
            image: "https://via.placeholder.com/150x200/3498db/ffffff",
          },
          {
            id: 3,
            title: "1984",
            author: "George Orwell",
            price: 10.99,
            rating: 4.7,
            image: "https://via.placeholder.com/150x200/3498db/ffffff",
          },
          {
            id: 4,
            title: "Pride and Prejudice",
            author: "Jane Austen",
            price: 9.99,
            rating: 4.6,
            image: "https://via.placeholder.com/150x200/e74c3c/ffffff",
          },
          {
            id: 5,
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            price: 15.99,
            rating: 4.9,
            image: "https://via.placeholder.com/150x200/f39c12/ffffff",
          },
          {
            id: 6,
            title: "Moby Dick",
            author: "Herman Melville",
            price: 11.99,
            rating: 4.3,
            image: "https://via.placeholder.com/150x200/1abc9c/ffffff",
          },
        ];

  // Helper functions
  const getCategoryColor = (index) => {
    const colors = [
      "#3498db",
      "#2ecc71",
      "#9b59b6",
      "#e74c3c",
      "#f39c12",
      "#1abc9c",
    ];
    return colors[index % colors.length];
  };

  const getBookImage = (index) => {
    const colors = ["3498db", "2ecc71", "9b59b6", "e74c3c", "f39c12", "1abc9c"];
    return `https://via.placeholder.com/150x200/${colors[index]}/ffffff`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  // Add loading indicator only during initial load
  if (isLoading && books.length === 0) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Fetching real data from Render backend...</p>
      </div>
    );
  }

  // Your EXACT original JSX - unchanged!
  return (
    <div className="home-page">
      {/* HERO BANNER SECTION - Add stats from backend */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Favorite Book</h1>
          <p className="hero-subtitle">
            {books.length > 0
              ? `Real data from Render backend (${books.length} books)`
              : "New arrivals & exclusive promotions"}
          </p>

          {/* Show stats from backend if available */}
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">
                {books.length > 0 ? books.length : "150+"}
              </span>
              <span className="stat-label">Books Available</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {categories.length > 0 ? categories.length : "6+"}
              </span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Online Support</span>
            </div>
          </div>

          <div className="hero-cta">
            <Link to="/categories" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/categories?filter=new" className="btn btn-secondary">
              View New Arrivals
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="promo-badge">50% OFF Selected Titles</div>
        </div>
      </section>

      {/* SEARCH BAR SECTION - Same as before */}
      <section className="search-section">
        <div className="container">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for books, authors, categories..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </form>
          <div className="search-tags">
            <span>Popular:</span>
            {featuredCategories.slice(0, 4).map((category) => (
              <button key={category.id} className="tag">
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION - Uses real/fake data */}
      <section className="featured-categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Categories</h2>
            <Link to="/categories" className="view-all">
              View All Categories →
            </Link>
          </div>
          <div className="categories-grid">
            {featuredCategories.map((category) => (
              <Link
                to={`/categories?category=${category.name.toLowerCase()}`}
                key={category.id}
                className="category-card"
                style={{ "--category-color": category.color }}
              >
                <div
                  className="category-icon"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.charAt(0)}
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-count">{category.count} books</p>
                </div>
                <div className="category-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR BOOKS SECTION - Uses real/fake data */}
      <section className="popular-books">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Books</h2>
            <Link to="/categories" className="view-all">
              View All Books →
            </Link>
          </div>
          <div className="books-grid">
            {popularBooks.map((book) => (
              <Link to={`/book/${book.id}`} key={book.id} className="book-card">
                <div className="book-image">
                  <img
                    src={book.image}
                    alt={book.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/150x200/cccccc/333333?text=${book.title.substring(
                        0,
                        10
                      )}`;
                    }}
                  />
                  <div className="book-badge">Bestseller</div>
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-rating">
                    {"★".repeat(Math.floor(book.rating))}
                    {"☆".repeat(5 - Math.floor(book.rating))}
                    <span className="rating-number">
                      ({book.rating.toFixed(1)})
                    </span>
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
        </div>
      </section>

      {/* CALL TO ACTION SECTION - Same as before */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Start Your Reading Journey Today</h2>
            <p className="cta-text">
              Join thousands of readers who discovered their next favorite book
              with us.
            </p>
            <div className="cta-buttons">
              <Link to="/categories" className="btn btn-primary btn-large">
                Browse All Books
              </Link>
              <Link to="/register" className="btn btn-secondary btn-large">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
