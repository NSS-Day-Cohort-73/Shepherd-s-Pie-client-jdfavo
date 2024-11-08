export const getOrdersForMonth = (month) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  return fetch(
    `http://localhost:8088/orders?orderDate_gte=${year}-${
      monthIndex + 1
    }-01&orderDate_lt=${year}-${monthIndex + 2}-01`
  ).then((response) => response.json());
};
