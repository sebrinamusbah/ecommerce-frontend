import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="border rounded-lg p-4 shadow">
      <img src={product.image_url} className="h-40 w-full object-cover" />
      <h2 className="font-semibold mt-2">{product.name}</h2>
      <p>${product.price}</p>

      <div className="mt-3 flex gap-2">
        <Link
          to={`/products/${product.id}`}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          View
        </Link>

        <button
          onClick={() => dispatch(addToCart(product))}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
