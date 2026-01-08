import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  // Sample data for featured categories
  const featuredCategories = [
    { id: 1, name: "Fiction", count: 150, color: "#3498db" },
    { id: 2, name: "Non-Fiction", count: 120, color: "#2ecc71" },
    { id: 3, name: "Science", count: 85, color: "#9b59b6" },
    { id: 4, name: "Biography", count: 65, color: "#e74c3c" },
    { id: 5, name: "Technology", count: 90, color: "#f39c12" },
    { id: 6, name: "Children", count: 110, color: "#1abc9c" },
  ];

  // Sample data for popular books
  const popularBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      rating: 4.5,
      image: "https://via.placeholder.com/150x200/3498db/ffffff?text=Book1",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 14.99,
      rating: 4.8,
      image: "https://via.placeholder.com/150x200/2ecc71/ffffff?text=Book2",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 10.99,
      rating: 4.7,
      image: "https://via.placeholder.com/150x200/9b59b6/ffffff?text=Book3",
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 9.99,
      rating: 4.6,
      image: "https://via.placeholder.com/150x200/e74c3c/ffffff?text=Book4",
    },
    {
      id: 5,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      price: 15.99,
      rating: 4.9,
      image: "https://via.placeholder.com/150x200/f39c12/ffffff?text=Book5",
    },
    {
      id: 6,
      title: "Moby Dick",
      author: "Herman Melville",
      price: 11.99,
      rating: 4.3,
      image: "https://via.placeholder.com/150x200/1abc9c/ffffff?text=Book6",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      // In real app: navigate to search results page
    }
  };

  return (
    <div className="home-page">
      {/* HERO BANNER SECTION */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Favorite Book</h1>
          <p className="hero-subtitle">New arrivals & exclusive promotions</p>
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

      {/* SEARCH BAR SECTION */}
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
            <button className="tag">Fiction</button>
            <button className="tag">Science</button>
            <button className="tag">Best Sellers</button>
            <button className="tag">New Releases</button>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
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

      {/* POPULAR BOOKS SECTION */}
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
                  <img src={book.image} alt={book.title} />
                  <div className="book-badge">Bestseller</div>
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
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
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
