import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetOrders } from "../../services/orderService";
import "./Order.css"; 

export const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await GetOrders();
        if (ordersData && Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else {
          console.error("Unexpected data format:", ordersData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, []);
  

  return (
    <div className="container">
      <h2>Orders</h2>
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id} className="order-card">
            <h3>Order #{order.id}</h3>
            <p>{order.isDelivery ? "Delivery" : `Table ${order.tableNumber}`}</p>
            <p>Total: ${order.total ? order.total.toFixed(2) : "0.00"}</p>
            <p>Placed at: {new Date(order.orderDate).toLocaleTimeString()}</p>
            <Link to={`/orders/${order.id}`}>
              <button className="details-btn">Details</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
