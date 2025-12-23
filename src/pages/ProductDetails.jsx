import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product by ID
  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Fetch related products
  useEffect(() => {
    api
      .get("/products?limit=4")
      .then((res) =>
        setRelatedProducts(res.data.filter((p) => p.id !== parseInt(id)))
      )
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    console.log("Add to cart:", product, "Quantity:", quantity);
    // TODO: integrate with cartSlice or backend
  };

  if (!product) {
    return <p className="p-6 text-center text-lg">Loading product...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center p-4 bg-white shadow justify-between">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">MyStore</h1>
        <nav className="flex-1 flex justify-center gap-4 flex-wrap">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/products" className="hover:underline">
            Products
          </Link>
          <Link to="/cart" className="hover:underline">
            Cart
          </Link>
          <Link to="/login" className="hover:underline">
            Login/Register
          </Link>
        </nav>
      </header>

      {/* Product Info */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Product Image */}
          <img
            src={product.imageUrl || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full rounded-lg object-cover max-h-[500px]"
          />

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl text-green-600 mt-2">${product.price}</p>
            <p className="mt-4 text-gray-700">{product.description}</p>

            {/* Quantity selector */}
            <div className="mt-4 flex items-center gap-2">
              <label htmlFor="quantity" className="font-medium">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 border rounded p-1"
              />
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col"
                >
                  <img
                    src={p.imageUrl || "https://via.placeholder.com/150"}
                    alt={p.name}
                    className="h-32 w-full object-cover rounded"
                  />
                  <h3 className="mt-2 font-semibold">{p.name}</h3>
                  <p className="text-green-600 font-bold">${p.price}</p>
                  <Link
                    to={`/products/${p.id}`}
                    className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-center transition"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 border-t text-center text-gray-600 bg-white mt-auto">
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default ProductDetails;
