export const GetOrderById = async (id) => {
  const response = await fetch(`http://localhost:8088/orders/${id}`);
  return response.json();
};

export const GetOrders = () => {
  return fetch("http://localhost:8088/orders").then((response) =>
    response.json()
  );
};

export const getSizes = () => {
  return fetch(`http://localhost:8088/pizzas`).then((res) => res.json());
};

export const getCheese = () => {
  return fetch(`http://localhost:8088/cheeseOptions`).then((res) => res.json());
};

export const getSauce = () => {
  return fetch(`http://localhost:8088/sauceOptions`).then((res) => res.json());
};

export const getToppings = () => {
  return fetch(`http://localhost:8088/toppings`).then((res) => res.json());
};

export const getDeliveryStatus = () => {
  return fetch(` http://localhost:8088/deliverySurcharge`).then((res) =>
    res.json()
  );
};

export const postOrder = (newOrder) => {
  return fetch("http://localhost:8088/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newOrder),
  });
};

export const updateOrderById = async (id) => {
  const response = await fetch(`http://localhost:8088/orders/${id}`);
  return response.json();
};
