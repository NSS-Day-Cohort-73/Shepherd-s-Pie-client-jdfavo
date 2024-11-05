export const GetOrders = () => {
    return fetch('http://localhost:8088/orders')
      .then(response => response.json());
  };
  