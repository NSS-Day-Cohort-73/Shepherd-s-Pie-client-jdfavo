// src/components/orders/OrderList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetOrders } from "../../services/orderService";

export const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersData = await GetOrders();
      setOrders(ordersData);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p>
              Order #{order.id} - {order.isDelivery ? "Delivery" : `Table ${order.tableNumber}`}
            </p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <Link to={`/orders/${order.id}`}>
              <button>Details</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
