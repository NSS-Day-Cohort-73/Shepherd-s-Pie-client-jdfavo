import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetOrderById, getToppings } from "../../services/orderService";
import { assignDriverToOrder, getEmployees } from "../../services/employeeService"; 
import "./Order.css";

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [toppings, setToppings] = useState([]);
  const [drivers, setDrivers] = useState([]); 
  const [selectedDriver, setSelectedDriver] = useState(null);

  const deliverySurcharge = 5;
  const isAdmin = JSON.parse(localStorage.getItem("pizza_user"))?.isAdmin || false;

  useEffect(() => {
    const fetchOrderData = async () => {
      const orderData = await GetOrderById(orderId);
      const toppingsData = await getToppings();
      setOrder(orderData);
      setToppings(toppingsData);

      // Fetch all employees for driver selection if it's an admin and delivery order
      if (isAdmin && orderData.isDelivery) {
        const employeesData = await getEmployees(); 
        setDrivers(employeesData);
      }
    };

    fetchOrderData();
  }, [orderId, isAdmin]);

  const getToppingNames = (toppingIds) => {
    return toppingIds.map((idOrName) => {
      if (typeof idOrName === "string") {
        const toppingByName = toppings.find(
          (top) => top.name.toLowerCase() === idOrName.toLowerCase()
        );
        if (toppingByName) return toppingByName.name;
      }
      const toppingById = toppings.find((top) => top.id == Number(idOrName));
      return toppingById ? toppingById.name : "Unknown";
    });
  };

  const handleUpdate = () => {
    navigate(`/orders/update/${orderId}`);
  };

  const handleDriverChange = async (event) => {
    const driverId = event.target.value;
    setSelectedDriver(driverId);
    await assignDriverToOrder(orderId, driverId);
  };

  const computedTotalCost = order
    ? order.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0) +
      (order.isDelivery ? deliverySurcharge : 0)
    : 0;

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
              <button className="update-btn" onClick={handleUpdate}>
                Update
              </button>
              <p className="pizza-cost"><strong>Cost:</strong> ${item.totalPrice ? item.totalPrice.toFixed(2) : "0.00"}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <p><strong>Order Summary:</strong></p>
        <p>Delivery: {order.isDelivery ? "✓" : "✗"}</p>
        {/* Show driver dropdown only for admins and if it's a delivery order */}
        {isAdmin && order.isDelivery && (
          <div>
            <label>Assign Driver:</label>
            <select
              value={selectedDriver || order.driverId || ""}
              onChange={handleDriverChange}
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>

        )}

        <p className="total-cost"><strong>Total Cost:</strong> ${computedTotalCost.toFixed(2)}</p>
      </div>

      <div className="order-actions">
        <button className="add-pizza-btn" onClick={() => navigate(`/orders/${orderId}/addPizza`)}>
          Add Pizza
        </button>
        <button className="finish-btn" onClick={() => navigate("/orders")}>
          Finish Updating
        </button>
      </div>
    </div>
  );
};
