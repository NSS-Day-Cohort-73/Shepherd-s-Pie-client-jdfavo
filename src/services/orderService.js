export const GetOrderById = async (id) => {
  const response = await fetch(`http://localhost:8088/orders/${id}`);
  return response.json();
};

export const GetOrders = () => {
  return fetch("http://localhost:8088/orders?&expand_user").then((response) =>
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

export const updateOrder = async (orderId, updatedOrderData) => {
  try {
    const response = await fetch(`http://localhost:8088/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedOrderData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order with ID ${orderId}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await fetch(`http://localhost:8088/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete order with ID ${orderId}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export const addPizzaToOrder = async (orderId, newPizza) => {
  try {
    const response = await fetch(`http://localhost:8088/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [...existingItems, newPizza],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add pizza to the order.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding pizza:", error);
    throw error;
  }
};
