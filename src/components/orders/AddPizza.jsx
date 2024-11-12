import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCheese,
  getSauce,
  getSizes,
  getToppings,
  GetOrderById,
  updateOrder
} from "../../services/orderService";

export const AddPizza = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [sizes, setSizes] = useState([]);
  const [cheeseOptions, setCheeseOptions] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCheese, setSelectedCheese] = useState("");
  const [selectedSauce, setSelectedSauce] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [order, setOrder] = useState(null); // Holds the existing order details
  const [pizzaPrice, setPizzaPrice] = useState(0); // Holds calculated pizza price

  useEffect(() => {
    const fetchData = async () => {
      const [orderData, sizesData, cheeseData, sauceData, toppingsData] = await Promise.all([
        GetOrderById(orderId),
        getSizes(),
        getCheese(),
        getSauce(),
        getToppings()
      ]);
      setOrder(orderData);
      setSizes(sizesData);
      setCheeseOptions(cheeseData);
      setSauces(sauceData);
      setToppings(toppingsData);
    };

    fetchData();
  }, [orderId]);

  // Calculate pizza price based on selections
  useEffect(() => {
    const sizePrice = sizes.find((size) => size.size === selectedSize)?.price || 0;
    const toppingsPrice = selectedToppings.length * 0.5; // Assuming $0.5 per topping
    setPizzaPrice(sizePrice + toppingsPrice);
  }, [selectedSize, selectedToppings, sizes]);

  const handleToppingChange = (topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

  const handleAddPizza = async () => {
    const newPizza = {
      id: Date.now(), // Temporary ID, could use a UUID or backend-generated ID
      size: selectedSize,
      cheese: selectedCheese,
      sauce: selectedSauce,
      toppings: selectedToppings,
      totalPrice: pizzaPrice, // Add calculated price here
    };

    // Add new pizza to the existing items in the order
    const updatedOrder = {
      ...order,
      items: [...order.items, newPizza], // Append the new pizza
    };

    await updateOrder(orderId, updatedOrder);
    navigate(`/orders/${orderId}`); // Redirect back to the order details page
  };

  return (
    <div className="add-pizza-container">
      <h2>Add Pizza to Order #{orderId}</h2>
      {order && (
        <form onSubmit={(e) => { e.preventDefault(); handleAddPizza(); }}>
          <fieldset>
            <label>Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              required
            >
              <option value="">Select Size</option>
              {sizes.map((size) => (
                <option key={size.id} value={size.size}>
                  {size.size} - ${size.price}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <label>Cheese:</label>
            <select
              value={selectedCheese}
              onChange={(e) => setSelectedCheese(e.target.value)}
              required
            >
              <option value="">Select Cheese</option>
              {cheeseOptions.map((cheese) => (
                <option key={cheese.id} value={cheese.name}>
                  {cheese.name}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <label>Sauce:</label>
            <select
              value={selectedSauce}
              onChange={(e) => setSelectedSauce(e.target.value)}
              required
            >
              <option value="">Select Sauce</option>
              {sauces.map((sauce) => (
                <option key={sauce.id} value={sauce.name}>
                  {sauce.name}
                </option>
              ))}
            </select>
          </fieldset>

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

          <p>Total Pizza Price: ${pizzaPrice.toFixed(2)}</p> {/* Display pizza price */}
          <button type="submit">Add Pizza</button>
          <button type="button" onClick={() => navigate(`/orders/${orderId}`)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};
