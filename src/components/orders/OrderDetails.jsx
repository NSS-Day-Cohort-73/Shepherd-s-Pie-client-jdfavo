
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetOrderById } from "../../services/orderService";
import "./Order.css"; // 

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderData = await GetOrderById(orderId);
      setOrder(orderData);
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="order-details-container">
      <h3>Order Details for Order #{order.id}</h3>

      <div className="pizza-list">
        {order.items.map((item, index) => (
          <div key={index} className="pizza-card">
            <div className="pizza-info">
              <h4>Pizza #{index + 1}</h4>
              <p><strong>Size:</strong> {item.size}</p>
              <p><strong>Cheese:</strong> {item.cheese}</p>
              <p><strong>Sauce:</strong> {item.sauce}</p>
              <p><strong>Toppings:</strong> {item.toppings.join(", ")}</p>
            </div>
            <div className="pizza-actions">
              <button className="update-btn">Update</button>
              <button className="remove-btn">Remove</button>
              <p className="pizza-cost"><strong>Cost:</strong> ${item.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <p><strong>Order Summary:</strong></p>
        <p>Delivery: {order.isDelivery ? "✓" : "✗"}</p>
        <p className="total-cost"><strong>Total Cost:</strong> ${order.total.toFixed(2)}</p>
      </div>

      <div className="order-actions">
        <button className="add-pizza-btn">Add Pizza</button>
        <button className="finish-btn">Finish Updating</button>
      </div>
    </div>
  );
};
