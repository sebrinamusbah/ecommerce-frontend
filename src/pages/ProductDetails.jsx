import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) {
    return <p className="p-6">Loading product...</p>;
  }

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full rounded-lg"
      />

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl text-green-600 mt-2">${product.price}</p>
        <p className="mt-4 text-gray-700">{product.description}</p>

        <button className="mt-6 bg-green-500 text-white px-6 py-2 rounded">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
