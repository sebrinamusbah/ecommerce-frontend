import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample book data - In real app, fetch from API using id
  const bookData = {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    originalPrice: 19.99,
    rating: 4.5,
    reviewCount: 1284,
    category: "Fiction",
    pages: 218,
    publishedYear: 1925,
    publisher: "Charles Scribner's Sons",
    isbn: "9780743273565",
    image:
      "https://via.placeholder.com/400x500/3498db/ffffff?text=The+Great+Gatsby",
    shortDescription:
      "A classic novel of the Jazz Age, exploring themes of idealism, resistance to change, social upheaval, and excess.",
    longDescription: `The Great Gatsby, F. Scott Fitzgerald's third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted "gin was the national drink and sex the national obsession," it is an exquisitely crafted tale of America in the 1920s.
    
    The Great Gatsby is one of the great classics of twentieth-century literature, a novel that poignantly expresses the American experience and continues to resonate with readers today. Fitzgerald's masterful storytelling and vivid prose create a timeless portrait of the American Dream and its disillusionment.`,
    stock: 15,
    isBestseller: true,
    isNewRelease: false,
  };

  // Sample related books
  const relatedBooks = [
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 14.99,
      rating: 4.8,
      image:
        "https://via.placeholder.com/150x200/2ecc71/ffffff?text=Mockingbird",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 10.99,
      rating: 4.7,
      image: "https://via.placeholder.com/150x200/9b59b6/ffffff?text=1984",
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 9.99,
      rating: 4.6,
      image: "https://via.placeholder.com/150x200/e74c3c/ffffff?text=Pride",
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      price: 11.99,
      rating: 4.4,
      image: "https://via.placeholder.com/150x200/f39c12/ffffff?text=Catcher",
    },
  ];

  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Quantity handlers
  const increaseQuantity = () => {
    if (quantity < bookData.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= bookData.stock) {
      setQuantity(value);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    alert(`Added ${quantity} copy(ies) of "${bookData.title}" to cart`);
    // In real app: dispatch to cart context/API
  };

  // Add to wishlist handler
  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
    alert(
      isInWishlist
        ? `Removed "${bookData.title}" from wishlist`
        : `Added "${bookData.title}" to wishlist`
    );
  };

  // Share book
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: bookData.title,
        text: `Check out "${bookData.title}" by ${bookData.author}`,
        url: window.location.href,
      });
    } else {
      alert("Share link copied to clipboard!");
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <>
        {"★".repeat(fullStars)}
        {hasHalfStar && "½"}
        {"☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </>
    );
  };

  return (
    <div className="book-details-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link> &gt;
          <Link to="/categories">Categories</Link> &gt;
          <Link to={`/categories?category=${bookData.category.toLowerCase()}`}>
            {bookData.category}
          </Link>{" "}
          &gt;
          <span>{bookData.title}</span>
        </div>
      </div>

      <div className="container book-details-container">
        {/* Main Book Details */}
        <div className="book-details-main">
          {/* Book Image */}
          <div className="book-image-section">
            <div className="book-image-container">
              <img
                src={bookData.image}
                alt={bookData.title}
                className="book-main-image"
              />
              {bookData.isBestseller && (
                <div className="book-badge bestseller">Bestseller</div>
              )}
              {bookData.isNewRelease && (
                <div className="book-badge new-release">New Release</div>
              )}
            </div>

            {/* Share and Wishlist Buttons */}
            <div className="book-actions">
              <button
                className={`action-btn wishlist-btn ${
                  isInWishlist ? "active" : ""
                }`}
                onClick={handleAddToWishlist}
              >
                {isInWishlist ? "❤️ In Wishlist" : "🤍 Add to Wishlist"}
              </button>
              <button className="action-btn share-btn" onClick={handleShare}>
                🔗 Share
              </button>
            </div>
          </div>

          {/* Book Info */}
          <div className="book-info-section">
            <div className="book-header">
              <h1 className="book-title">{bookData.title}</h1>
              <h2 className="book-author">by {bookData.author}</h2>

              <div className="book-rating-review">
                <div className="stars">
                  {renderStars(bookData.rating)}
                  <span className="rating-number">{bookData.rating}</span>
                </div>
                <span className="review-count">
                  ({bookData.reviewCount} reviews)
                </span>
                <Link to="#reviews" className="view-reviews">
                  View all reviews
                </Link>
              </div>
            </div>

            {/* Book Metadata */}
            <div className="book-metadata">
              <div className="metadata-item">
                <span className="metadata-label">Category:</span>
                <Link
                  to={`/categories?category=${bookData.category.toLowerCase()}`}
                  className="metadata-value"
                >
                  {bookData.category}
                </Link>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Publisher:</span>
                <span className="metadata-value">{bookData.publisher}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Published:</span>
                <span className="metadata-value">{bookData.publishedYear}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Pages:</span>
                <span className="metadata-value">{bookData.pages}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">ISBN:</span>
                <span className="metadata-value">{bookData.isbn}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="book-price-section">
              <div className="price-current">${bookData.price.toFixed(2)}</div>
              {bookData.originalPrice && (
                <div className="price-original">
                  ${bookData.originalPrice.toFixed(2)}
                </div>
              )}
              <div className="discount-badge">
                Save{" "}
                {Math.round(
                  (1 - bookData.price / bookData.originalPrice) * 100
                )}
                %
              </div>
            </div>

            {/* Short Description */}
            <div className="book-short-description">
              <p>{bookData.shortDescription}</p>
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {bookData.stock > 10 ? (
                <span className="in-stock">
                  🟢 In Stock ({bookData.stock} available)
                </span>
              ) : bookData.stock > 0 ? (
                <span className="low-stock">
                  🟡 Only {bookData.stock} left in stock
                </span>
              ) : (
                <span className="out-of-stock">🔴 Out of Stock</span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn minus"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={bookData.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn plus"
                    onClick={increaseQuantity}
                    disabled={quantity >= bookData.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-actions">
                <button
                  className="btn add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={bookData.stock === 0}
                >
                  🛒 Add to Cart (${(bookData.price * quantity).toFixed(2)})
                </button>
                <button
                  className="btn buy-now-btn"
                  onClick={() => {
                    handleAddToCart();
                    navigate("/cart");
                  }}
                  disabled={bookData.stock === 0}
                >
                  ⚡ Buy Now
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-item">
                <span>📦 Free shipping on orders over $30</span>
              </div>
              <div className="info-item">
                <span>↩️ 30-day return policy</span>
              </div>
              <div className="info-item">
                <span>🛡️ Secure checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Description/Details/Reviews */}
        <div className="book-tabs-section">
          <div className="tabs-header">
            <button
              className={`tab-btn ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({bookData.reviewCount})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === "description" && (
              <div className="tab-panel description-panel">
                <h3>About This Book</h3>
                <div className="description-content">
                  {bookData.longDescription
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="tab-panel details-panel">
                <h3>Product Details</h3>
                <table className="details-table">
                  <tbody>
                    <tr>
                      <th>Title</th>
                      <td>{bookData.title}</td>
                    </tr>
                    <tr>
                      <th>Author</th>
                      <td>{bookData.author}</td>
                    </tr>
                    <tr>
                      <th>Publisher</th>
                      <td>{bookData.publisher}</td>
                    </tr>
                    <tr>
                      <th>Publication Year</th>
                      <td>{bookData.publishedYear}</td>
                    </tr>
                    <tr>
                      <th>Pages</th>
                      <td>{bookData.pages}</td>
                    </tr>
                    <tr>
                      <th>ISBN</th>
                      <td>{bookData.isbn}</td>
                    </tr>
                    <tr>
                      <th>Language</th>
                      <td>English</td>
                    </tr>
                    <tr>
                      <th>Format</th>
                      <td>Paperback</td>
                    </tr>
                    <tr>
                      <th>Dimensions</th>
                      <td>5.5 x 8.5 inches</td>
                    </tr>
                    <tr>
                      <th>Weight</th>
                      <td>12 oz</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="tab-panel reviews-panel">
                <h3>Customer Reviews</h3>
                <div className="review-summary">
                  <div className="average-rating">
                    <div className="average-number">{bookData.rating}</div>
                    <div className="average-stars">
                      {renderStars(bookData.rating)}
                    </div>
                    <div className="average-count">
                      {bookData.reviewCount} reviews
                    </div>
                  </div>
                  <div className="rating-breakdown">
                    <div className="rating-bar">
                      <span>5 stars</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: "65%" }}></div>
                      </div>
                      <span>65%</span>
                    </div>
                    <div className="rating-bar">
                      <span>4 stars</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: "25%" }}></div>
                      </div>
                      <span>25%</span>
                    </div>
                    <div className="rating-bar">
                      <span>3 stars</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: "7%" }}></div>
                      </div>
                      <span>7%</span>
                    </div>
                    <div className="rating-bar">
                      <span>2 stars</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: "2%" }}></div>
                      </div>
                      <span>2%</span>
                    </div>
                    <div className="rating-bar">
                      <span>1 star</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: "1%" }}></div>
                      </div>
                      <span>1%</span>
                    </div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="sample-reviews">
                  <h4>Top Reviews</h4>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer">John D.</div>
                      <div className="review-rating">★★★★★</div>
                      <div className="review-date">January 15, 2024</div>
                    </div>
                    <div className="review-title">A timeless masterpiece</div>
                    <div className="review-content">
                      This book captures the essence of the Jazz Age like no
                      other. Fitzgerald's prose is both beautiful and haunting.
                      A must-read for everyone.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Books Section */}
        <div className="related-books-section">
          <h2 className="section-title">You May Also Like</h2>
          <div className="related-books-grid">
            {relatedBooks.map((book) => (
              <Link
                to={`/book/${book.id}`}
                key={book.id}
                className="related-book-card"
              >
                <div className="related-book-image">
                  <img src={book.image} alt={book.title} />
                </div>
                <div className="related-book-info">
                  <h3 className="related-book-title">{book.title}</h3>
                  <p className="related-book-author">{book.author}</p>
                  <div className="related-book-rating">
                    {renderStars(book.rating)} ({book.rating})
                  </div>
                  <div className="related-book-price">
                    ${book.price.toFixed(2)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
