import React, { useState, useEffect } from "react";
import { getOrdersForMonth } from "../../services/salesReportService";

export const SalesReport = ({ orders }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [ordersForMonth, setOrdersForMonth] = useState([]);

  // Helper function called in useEffect to get orders for a given month
  useEffect(() => {
    getOrdersForMonth(selectedMonth).then((orders) => {
      setOrdersForMonth(orders);
    });
  }, [selectedMonth]);

  useEffect(() => {
    const filteredOrders = getOrdersForMonth(selectedMonth);
    setOrdersForMonth(filteredOrders);
  }, [selectedMonth, orders]);

  // Calculate sales metrics for the selected month
  const totalSales =
    ordersForMonth?.reduce((sum, order) => sum + order.total, 0) || 0;

  // Get most popular pizza size, cheese, sauce, and toppings
  const sizeCounts = {};
  const cheeseCounts = {};
  const sauceCounts = {};
  const toppingCounts = {};

  ordersForMonth.forEach((order) => {
    order.items.forEach((item) => {
      sizeCounts[item.size] = (sizeCounts[item.size] || 0) + 1;
      cheeseCounts[item.cheese] = (cheeseCounts[item.cheese] || 0) + 1;
      sauceCounts[item.sauce] = (sauceCounts[item.sauce] || 0) + 1;
      item.toppings.forEach((topping) => {
        toppingCounts[topping] = (toppingCounts[topping] || 0) + 1;
      });
    });
  });

  const popularSize = Object.keys(sizeCounts).reduce((a, b) =>
    sizeCounts[a] > sizeCounts[b] ? a : b
  );
  const popularCheese = Object.keys(cheeseCounts).reduce((a, b) =>
    cheeseCounts[a] > cheeseCounts[b] ? a : b
  );
  const popularSauce = Object.keys(sauceCounts).reduce((a, b) =>
    sauceCounts[a] > sauceCounts[b] ? a : b
  );
  const popularToppings = Object.keys(toppingCounts)
    .sort((a, b) => toppingCounts[b] - toppingCounts[a])
    .slice(0, 3);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2">
        <h2>Sales Report</h2>
        <div>
          <label htmlFor="month-select">Select Month:</label>
          <select
            id="month-select"
            value={selectedMonth.getMonth()}
            onChange={(e) =>
              setSelectedMonth(
                new Date(selectedMonth.getFullYear(), e.target.value, 1)
              )
            }
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
        <div>
          <h3>
            Sales for{" "}
            {selectedMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <p>Total Sales: ${totalSales.toFixed(2)}</p>
          <p>Most Popular:</p>
          <ul>
            <li>Size: {popularSize}</li>
            <li>Cheese: {popularCheese}</li>
            <li>Sauce: {popularSauce}</li>
            <li>Toppings: {popularToppings.join(", ")}</li>
          </ul>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <h2>Order List</h2>
        <table className="w-full">
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
                <td>${order.total.toFixed(2)}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
