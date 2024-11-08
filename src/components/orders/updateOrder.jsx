import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCheese,
  getSauce,
  getSizes,
  getToppings,
  GetOrderById,
  updateOrder,
  deleteOrder
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
  const [pizzaPrice, setPizzaPrice] = useState(0); // Add pizza price state

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
      const currentItem = orderData.items[0];
      setSelectedSize(currentItem.size);
      setSelectedCheese(currentItem.cheese);
      setSelectedSauce(currentItem.sauce);
      setSelectedToppings(currentItem.toppings);
      setIsDelivery(orderData.isDelivery);
      setDeliveryAddress(orderData.deliveryAddress || "");
      setTableNumber(orderData.tableNumber || null);

      // Initial price calculation
      calculatePizzaPrice(currentItem.size, currentItem.toppings);
    };

    fetchData();
  }, [orderId]);

  const calculatePizzaPrice = (size, toppings) => {
    const sizePrice = sizes.find((s) => s.size === size)?.price || 0;
    const toppingsPrice = toppings.length * 0.5; // Assuming each topping costs $0.5
    setPizzaPrice(sizePrice + toppingsPrice);
  };

  // Update pizza price when size or toppings change
  useEffect(() => {
    calculatePizzaPrice(selectedSize, selectedToppings);
  }, [selectedSize, selectedToppings, sizes]);

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
          id: order.items[0].id,
          size: selectedSize,
          cheese: selectedCheese,
          sauce: selectedSauce,
          toppings: selectedToppings,
          totalPrice: pizzaPrice // Include calculated price
        },
      ],
    };

    await updateOrder(orderId, updatedOrder);
    navigate("/orders");
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

          <div className="order-summary">
            <p>Total Pizza Price: ${pizzaPrice.toFixed(2)}</p>
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
