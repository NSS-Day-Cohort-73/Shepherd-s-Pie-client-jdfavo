import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetOrderById } from "../../services/orderService";

export const OrderDetails = () => {
  const { orderId } = useParams(); // Retrieve order ID from URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderData = await GetOrderById(orderId); // Fetch order by ID
      setOrder(orderData);
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading order details...</p>;

  return (
    <div>
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Customer Name:</strong> {order.customerName}</p>
      <p><strong>Phone Number:</strong> {order.phoneNumber}</p>
      <p><strong>Type:</strong> {order.isDelivery ? "Delivery" : `Table ${order.tableNumber}`}</p>
      <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>

      <h3>Items</h3>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            <p><strong>Size:</strong> {item.size}</p>
            <p><strong>Cheese:</strong> {item.cheese}</p>
            <p><strong>Sauce:</strong> {item.sauce}</p>
            <p><strong>Toppings:</strong> {item.toppings.join(", ")}</p>
            <p><strong>Total Price:</strong> ${item.totalPrice.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
