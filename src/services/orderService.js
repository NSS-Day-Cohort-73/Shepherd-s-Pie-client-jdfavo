export const GetOrders = async () => {
    const response = await fetch('http://localhost:8088/orders');
    return await response.json();
  };
  
  export const GetOrderById = async (id) => {
    const response = await fetch(`http://localhost:8088/orders/${id}`);
    return response.json();
  };
  
  export const GetToppings = async () => {
    const response = await fetch("http://localhost:8088/toppings");
    return await response.json();
  };