import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/appContext.jsx";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const {
    user,
    cart,
    books,
    categories,
    loading,
    error,
    fetchBooks,
    fetchCategories,
    addToCart,
    login,
    register,
    logout,
  } = useAppContext();

  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from backend
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, []);
  // Add this useEffect for debugging
  useEffect(() => {
    console.log("Debug - Books state:", books);
    console.log("Debug - Categories state:", categories);
    console.log("Debug - User state:", user);
    console.log("Debug - Cart state:", cart);
  }, [books, categories, user, cart]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from real backend with a timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Backend timeout")), 5000)
      );

      try {
        // Race between API call and timeout
        await Promise.race([
          Promise.all([fetchBooks(), fetchCategories()]),
          timeoutPromise,
        ]);

        // Give time for state to update
        setTimeout(() => {
          updateUIFromState();
          setIsLoading(false);
        }, 100);
      } catch (apiError) {
        console.warn(
          "Backend not responding, using fallback data:",
          apiError.message
        );
        loadFallbackData();
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to load homepage data:", error);
      loadFallbackData();
      setIsLoading(false);
    }
  };

  const updateUIFromState = () => {
    // Set featured categories (first 6 categories)
    if (categories && categories.length > 0) {
      const featured = categories.slice(0, 6).map((cat, index) => ({
        id: cat.id,
        name: cat.name,
        count: cat.bookCount || Math.floor(Math.random() * 100) + 50,
        color: getCategoryColor(index),
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
      }));
      setFeaturedCategories(featured);
    }

    // Set popular books (first 6 books from API)
    if (books && books.length > 0) {
      const popular = books.slice(0, 6).map((book) => ({
        id: book.id,
        title: book.title || "Unknown Title",
        author: book.author || "Unknown Author",
        price: book.price || 0,
        rating: book.averageRating || 4.5,
        image:
          book.imageUrl ||
          `https://via.placeholder.com/150x200/3498db/ffffff?text=${(
            book.title || "Book"
          ).substring(0, 10)}`,
      }));
      setPopularBooks(popular);
    } else {
      // If no books, show empty state
      setPopularBooks([]);
    }
  };

  const loadFallbackData = () => {
    console.log("🔄 Loading fallback data...");

    // Fallback categories
    const fallbackCategories = [
      { id: 1, name: "Fiction", slug: "fiction", bookCount: 156 },
      { id: 2, name: "Non-Fiction", slug: "non-fiction", bookCount: 89 },
      { id: 3, name: "Science", slug: "science", bookCount: 67 },
      { id: 4, name: "Biography", slug: "biography", bookCount: 45 },
      { id: 5, name: "Technology", slug: "technology", bookCount: 92 },
      { id: 6, name: "Children", slug: "children", bookCount: 120 },
    ];

    // Fallback books
    const fallbackBooks = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 12.99,
        rating: 4.5,
        imageUrl:
          "https://via.placeholder.com/150x200/3498db/ffffff?text=Gatsby",
        categoryId: 1,
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 14.99,
        rating: 4.8,
        imageUrl:
          "https://via.placeholder.com/150x200/2ecc71/ffffff?text=Mockingbird",
        categoryId: 1,
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        price: 10.99,
        rating: 4.7,
        imageUrl: "https://via.placeholder.com/150x200/9b59b6/ffffff?text=1984",
        categoryId: 3,
      },
    ];

    // Update state
    setCategories(fallbackCategories);
    setBooks(fallbackBooks);

    // Set featured categories
    const featured = fallbackCategories.slice(0, 6).map((cat, index) => ({
      ...cat,
      count: cat.bookCount,
      color: getCategoryColor(index),
    }));
    setFeaturedCategories(featured);

    // Set popular books
    setPopularBooks(fallbackBooks);
  };

  const getCategoryColor = (index) => {
    const colors = [
      "#3498db",
      "#2ecc71",
      "#9b59b6",
      "#e74c3c",
      "#f39c12",
      "#1abc9c",
      "#34495e",
      "#16a085",
      "#8e44ad",
    ];
    return colors[index % colors.length];
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Change from /books to /categories
      navigate(`/categories?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAddToCart = async (e, bookId, bookTitle) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      const result = await addToCart(bookId, 1);
      if (result.success) {
        alert(`Added "${bookTitle}" to cart!`);
      } else {
        alert(result.error || "Failed to add to cart");
      }
    } catch (error) {
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleQuickView = (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/book/${bookId}`);
  };

  if (isLoading) {
    return (
      <div className="home-page loading">
        <div className="loading-spinner"></div>
        <p>Loading books and categories...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* HERO BANNER SECTION */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Readify Bookstore</h1>
          <p className="hero-subtitle">
            {user
              ? `Hello, ${user.name}! Discover your next read`
              : "Discover Your Next Favorite Book"}
          </p>
          <div className="hero-cta">
            <Link to="/categories" className="btn btn-primary">
              Browse All Books
            </Link>
            {user ? (
              <Link to="/cart" className="btn btn-secondary">
                View Cart ({cart ? cart.length : 0})
              </Link>
            ) : (
              <Link to="/register" className="btn btn-secondary">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="promo-badge">
            {books.length > 0
              ? `${books.length}+ Books Available`
              : "Thousands of Books"}
          </div>
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
            <span>Popular searches:</span>
            {featuredCategories.slice(0, 4).map((category) => (
              <button
                key={category.id}
                className="tag"
                onClick={() =>
                  navigate(`/categories?filter=${category.slug || category.id}`)
                }
              >
                {category.name}
              </button>
            ))}
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
                to={`/categories?filter=${category.slug || category.id}`}
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
          {popularBooks.length === 0 && !isLoading ? (
            <div className="no-books-message">
              <p>No books available. Check back soon!</p>
              <Link to="/categories" className="btn btn-primary">
                Browse All Books
              </Link>
            </div>
          ) : (
            <div className="books-grid">
              {popularBooks.map((book) => (
                <div key={book.id} className="book-card-wrapper">
                  <Link to={`/book/${book.id}`} className="book-card">
                    <div className="book-image">
                      <img src={book.image} alt={book.title} />
                      <div className="book-badge">Available</div>
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
                      <div className="book-price">
                        ${parseFloat(book.price).toFixed(2)}
                      </div>
                    </div>
                  </Link>
                  <div className="book-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => handleAddToCart(e, book.id, book.title)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="quick-view-btn"
                      onClick={(e) => handleQuickView(e, book.id)}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{books.length || "1000+"}</div>
              <div className="stat-label">Books Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{categories.length || "50+"}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {user ? "⭐ Member" : "Join Free"}
              </div>
              <div className="stat-label">
                {user ? "Premium Reader" : "Create Account"}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number">Free Shipping</div>
              <div className="stat-label">On orders over $25</div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Start Your Reading Journey Today</h2>
            <p className="cta-text">
              {user
                ? `Welcome back, ${user.name}! Continue exploring our collection.`
                : "Join thousands of readers who discovered their next favorite book with us."}
            </p>
            <div className="cta-buttons">
              <Link to="/categories" className="btn btn-primary btn-large">
                Browse All Books
              </Link>
              {user ? (
                <Link to="/profile" className="btn btn-secondary btn-large">
                  My Profile
                </Link>
              ) : (
                <Link to="/register" className="btn btn-secondary btn-large">
                  Create Free Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ERROR MESSAGE (if any) */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => loadData()}>Retry</button>
        </div>
        
        {/* Backend status indicator */}
<div className="backend-status" style={{
  position: 'fixed',
  top: '10px',
  right: '10px',
  background: books.length > 0 ? '#2ecc71' : '#e74c3c',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '4px',
  fontSize: '12px',
  zIndex: 1000
}}>
  {books.length > 0 ? '✅ Backend Connected' : '❌ Backend Offline'}
</div>
         
      {/* Temporary debug button - remove after testing */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#3498db",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          zIndex: 1000,
        }}
        onClick={async () => {
          console.log("=== DEBUG INFO ===");
          console.log("Books:", books);
          console.log("Categories:", categories);
          console.log("User:", user);
          console.log("Cart:", cart);
          console.log("Popular Books:", popularBooks);
          console.log("Featured Categories:", featuredCategories);
          console.log("API URL:", import.meta.env.VITE_API_URL);

          // Test backend directly
          console.log("Testing backend...");
          try {
            const response = await fetch(
              "https://readify-ecommerce-backend-1.onrender.com/api/health"
            );
            const data = await response.json();
            console.log("Backend health:", data);
          } catch (err) {
            console.error("Backend test failed:", err);
          }
        }}
      >
        🐛 Debug
      </button>
    </div>
  );
};

export default Home;
