import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { user, mockDB, getUserCart, checkout, getBooks, getCategories } =
    useAuth();

  // Use real cart items from AuthContext
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Load cart items from mock database
  useEffect(() => {
    if (user) {
      const userCart = getUserCart();

      // Enrich cart items with book details
      const enrichedCartItems = userCart
        .map((cartItem) => {
          const book = getBooks().find((b) => b.id === cartItem.bookId);
          const category = getCategories().find(
            (c) => c.id === book?.categoryId,
          );

          if (!book) return null;

          return {
            id: cartItem.id,
            bookId: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            originalPrice: book.price * 1.3, // Simulate discount
            quantity: cartItem.quantity,
            image:
              book.imageUrl ||
              `https://via.placeholder.com/100x130/3498db/ffffff?text=${book.title.substring(0, 5)}`,
            category: category?.name || "Uncategorized",
            stock: book.stock,
            description: book.description,
          };
        })
        .filter((item) => item !== null);

      setCartItems(enrichedCartItems);
    }
  }, [user, mockDB, getUserCart, getBooks, getCategories]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 30 ? 0 : 5.99; // Free shipping over $30
  const total = subtotal + tax + shipping;

  // Quantity handlers - update mockDB through AuthContext
  const increaseQuantity = (bookId) => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    const cartItem = cartItems.find((item) => item.bookId === bookId);
    if (cartItem && cartItem.quantity < cartItem.stock) {
      // Update in mockDB via AuthContext
      const { addToCart } = useAuth();
      addToCart(bookId, 1);

      // Update local state
      setCartItems(
        cartItems.map((item) =>
          item.bookId === bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    }
  };

  const decreaseQuantity = (bookId) => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    const cartItem = cartItems.find((item) => item.bookId === bookId);
    if (cartItem && cartItem.quantity > 1) {
      // We need to remove one item
      // In a real app, we'd have updateCartQuantity function
      // For now, we'll simulate by removing and re-adding
      const { addToCart } = useAuth();

      // Remove current item
      removeItem(cartItem.id);

      // Add back with decreased quantity
      if (cartItem.quantity - 1 > 0) {
        setTimeout(() => {
          addToCart(bookId, cartItem.quantity - 1);
        }, 100);
      }
    } else if (cartItem && cartItem.quantity === 1) {
      removeItem(cartItem.id);
    }
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    const quantity = Math.max(1, Math.min(newQuantity, 100));
    const cartItem = cartItems.find((item) => item.bookId === bookId);

    if (cartItem) {
      const finalQuantity = Math.min(quantity, cartItem.stock);

      // Remove current item
      removeItem(cartItem.id);

      // Add back with new quantity
      setTimeout(() => {
        const { addToCart } = useAuth();
        addToCart(bookId, finalQuantity);
      }, 100);
    }
  };

  // Remove item from cart
  const removeItem = (cartItemId) => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?",
      )
    ) {
      // Update mockDB
      const updatedCartItems = mockDB.cartItems.filter(
        (item) => item.id !== cartItemId,
      );
      const updatedDB = {
        ...mockDB,
        cartItems: updatedCartItems,
      };
      localStorage.setItem("bookstoreDB", JSON.stringify(updatedDB));

      // Update local state
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
    }
  };

  // Clear entire cart
  const clearCart = () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      // Clear only current user's cart items
      const updatedCartItems = mockDB.cartItems.filter(
        (item) => item.userId !== user.id,
      );
      const updatedDB = {
        ...mockDB,
        cartItems: updatedCartItems,
      };
      localStorage.setItem("bookstoreDB", JSON.stringify(updatedDB));

      // Update local state
      setCartItems([]);
    }
  };

  // Move item to wishlist (simulated)
  const moveToWishlist = (bookId) => {
    const item = cartItems.find((item) => item.bookId === bookId);
    if (item) {
      alert(`Moved "${item.title}" to your wishlist`);
      removeItem(item.id);
    }
  };

  // Save cart for later (simulated)
  const saveForLater = (bookId) => {
    const item = cartItems.find((item) => item.bookId === bookId);
    if (item) {
      alert(`Saved "${item.title}" for later`);
      removeItem(item.id);
    }
  };

  // Proceed to checkout - REAL IMPLEMENTATION
  const proceedToCheckout = async () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty. Add some books first!");
      return;
    }

    setIsCheckingOut(true);

    try {
      // Use the checkout function from AuthContext
      const order = await checkout();

      alert(
        `Order #${order.id} placed successfully!\nTotal: $${order.totalAmount.toFixed(2)}`,
      );

      // Clear cart in local state
      setCartItems([]);

      // Navigate to order confirmation or home
      navigate("/");
    } catch (error) {
      console.error("Checkout error:", error);
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Continue shopping
  const continueShopping = () => {
    navigate("/categories");
  };

  // If user is not logged in, show login prompt
  useEffect(() => {
    if (!user && cartItems.length === 0) {
      // Show a message but don't force redirect
      console.log("User not logged in");
    }
  }, [user, cartItems.length]);

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
          {!user && cartItems.length === 0 && (
            <div className="login-prompt">
              <p>Please login to view your cart items</p>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            </div>
          )}
        </div>

        <div className="cart-layout">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            {/* Cart Actions Bar */}
            <div className="cart-actions-bar">
              <button
                className="clear-cart-btn"
                onClick={clearCart}
                disabled={cartItems.length === 0 || !user}
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
                  {user
                    ? "Looks like you haven't added any books to your cart yet."
                    : "Please login to view your cart items."}
                </p>
                <button
                  className="btn btn-primary btn-large"
                  onClick={continueShopping}
                >
                  Start Shopping
                </button>
                {!user && (
                  <Link
                    to="/login"
                    className="btn btn-secondary btn-large"
                    style={{ marginTop: "10px" }}
                  >
                    Login to View Cart
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <Link to={`/book/${item.bookId}`}>
                          <img src={item.image} alt={item.title} />
                        </Link>
                      </div>

                      <div className="cart-item-details">
                        <div className="item-header">
                          <Link
                            to={`/book/${item.bookId}`}
                            className="item-title"
                          >
                            {item.title}
                          </Link>
                          <button
                            className="remove-item-btn"
                            onClick={() => removeItem(item.id)}
                            title="Remove item"
                            disabled={!user}
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
                            onClick={() => saveForLater(item.bookId)}
                            disabled={!user}
                          >
                            💾 Save for later
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => moveToWishlist(item.bookId)}
                            disabled={!user}
                          >
                            ❤️ Move to wishlist
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-quantity">
                        <div className="quantity-control">
                          <button
                            className="quantity-btn minus"
                            onClick={() => decreaseQuantity(item.bookId)}
                            disabled={item.quantity <= 1 || !user}
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
                                item.bookId,
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="quantity-input"
                            disabled={!user}
                          />
                          <button
                            className="quantity-btn plus"
                            onClick={() => increaseQuantity(item.bookId)}
                            disabled={item.quantity >= item.stock || !user}
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
                      className={`summary-value ${shipping === 0 ? "free-shipping" : ""}`}
                    >
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="summary-row shipping-note">
                    {shipping === 0 ? (
                      <span>🎉 You've qualified for free shipping!</span>
                    ) : (
                      <span>
                        Add ${Math.max(0, (30 - subtotal).toFixed(2))} more to
                        get FREE shipping
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
                    disabled={isCheckingOut || !user}
                  >
                    {isCheckingOut ? (
                      <>
                        <span className="spinner-small"></span>
                        Processing...
                      </>
                    ) : (
                      "🛒 Proceed to Checkout"
                    )}
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
                    disabled={!user}
                  />
                  <button className="promo-btn" disabled={!user}>
                    Apply
                  </button>
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
                  <button className="help-btn" disabled={!user}>
                    📞 Call Us
                  </button>
                  <button className="help-btn" disabled={!user}>
                    💬 Live Chat
                  </button>
                  <button className="help-btn" disabled={!user}>
                    ✉️ Email
                  </button>
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
