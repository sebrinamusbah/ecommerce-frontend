import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    api
      .get("/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 && <p className="text-gray-500">No orders found.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded p-4 shadow">
            <p className="font-semibold">Order #{order.id}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total}</p>

            <div className="mt-2">
              {order.items.map((item) => (
                <div key={item.id} className="text-sm text-gray-600">
                  {item.product.name} × {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
