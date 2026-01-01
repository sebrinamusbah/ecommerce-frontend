import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "https://readify-ecommerce-backend-1.onrender.com";

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

  // Helper to handle image URLs
  const getBookImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://via.placeholder.com/150x200/cccccc/333333?text=No+Image";
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // If it starts with /uploads, construct full URL
    if (imagePath.startsWith("/uploads")) {
      return `${API_URL}${imagePath}`;
    }

    return imagePath;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch books with categories included
        const booksResponse = await fetch(
          `${API_URL}/api/books?include=category`
        );
        if (!booksResponse.ok) {
          throw new Error(`HTTP error! status: ${booksResponse.status}`);
        }

        const booksData = await booksResponse.json();
        console.log("📚 Books API Response:", booksData);

        // Handle different response structures
        let booksArray = [];
        if (booksData.books && Array.isArray(booksData.books)) {
          booksArray = booksData.books;
        } else if (booksData.data && Array.isArray(booksData.data)) {
          booksArray = booksData.data;
        } else if (Array.isArray(booksData)) {
          booksArray = booksData;
        } else if (booksData && typeof booksData === "object") {
          // If it's a single book object, wrap in array
          booksArray = [booksData];
        }

        setBooks(booksArray);

        // Fetch categories
        try {
          const categoriesResponse = await fetch(`${API_URL}/api/categories`);
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            console.log("🏷️ Categories API Response:", categoriesData);

            let categoriesArray = [];
            if (
              categoriesData.categories &&
              Array.isArray(categoriesData.categories)
            ) {
              categoriesArray = categoriesData.categories;
            } else if (
              categoriesData.data &&
              Array.isArray(categoriesData.data)
            ) {
              categoriesArray = categoriesData.data;
            } else if (Array.isArray(categoriesData)) {
              categoriesArray = categoriesData;
            }

            setCategories(categoriesArray);
          }
        } catch (catError) {
          console.warn(
            "Could not fetch categories separately:",
            catError.message
          );
          // We'll extract categories from books if available
        }
      } catch (error) {
        console.error("❌ Error fetching books:", error);
        setError(error.message);

        // Try alternative endpoints
        try {
          console.log("🔄 Trying alternative endpoint...");
          const altResponse = await fetch(`${API_URL}/books`);
          if (altResponse.ok) {
            const altData = await altResponse.json();
            console.log("✅ Alternative endpoint response:", altData);

            if (altData && Array.isArray(altData)) {
              setBooks(altData);
            }
          }
        } catch (altError) {
          console.error("Alternative endpoint also failed:", altError.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract categories from books if not fetched separately
  useEffect(() => {
    if (categories.length === 0 && books.length > 0) {
      // Extract unique categories from books
      const uniqueCategories = [];
      const seenCategories = new Set();

      books.forEach((book) => {
        if (
          book.category &&
          book.category.id &&
          !seenCategories.has(book.category.id)
        ) {
          seenCategories.add(book.category.id);
          uniqueCategories.push(book.category);
        } else if (book.categoryId && !seenCategories.has(book.categoryId)) {
          seenCategories.add(book.categoryId);
          uniqueCategories.push({
            id: book.categoryId,
            name: `Category ${book.categoryId}`,
          });
        }
      });

      if (uniqueCategories.length > 0) {
        console.log("📂 Extracted categories from books:", uniqueCategories);
        setCategories(uniqueCategories);
      }
    }
  }, [books, categories.length]);

  // Process featured categories
  const featuredCategories =
    categories.length > 0
      ? categories.slice(0, 6).map((category, index) => {
          // Count books in this category
          let bookCount = 0;
          if (books.length > 0) {
            bookCount = books.filter((book) => {
              // Check different ways category might be stored
              if (book.category && book.category.id === category.id)
                return true;
              if (book.categoryId === category.id) return true;
              if (book.category && book.category._id === category.id)
                return true;
              if (book.categoryId === category._id) return true;
              return false;
            }).length;
          }

          return {
            id: category.id || category._id || index + 1,
            name: category.name || `Category ${index + 1}`,
            slug:
              category.slug ||
              category.name?.toLowerCase().replace(/\s+/g, "-"),
            count: bookCount || Math.floor(Math.random() * 100) + 50,
            color: getCategoryColor(index),
          };
        })
      : [
          {
            id: 1,
            name: "Fiction",
            slug: "fiction",
            count: 150,
            color: "#3498db",
          },
          {
            id: 2,
            name: "Non-Fiction",
            slug: "non-fiction",
            count: 120,
            color: "#2ecc71",
          },
          {
            id: 3,
            name: "Science Fiction",
            slug: "science-fiction",
            count: 85,
            color: "#9b59b6",
          },
          {
            id: 4,
            name: "Fantasy",
            slug: "fantasy",
            count: 65,
            color: "#e74c3c",
          },
          {
            id: 5,
            name: "Biography",
            slug: "biography",
            count: 90,
            color: "#f39c12",
          },
          {
            id: 6,
            name: "Self-Help",
            slug: "self-help",
            count: 110,
            color: "#1abc9c",
          },
        ];

  // Process popular books - show featured books first, then others
  const popularBooks =
    books.length > 0
      ? books
          // Sort: featured first, then by rating, then by title
          .sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            if (a.rating !== b.rating) return b.rating - a.rating;
            return a.title.localeCompare(b.title);
          })
          .slice(0, 6) // Take top 6
          .map((book) => {
            // Get category name
            let categoryName = "Unknown Category";
            if (book.category && book.category.name) {
              categoryName = book.category.name;
            } else if (book.categoryId && categories.length > 0) {
              const foundCategory = categories.find(
                (cat) =>
                  cat.id === book.categoryId || cat._id === book.categoryId
              );
              if (foundCategory) {
                categoryName = foundCategory.name;
              }
            }

            return {
              id:
                book.id ||
                book._id ||
                `book-${book.title?.replace(/\s+/g, "-")}`,
              title: book.title || "Untitled Book",
              author: book.author || "Unknown Author",
              price: book.price || 0,
              rating: book.rating || 4.0,
              isFeatured: book.isFeatured || false,
              image: getBookImageUrl(book.coverImage),
              category: categoryName,
              description: book.description || "",
              originalBook: book,
            };
          })
      : [];

  // Loading state
  if (isLoading && books.length === 0) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading books from database...</p>
        <p className="loading-subtext">
          Fetching {books.length > 0 ? `${books.length} books` : "data"} from
          backend
        </p>
      </div>
    );
  }

  // Error state
  if (error && books.length === 0) {
    return (
      <div className="home-error">
        <h2>⚠️ Connection Error</h2>
        <p>Could not connect to backend: {error}</p>
        <p>Please check:</p>
        <ul>
          <li>Is your backend server running?</li>
          <li>Is the API URL correct? ({API_URL})</li>
          <li>Check browser console for detailed error</li>
        </ul>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* HERO BANNER SECTION */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Favorite Book</h1>
          <p className="hero-subtitle">
            {books.length > 0
              ? `Browse our collection of ${books.length} books across ${categories.length} categories`
              : "New arrivals & exclusive promotions"}
          </p>

          {/* Stats from backend */}
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">
                {books.length > 0 ? books.length : "24+"}
              </span>
              <span className="stat-label">Books Available</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {categories.length > 0 ? categories.length : "12+"}
              </span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {books.filter((b) => b.isFeatured).length}+
              </span>
              <span className="stat-label">Featured</span>
            </div>
          </div>

          <div className="hero-cta">
            <Link to="/categories" className="btn btn-primary">
              Shop Now
            </Link>
            <Link
              to="/categories?filter=featured"
              className="btn btn-secondary"
            >
              View Featured
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="promo-badge">50% OFF Selected Titles</div>
          {popularBooks.length > 0 && (
            <div className="hero-book-showcase">
              <img
                src={popularBooks[0].image}
                alt={popularBooks[0].title}
                className="showcase-book"
              />
              <div className="showcase-book-info">
                <h4>{popularBooks[0].title}</h4>
                <p>by {popularBooks[0].author}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* DEBUG INFO - Remove in production */}
      {process.env.NODE_ENV === "development" && books.length > 0 && (
        <div className="debug-info">
          <details>
            <summary>Debug Info ({books.length} books loaded)</summary>
            <div className="debug-content">
              <p>
                <strong>First Book:</strong> {books[0].title}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {books[0].category?.name || "No category"}
              </p>
              <p>
                <strong>Image URL:</strong>{" "}
                {books[0].coverImage?.substring(0, 50)}...
              </p>
              <p>
                <strong>Featured Books:</strong>{" "}
                {books.filter((b) => b.isFeatured).length}
              </p>
            </div>
          </details>
        </div>
      )}

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
            <span>Popular Categories:</span>
            {featuredCategories.slice(0, 4).map((category) => (
              <Link
                to={`/categories?category=${
                  category.slug || category.name.toLowerCase()
                }`}
                key={category.id}
                className="tag"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="featured-categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <Link to="/categories" className="view-all">
              View All {categories.length} Categories →
            </Link>
          </div>
          <div className="categories-grid">
            {featuredCategories.map((category) => (
              <Link
                to={`/categories?category=${
                  category.slug || category.name.toLowerCase()
                }`}
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
            <h2 className="section-title">
              {books.filter((b) => b.isFeatured).length > 0
                ? "Featured & Popular Books"
                : "Popular Books"}
            </h2>
            <Link to="/categories" className="view-all">
              View All {books.length} Books →
            </Link>
          </div>

          {popularBooks.length === 0 ? (
            <div className="no-books-message">
              <p>No books available in the database yet.</p>
              <Link to="/admin" className="btn btn-primary">
                Add Books
              </Link>
            </div>
          ) : (
            <>
              <div className="books-grid">
                {popularBooks.map((book) => (
                  <div className="book-card-wrapper" key={book.id}>
                    <Link to={`/book/${book.id}`} className="book-card">
                      <div className="book-image">
                        <img
                          src={book.image}
                          alt={book.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/150x200/3498db/ffffff?text=${encodeURIComponent(
                              book.title.substring(0, 10)
                            )}`;
                          }}
                        />
                        {book.isFeatured && (
                          <div className="book-badge">Featured</div>
                        )}
                        {book.rating >= 4.5 && (
                          <div className="book-badge bestseller">
                            Bestseller
                          </div>
                        )}
                      </div>
                      <div className="book-info">
                        <div className="book-category-tag">{book.category}</div>
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">by {book.author}</p>
                        <div className="book-rating">
                          {"★".repeat(Math.floor(parseFloat(book.rating) || 0))}
                          {"☆".repeat(
                            5 - Math.floor(parseFloat(book.rating) || 0)
                          )}
                          <span className="rating-number">
                            {(parseFloat(book.rating) || 0).toFixed(1)}
                          </span>
                        </div>

                        <div className="book-price">
                          ${book.price.toFixed(2)}
                        </div>
                        <button
                          className="add-to-cart-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            alert(`Added "${book.title}" to cart`);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Book Stats */}
              <div className="books-stats">
                <div className="stat-item">
                  <span className="stat-number">{books.length}</span>
                  <span className="stat-label">Total Books</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {books.filter((b) => b.isFeatured).length}
                  </span>
                  <span className="stat-label">Featured</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    $
                    {books
                      .reduce((sum, book) => sum + (book.price || 0), 0)
                      .toFixed(2)}
                  </span>
                  <span className="stat-label">Total Value</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* DATABASE INFO SECTION */}
      {books.length > 0 && (
        <section className="database-info">
          <div className="container">
            <div className="database-content">
              <h3>📊 Database Connected Successfully</h3>
              <div className="database-stats">
                <div className="db-stat">
                  <strong>Books:</strong> {books.length} records
                </div>
                <div className="db-stat">
                  <strong>Categories:</strong> {categories.length} categories
                </div>
                <div className="db-stat">
                  <strong>Avg Price:</strong> $
                  {(
                    books.reduce((sum, book) => sum + (book.price || 0), 0) /
                    books.length
                  ).toFixed(2)}
                </div>
                <div className="db-stat">
                  <strong>Avg Rating:</strong>
                  {(
                    books.reduce((sum, book) => sum + (book.rating || 0), 0) /
                    books.length
                  ).toFixed(1)}{" "}
                  ⭐
                </div>
              </div>
              <p className="db-note">
                Your database contains {books.length} books from your seeder
                script.
                {books.filter((b) => b.isFeatured).length > 0 &&
                  ` ${
                    books.filter((b) => b.isFeatured).length
                  } are marked as featured.`}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CALL TO ACTION SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Start Your Reading Journey Today</h2>
            <p className="cta-text">
              {books.length > 0
                ? `Choose from ${books.length} books across ${categories.length} categories.`
                : "Join thousands of readers who discovered their next favorite book with us."}
            </p>
            <div className="cta-buttons">
              <Link to="/categories" className="btn btn-primary btn-large">
                Browse All Books
              </Link>
              {books.length > 0 && (
                <Link
                  to="/categories?sort=featured"
                  className="btn btn-secondary btn-large"
                >
                  View Featured
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
