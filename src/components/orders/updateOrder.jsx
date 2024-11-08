import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCheese,
  getSauce,
  getSizes,
  getToppings,
  GetOrderById,
  updateOrder,
  deleteOrder // New function for updating an order
} from "../../services/orderService";
import "./Order.css";

export const UpdateOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Order state and form fields
  const [order, setOrder] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [cheeseOptions, setCheeseOptions] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [isDelivery, setIsDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [tableNumber, setTableNumber] = useState(null);

  useEffect(() => {
    // Fetch all data needed for the form
    const fetchData = async () => {
      const [orderData, sizesData, cheeseData, sauceData, toppingsData] = await Promise.all([
        GetOrderById(orderId),
        getSizes(),
        getCheese(),
        getSauce(),
        getToppings(),
      ]);
      setOrder(orderData);
      setSizes(sizesData);
      setCheeseOptions(cheeseData);
      setSauces(sauceData);
      setToppings(toppingsData);
      
      // Set initial values based on current order data
      setSelectedSize(orderData.items[0].size);
      setSelectedCheese(orderData.items[0].cheese);
      setSelectedSauce(orderData.items[0].sauce);
      setSelectedToppings(orderData.items[0].toppings);
      setIsDelivery(orderData.isDelivery);
      setDeliveryAddress(orderData.deliveryAddress || "");
      setTableNumber(orderData.tableNumber || null);
    };

    fetchData();
  }, [orderId]);

  const handleToppingChange = (topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };

  const handleUpdateOrder = async () => {
    const updatedOrder = {
      ...order,
      isDelivery,
      deliveryAddress: isDelivery ? deliveryAddress : null,
      tableNumber: isDelivery ? null : tableNumber,
      items: [
        {
          id: order.items[0].id, // Ensure item ID remains consistent
          size: selectedSize,
          cheese: selectedCheese,
          sauce: selectedSauce,
          toppings: selectedToppings,
        },
      ],
    };

    await updateOrder(orderId, updatedOrder); // PUT request to update order
    navigate("/orders"); // Redirect to orders page
  };

  const handleRemoveOrder = async () => {
    await deleteOrder(orderId); 
    navigate("/orders"); 
  };

  return (
    <div className="update-order-container">
      <h2>Update Order #{orderId}</h2>

      {order && (
        <div className="form-grid">
          <div className="pizza-options">
            {/* Size Selection */}
            <fieldset>
              <label>Size:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {sizes.map((size) => (
                  <option key={size.id} value={size.size}>
                    {size.size} - ${size.price}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* Cheese Selection */}
            <fieldset>
              <label>Cheese:</label>
              <select
                value={selectedCheese}
                onChange={(e) => setSelectedCheese(e.target.value)}
              >
                {cheeseOptions.map((cheese) => (
                  <option key={cheese.id} value={cheese.name}>
                    {cheese.name}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* Sauce Selection */}
            <fieldset>
              <label>Sauce:</label>
              <select
                value={selectedSauce}
                onChange={(e) => setSelectedSauce(e.target.value)}
              >
                {sauces.map((sauce) => (
                  <option key={sauce.id} value={sauce.name}>
                    {sauce.name}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* Toppings Selection */}
            <fieldset>
              <label>Toppings:</label>
              {toppings.map((topping) => (
                <label key={topping.id}>
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes(topping.name)}
                    onChange={() => handleToppingChange(topping.name)}
                  />
                  {topping.name} (+${topping.price})
                </label>
              ))}
            </fieldset>
          </div>

          <div className="delivery-section">
            {/* Delivery Toggle */}
            <label>
              <input
                type="checkbox"
                checked={isDelivery}
                onChange={() => setIsDelivery(!isDelivery)}
              />
              Delivery
            </label>
            {isDelivery ? (
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address"
                required
              />
            ) : (
              <select
                value={tableNumber || ""}
                onChange={(e) => setTableNumber(e.target.value)}
                required={!isDelivery}
              >
                <option value="">Select Table Number</option>
                {[...Array(25)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Table {i + 1}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="order-actions">
            <button onClick={handleUpdateOrder}>Save Changes</button>
            <button onClick={handleRemoveOrder}>Remove Order</button>
            <button onClick={() => navigate("/orders")}>Back to Orders</button>
          </div>
        </div>
      )}
    </div>
  );
};
