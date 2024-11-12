export const getOrdersForMonth = (month) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  // Just use simple date strings without time
  const startDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;

  // Calculate end date
  let endYear = year;
  let endMonth = monthIndex + 1;

  if (endMonth === 12) {
    endYear = year + 1;
    endMonth = 1;
  }

  const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

  return fetch(
    `http://localhost:8088/orders?orderDate_gte=${startDate}&orderDate_lt=${endDate}`
  )
    .then((response) => response.json())
    .then((orders) => {
      // Debug logging
      console.log("Query dates:", { startDate, endDate });
      console.log("Orders before filtering:", orders.length);

      // Double-check the dates on the JavaScript side
      const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        const orderMonth = orderDate.getMonth();
        const orderYear = orderDate.getFullYear();

        const isMatchingMonth = orderMonth === monthIndex;
        const isMatchingYear = orderYear === year;

        console.log("Order:", {
          date: order.orderDate,
          month: orderMonth,
          targetMonth: monthIndex,
          matches: isMatchingMonth && isMatchingYear,
        });

        return isMatchingMonth && isMatchingYear;
      });

      console.log("Orders after filtering:", filteredOrders.length);
      return filteredOrders;
    });
};
