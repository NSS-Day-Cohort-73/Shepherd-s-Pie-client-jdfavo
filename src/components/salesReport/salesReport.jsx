import React, { useState, useEffect } from "react";
import { getOrdersForMonth } from "../../services/salesReportService";
import "./salesReport.css";
import { getToppings } from "../../services/orderService";

export const SalesReport = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [ordersForMonth, setOrdersForMonth] = useState([]);
  const [toppings, setToppings] = useState([]);

  // Single useEffect to fetch orders
  useEffect(() => {
    getOrdersForMonth(selectedMonth).then((orders) => {
      setOrdersForMonth(orders); // Assuming the API returns the array directly
    });
  }, [selectedMonth]);

  useEffect(() => {
    const fetchOrder = async () => {
      const toppingsData = await getToppings();
      setToppings(toppingsData);
    };

    fetchOrder();
  }, []);

  const getToppingNames = (toppingIds) => {
    return toppingIds.map((id) => {
      const topping = toppings.find((top) => top.id == id);
      return topping ? topping.name : "Unknown";
    });
  };

  // Calculate sales metrics only if we have orders
  const calculateMetrics = (orders) => {
    if (!orders || !orders.length) {
      return {
        totalSales: 0,
        popularSize: "N/A",
        popularCheese: "N/A",
        popularSauce: "N/A",
        popularToppings: [],
      };
    }

    const sizeCounts = {};
    const cheeseCounts = {};
    const sauceCounts = {};
    const toppingCounts = {};

    orders.forEach((order) => {
      if (order.items) {
        // Add null check for items
        order.items.forEach((item) => {
          sizeCounts[item.size] = (sizeCounts[item.size] || 0) + 1;
          cheeseCounts[item.cheese] = (cheeseCounts[item.cheese] || 0) + 1;
          sauceCounts[item.sauce] = (sauceCounts[item.sauce] || 0) + 1;

          if (item.toppings) {
            // Add null check for toppings
            item.toppings.forEach((topping) => {
              toppingCounts[topping] = (toppingCounts[topping] || 0) + 1;
            });
          }
        });
      }
    });

    const getMaxKey = (obj) =>
      Object.keys(obj).length
        ? Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b))
        : "N/A";

    return {
      totalSales: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      popularSize: getMaxKey(sizeCounts),
      popularCheese: getMaxKey(cheeseCounts),
      popularSauce: getMaxKey(sauceCounts),
      popularToppings: Object.keys(toppingCounts)
        .sort((a, b) => toppingCounts[b] - toppingCounts[a])
        .slice(0, 3),
    };
  };

  const {
    totalSales,
    popularSize,
    popularCheese,
    popularSauce,
    popularToppings,
  } = calculateMetrics(ordersForMonth);

  const handleMonthChange = (e) => {
    const newDate = new Date(selectedMonth.getFullYear(), e.target.value, 1);
    setSelectedMonth(newDate);
  };

  return (
    <div className="sales-report-container">
      <div className="sales-report-section">
        <h2>Sales Report</h2>
        <div className="month-selector">
          <label htmlFor="month-select">Select Month: </label>
          <select
            id="month-select"
            value={selectedMonth.getMonth()}
            onChange={handleMonthChange}
          >
            {[...Array(12).keys()].map((i) => (
              <option key={i} value={i}>
                {new Date(0, i + 1, 0).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
        <div className="sales-summary">
          <h3>
            Sales for{" "}
            {selectedMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <p className="total-sales">Total Sales: ${totalSales.toFixed(2)}</p>
          <p className="popular-header">Most Popular:</p>
          <ul className="popular-items">
            <li>Size: {popularSize}</li>
            <li>Cheese: {popularCheese}</li>
            <li>Sauce: {popularSauce}</li>
            <li>
              Toppings: {getToppingNames(popularToppings).join(", ") || "N/A"}
            </li>
          </ul>
        </div>
      </div>
      <div className="order-list-section">
        <h2>Order List</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {ordersForMonth.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>${(order.total || 0).toFixed(2)}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
