import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetOrders } from '../../services/orderService';

export const OrderList = () => {
  const [orders, setOrders] = useState([]); 

  useEffect(() => {
    const loadOrders = async () => {
      const data = await GetOrders();
      setOrders(data);
    };

    loadOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
                Order #{order.id} - {order.isDelivery ? 'Delivery' : `Table ${order.tableNumber}`}
              <p>
                Total: ${order.total.toFixed(2)} | Placed at:{" "}
                {new Date(order.orderDate).toLocaleTimeString()}
              </p>
              <Link to={`/order/${order.id}`}>
                <button>Details</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

