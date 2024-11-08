
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetOrderById, deleteOrder } from "../../services/orderService";
import { getToppings } from "../../services/orderService";
import "./Order.css"; // 

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [toppings, setToppings] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderData = await GetOrderById(orderId);
      const toppingsData = await getToppings();
      setOrder(orderData);
      setToppings(toppingsData);
    };

    fetchOrder();
  }, [orderId]);

  const getToppingNames = (toppingIds) => {
    return toppingIds.map(idOrName => {
      // Check if idOrName is a string and directly matches a topping name
      if (typeof idOrName === "string") {
        const toppingByName = toppings.find(top => top.name.toLowerCase() === idOrName.toLowerCase());
        if (toppingByName) return toppingByName.name;
      }
      
      // If it's not a name, assume it's an ID and look up by ID
      const toppingById = toppings.find(top => top.id == Number(idOrName));
      return toppingById ? toppingById.name : "Unknown";
    });
  };
  

  const handleUpdate = (itemId) => {
    navigate(`/orders/update/${orderId}`); // Navigate to UpdateOrder with order ID
  };

  const handleRemove = async (itemId) => {
    // Call the deleteOrder function to remove the item
    await deleteOrder(itemId);
    navigate("/orders"); // Navigate back to orders list after deletion
  };

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
              <p><strong>Toppings:</strong> {getToppingNames(item.toppings).join(", ")}</p>
            </div>
            <div className="pizza-actions">
              <button className="update-btn" onClick={() => handleUpdate(item.id)}>
                Update
              </button>
              <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                Remove
              </button>
              <p className="pizza-cost"><strong>Cost:</strong> ${item.totalPrice ? item.totalPrice.toFixed(2) : "0.00"}</p>
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
        <button className="finish-btn" onClick={() => navigate("/orders")}>Finish Updating</button>
      </div>
    </div>
  );
};
