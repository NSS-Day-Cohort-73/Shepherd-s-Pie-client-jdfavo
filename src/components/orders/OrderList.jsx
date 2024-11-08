import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GetOrders } from "../../services/orderService";
import { getEmployees } from "../../services/employeeService"; // Import employee service
import "./Order.css";

export const OrderList = ({ isAdmin }) => {
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]); // State to hold employees data
  const location = useLocation();
  const deliverySurcharge = 5; // For testing

  const fetchOrders = async () => {
    try {
      const ordersData = await GetOrders();
      const employeesData = await getEmployees();
      
      if (ordersData && Array.isArray(ordersData)) {
        setOrders(ordersData);
      } else {
        console.error("Unexpected data format:", ordersData);
      }
      
      if (employeesData && Array.isArray(employeesData)) {
        setEmployees(employeesData);
      } else {
        console.error("Unexpected employee data format:", employeesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [location]);

  // Function to get driver name based on driverId
  const getDriverName = (driverId) => {
    const driver = employees.find((employee) => employee.id === driverId);
    return driver ? driver.name : "Not Assigned";
  };

  return (
    <div className="container">
      <h2>Orders</h2>
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id} className="order-card">
            <h3>Order #{order.id}</h3>
            <p>
              {order.isDelivery
                ? `Delivery ${
                    order.driverId
                      ? `- Driver: ${getDriverName(order.driverId)}`
                      : ": Not Assigned"
                  }`
                : `Table ${order.tableNumber}`}
            </p>
            <p>
              Total: $
              {order.items && order.items.length > 0
                ? (
                    order.items.reduce(
                      (sum, item) => sum + (item.totalPrice || 0),
                      0
                    ) + (order.isDelivery ? deliverySurcharge : 0)
                  ).toFixed(2)
                : (order.total || 0).toFixed(2)}
            </p>
            <p>Placed at: {new Date(order.orderDate).toLocaleTimeString()}</p>
            <Link to={`/orders/${order.id}`} state={{ isAdmin }}>
              <button className="details-btn">Details</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
