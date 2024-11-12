export const getEmployees = () => {
  return fetch("http://localhost:8088/users?isAdmin=false").then((res) =>
    res.json()
  );
};

export const getEmployeeById = (employeeId) => {
  return fetch(`http://localhost:8088/users?id=${employeeId}`).then((res) =>
    res.json()
  );
};

export const editEmployee = (editedEmployee) => {
  return fetch(`http://localhost:8088/users/${editedEmployee.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedEmployee),
  });
};

const apiUrl = "http://localhost:8088"; // Base URL for your API


// Assign a driver to an order
export const assignDriverToOrder = async (orderId, employeeId) => {
    try {
      // Step 1: Fetch the existing order
      const existingOrderResponse = await fetch(`${apiUrl}/orders/${orderId}`);
      if (!existingOrderResponse.ok) throw new Error("Failed to fetch existing order");
  
      const existingOrder = await existingOrderResponse.json();
  
      // Step 2: Merge the driverId with the existing order data
      const updatedOrder = { ...existingOrder, driverId: employeeId };
  
      // Step 3: Send the updated order back to the server
      const response = await fetch(`${apiUrl}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      });
  
      if (!response.ok) throw new Error("Failed to assign driver");
  
      return await response.json(); // Return updated order or status if needed
    } catch (error) {
      console.error("Error assigning driver:", error);
      throw error;
    }
  };
  