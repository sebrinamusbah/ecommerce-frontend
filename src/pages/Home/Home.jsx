import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user, mockDB, getCategories, getBooks, addToCart } = useAuth();

  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState({});

  // Load data from mock database
  useEffect(() => {
    const categories = getCategories();
    const books = getBooks();

    // Set featured categories (or use sample if none)
    if (categories.length > 0) {
      setFeaturedCategories(
        categories.slice(0, 6).map((cat, index) => ({
          id: cat.id,
          name: cat.name,
          count: books.filter((book) => book.categoryId === cat.id).length,
          color: getCategoryColor(index),
        })),
      );
    } else {
      // Use sample categories if none in DB
      setFeaturedCategories([
        { id: 1, name: "Fiction", count: 150, color: "#3498db" },
        { id: 2, name: "Non-Fiction", count: 120, color: "#2ecc71" },
        { id: 3, name: "Science", count: 85, color: "#9b59b6" },
        { id: 4, name: "Biography", count: 65, color: "#e74c3c" },
        { id: 5, name: "Technology", count: 90, color: "#f39c12" },
        { id: 6, name: "Children", count: 110, color: "#1abc9c" },
      ]);
    }

    // Set popular books (use real books or sample)
    if (books.length > 0) {
      const displayBooks = books.slice(0, 6).map((book) => {
        const category = categories.find((c) => c.id === book.categoryId);
        return {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          rating: 4.5, // Default rating
          image:
            book.imageUrl ||
            `https://via.placeholder.com/150x200/3498db/ffffff?text=${book.title.substring(0, 5)}`,
          isInStock: book.stock > 0,
          stock: book.stock,
        };
      });
      setPopularBooks(displayBooks);
    }
    // If no books in DB, keep the sample books from your original code
  }, [mockDB, getCategories, getBooks]);

  // Helper function for category colors (matches your original colors)
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAddToCart = async (book, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (
        window.confirm(
          "You need to login to add items to cart. Go to login page?",
        )
      ) {
        navigate("/login", { state: { from: "/" } });
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
    <div className="home-page">
      {/* HERO BANNER SECTION - NO CHANGES TO STRUCTURE */}
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

      {/* SEARCH BAR SECTION - NO CHANGES TO STRUCTURE */}
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

      {/* FEATURED CATEGORIES SECTION - MINIMAL DATA CHANGES ONLY */}
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

      {/* POPULAR BOOKS SECTION - MINIMAL DATA CHANGES ONLY */}
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION - NO CHANGES */}
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
