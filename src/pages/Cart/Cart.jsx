import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();

  // Sample cart items data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      originalPrice: 19.99,
      quantity: 1,
      image: "https://via.placeholder.com/100x130/3498db/ffffff?text=Gatsby",
      category: "Fiction",
      stock: 15,
    },
    {
      id: 2,
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      price: 15.99,
      originalPrice: 24.99,
      quantity: 2,
      image: "https://via.placeholder.com/100x130/2ecc71/ffffff?text=History",
      category: "Science",
      stock: 8,
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      price: 16.99,
      originalPrice: 22.99,
      quantity: 1,
      image: "https://via.placeholder.com/100x130/1abc9c/ffffff?text=Habits",
      category: "Non-Fiction",
      stock: 20,
    },
  ]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 30 ? 0 : 5.99; // Free shipping over $30
  const total = subtotal + tax + shipping;

  // Quantity handlers
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id && item.quantity < item.stock) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  };

  const updateQuantity = (id, newQuantity) => {
    const quantity = Math.max(1, Math.min(newQuantity, 100)); // Limit 1-100
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.min(quantity, item.stock) };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?"
      )
    ) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    }
  };

  // Clear entire cart
  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      setCartItems([]);
    }
  };

  // Move item to wishlist
  const moveToWishlist = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      alert(`Moved "${item.title}" to your wishlist`);
      removeItem(id);
    }
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add some books first!");
      return;
    }
    alert("Proceeding to checkout...");
    // In real app: navigate to checkout page
    // navigate('/checkout');
  };

  // Continue shopping
  const continueShopping = () => {
    navigate("/categories");
  };

  // Save cart for later
  const saveForLater = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      alert(`Saved "${item.title}" for later`);
      removeItem(id);
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        {/* Page Header */}
        <div className="cart-header">
          <h1 className="cart-title">Your Shopping Cart</h1>
          <p className="cart-subtitle">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        <div className="cart-layout">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            {/* Cart Actions Bar */}
            <div className="cart-actions-bar">
              <button
                className="clear-cart-btn"
                onClick={clearCart}
                disabled={cartItems.length === 0}
              >
                🗑️ Clear Cart
              </button>
              <div className="cart-total-items">
                Total:{" "}
                <span className="highlight">{cartItems.length} items</span>
              </div>
            </div>

            {/* Empty Cart State */}
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h2 className="empty-cart-title">Your cart is empty</h2>
                <p className="empty-cart-message">
                  Looks like you haven't added any books to your cart yet.
                </p>
                <button
                  className="btn btn-primary btn-large"
                  onClick={continueShopping}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <Link to={`/book/${item.id}`}>
                          <img src={item.image} alt={item.title} />
                        </Link>
                      </div>

                      <div className="cart-item-details">
                        <div className="item-header">
                          <Link to={`/book/${item.id}`} className="item-title">
                            {item.title}
                          </Link>
                          <button
                            className="remove-item-btn"
                            onClick={() => removeItem(item.id)}
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>

                        <p className="item-author">by {item.author}</p>

                        <div className="item-category">
                          Category:
                          <Link
                            to={`/categories?category=${item.category.toLowerCase()}`}
                          >
                            {item.category}
                          </Link>
                        </div>

                        <div className="item-stock">
                          {item.quantity >= item.stock ? (
                            <span className="stock-warning">
                              Only {item.stock} left in stock!
                            </span>
                          ) : (
                            <span className="stock-ok">In Stock</span>
                          )}
                        </div>

                        <div className="item-actions">
                          <button
                            className="action-btn"
                            onClick={() => saveForLater(item.id)}
                          >
                            💾 Save for later
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => moveToWishlist(item.id)}
                          >
                            ❤️ Move to wishlist
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-quantity">
                        <div className="quantity-control">
                          <button
                            className="quantity-btn minus"
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="quantity-input"
                          />
                          <button
                            className="quantity-btn plus"
                            onClick={() => increaseQuantity(item.id)}
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                        <div className="quantity-limit">Max: {item.stock}</div>
                      </div>

                      <div className="cart-item-price">
                        <div className="price-current">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        {item.originalPrice && (
                          <div className="price-original">
                            ${(item.originalPrice * item.quantity).toFixed(2)}
                          </div>
                        )}
                        <div className="price-per-unit">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="cart-summary">
                  <div className="summary-row">
                    <span className="summary-label">
                      Subtotal ({cartItems.length} items):
                    </span>
                    <span className="summary-value">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Estimated Tax (8%):</span>
                    <span className="summary-value">${tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Shipping:</span>
                    <span
                      className={`summary-value ${
                        shipping === 0 ? "free-shipping" : ""
                      }`}
                    >
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="summary-row shipping-note">
                    {shipping === 0 ? (
                      <span>🎉 You've qualified for free shipping!</span>
                    ) : (
                      <span>
                        Add ${(30 - subtotal).toFixed(2)} more to get FREE
                        shipping
                      </span>
                    )}
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span className="summary-label">Total:</span>
                    <span className="summary-value total-amount">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {cartItems.length > 0 && (
            <div className="order-summary-sidebar">
              <div className="summary-card">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-details">
                  <div className="detail-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Shipping:</span>
                    <span className={shipping === 0 ? "free" : ""}>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="detail-divider"></div>
                  <div className="detail-row total">
                    <span>Total:</span>
                    <span className="total-amount">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button
                    className="btn btn-primary checkout-btn"
                    onClick={proceedToCheckout}
                  >
                    🛒 Proceed to Checkout
                  </button>

                  <button
                    className="btn btn-secondary continue-btn"
                    onClick={continueShopping}
                  >
                    ← Continue Shopping
                  </button>
                </div>

                {/* Payment Methods */}
                <div className="payment-methods">
                  <p className="payment-title">We accept:</p>
                  <div className="payment-icons">
                    <span className="payment-icon">💳</span>
                    <span className="payment-icon">📱</span>
                    <span className="payment-icon">🏦</span>
                    <span className="payment-icon">🔗</span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="security-info">
                  <div className="security-item">
                    <span className="security-icon">🔒</span>
                    <span>Secure SSL Encryption</span>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">🛡️</span>
                    <span>30-Day Return Policy</span>
                  </div>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="promo-card">
                <h4 className="promo-title">Have a promo code?</h4>
                <div className="promo-input-group">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="promo-input"
                  />
                  <button className="promo-btn">Apply</button>
                </div>
                <p className="promo-note">Free shipping on orders over $30</p>
              </div>

              {/* Need Help Section */}
              <div className="help-card">
                <h4 className="help-title">Need help?</h4>
                <p className="help-text">
                  Our customer support team is here to help!
                </p>
                <div className="help-contacts">
                  <button className="help-btn">📞 Call Us</button>
                  <button className="help-btn">💬 Live Chat</button>
                  <button className="help-btn">✉️ Email</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recently Viewed (Placeholder) */}
        {cartItems.length > 0 && (
          <div className="recently-viewed">
            <h3 className="recently-title">Recently Viewed</h3>
            <p className="recently-note">
              You might be interested in these books you recently viewed...
            </p>
            {/* In real app, this would show actual recently viewed items */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
