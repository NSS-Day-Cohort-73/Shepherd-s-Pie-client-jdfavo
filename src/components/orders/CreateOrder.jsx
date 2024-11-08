import { useEffect, useState } from "react";
import {
  getCheese,
  getDeliveryStatus,
  getSauce,
  getSizes,
  getToppings,
  postOrder,
} from "../../services/orderService";
import "./Order.css";

export const CreateOrder = () => {
  // Gathering state
  const [sizes, setSizes] = useState([]);
  const [cheese, setCheese] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [deliverySurcharge, setDeliverySurcharge] = useState(0);

  // Order state
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedCheese, setSelectedCheese] = useState(0);
  const [selectedSauces, setSelectedSauces] = useState(0);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [currentCart, setCurrentCart] = useState([]);
  const [currentCartPreview, setCurrentCartPreview] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isDeliveryBtn, setIsDeliveryBtn] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tableNumber, setTableNumber] = useState(null);

  // Loading state for data readiness check
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch and normalize data on component mount
  useEffect(() => {
    Promise.all([
      getSizes(),
      getCheese(),
      getSauce(),
      getToppings(),
      getDeliveryStatus(),
    ]).then(
      ([sizesData, cheeseData, sauceData, toppingsData, deliveryData]) => {
        const normalizeData = (data) =>
          data.map((item) => ({ ...item, id: Number(item.id) }));

        setSizes(normalizeData(sizesData));
        setCheese(normalizeData(cheeseData));
        setSauces(normalizeData(sauceData));
        setToppings(normalizeData(toppingsData));
        setDeliverySurcharge(deliveryData);
        setIsDataLoaded(true); // Set data as loaded
      }
    );
  }, []);

  const handleToppingChange = (toppingId) => {
    setSelectedToppings((prevToppings) => {
      if (prevToppings.includes(toppingId)) {
        return prevToppings.filter((t) => t !== toppingId);
      } else {
        return [...prevToppings, toppingId];
      }
    });
  };

  const handleAddToCart = (event) => {
    event.preventDefault();

    // Prevent adding to cart if data is not fully loaded
    if (!isDataLoaded) {
      alert("Data is still loading. Please try again in a moment.");
      return;
    }

    // Check if required selections are made
    if (selectedCheese === 0 || selectedSauces === 0 || selectedSize === 0) {
      alert("Please select size, cheese, and sauce before adding to cart");
      return;
    }

    // Retrieve full details for each selection with consistent ID type
    const sizeDetails = sizes.find((s) => s.id === Number(selectedSize));
    const cheeseDetails = cheese.find((c) => c.id === Number(selectedCheese));
    const sauceDetails = sauces.find((s) => s.id === Number(selectedSauces));
    const toppingDetails = selectedToppings
      .map((toppingId) => toppings.find((t) => t.id === Number(toppingId)))
      .filter(Boolean); // Filter out any undefined toppings

    if (!sizeDetails || !cheeseDetails || !sauceDetails) {
      console.log("Selected item details could not be found. Please try again.");
      return;
    }

    const newCartItem = {
      size: { id: sizeDetails.id, name: sizeDetails.size },
      cheese: { id: cheeseDetails.id, name: cheeseDetails.name },
      sauce: { id: sauceDetails.id, name: sauceDetails.name },
      toppings: toppingDetails.map((t) => ({ id: t.id, name: t.name })),
    };

    setCurrentCart([...currentCart, newCartItem]);

    // Reset form selections
    setSelectedCheese(0);
    setSelectedSauces(0);
    setSelectedSize(0);
    setSelectedToppings([]);
  };

  // Cart preview effect
  useEffect(() => {
    if (currentCart.length > 0) {
      const previewItems = currentCart.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        size: item.size.name,
        cheese: item.cheese.name,
        sauce: item.sauce.name,
        toppings: item.toppings.map((topping) => topping.name).join(", "),
      }));

      setCurrentCartPreview(previewItems);
    } else {
      setCurrentCartPreview([]);
    }
  }, [currentCart]);

  // Total cost calculation
  useEffect(() => {
    const cartTotal = currentCart.reduce((acc, item) => {
      const sizeDetails = sizes.find((s) => s.id === item.size.id);
      const toppingsCost = item.toppings.length * 0.5;
      const sizeCost = sizeDetails ? sizeDetails.price : 0;
      return acc + sizeCost + toppingsCost;
    }, 0);

    setTotalCost(cartTotal + (isDeliveryBtn ? deliverySurcharge : 0));
  }, [currentCart, sizes, isDeliveryBtn, deliverySurcharge]);

  const handleSubmitOrder = (event) => {
    event.preventDefault();

    if (currentCart.length > 0) {
      const orderItems = currentCart.map((item, index) => {
        const sizeDetails = sizes.find((s) => s.id === item.size.id);
        const toppingsPrice = item.toppings.length * 0.5;

        return {
          id: index + 1,
          size: item.size.name,
          cheese: item.cheese.name,
          sauce: item.sauce.name,
          toppings: item.toppings.map((t) => t.name),
          basePrice: sizeDetails ? sizeDetails.price : 0,
          toppingsPrice: toppingsPrice,
          totalPrice: (sizeDetails ? sizeDetails.price : 0) + toppingsPrice,
        };
      });

      const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const total = subtotal + (isDeliveryBtn ? deliverySurcharge : 0);

      const newOrder = {
        customerName,
        phoneNumber,
        isDelivery: isDeliveryBtn,
        deliveryAddress: isDeliveryBtn ? deliveryAddress : null,
        tableNumber: !isDeliveryBtn ? tableNumber : null,
        orderDate: new Date().toISOString(),
        items: orderItems,
        subtotal,
        total,
      };
  
      postOrder(newOrder).then(() => {
        setCurrentCart([]);
        setCurrentCartPreview([]);
        setSelectedSize(0);
        setSelectedCheese(0);
        setSelectedSauces(0);
        setSelectedToppings([]);
        setDeliveryAddress("");
        setCustomerName("");
        setPhoneNumber("");
        setTableNumber(null);
      });
    };
  };

  return (
    <form>
      <h2>Build Your Pizza</h2>
      <div className="form-grid">
        <div className="pizza-options">
          <div className="horizontal-fields">
            <fieldset>
              <label>SIZES : </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(Number(e.target.value))}
              >
                <option value={0}>Choose Size</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.size} ({size.diameter}") - ${size.price}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset>
              <label>CHEESE : </label>
              <select
                value={selectedCheese}
                onChange={(e) => setSelectedCheese(Number(e.target.value))}
              >
                <option value={0}>Choose Cheese</option>
                {cheese.map((cheeseItem) => (
                  <option key={cheeseItem.id} value={cheeseItem.id}>
                    {cheeseItem.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset>
              <label>SAUCE : </label>
              <select
                value={selectedSauces}
                onChange={(e) => setSelectedSauces(Number(e.target.value))}
              >
                <option value={0}>Choose Sauce</option>
                {sauces.map((sauce) => (
                  <option key={sauce.id} value={sauce.id}>
                    {sauce.name}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <fieldset>
            <h3>Choose Toppings</h3>
            <div className="toppings-container">
              {toppings.map((topping) => (
                <div key={topping.id} className="topping-item">
                  <input
                    type="checkbox"
                    id={`topping-${topping.id}`}
                    checked={selectedToppings.includes(topping.id)}
                    onChange={() => handleToppingChange(topping.id)}
                  />
                  <label htmlFor={`topping-${topping.id}`}>
                    {topping.name} (+${topping.price})
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="delivery-section">
          <label>
            <input
              type="checkbox"
              checked={isDeliveryBtn}
              onChange={() => setIsDeliveryBtn(!isDeliveryBtn)}
            />
            <span>Delivery</span>
          </label>
          {isDeliveryBtn ? (
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter delivery address"
              required
            />
          ) : (
            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required={!isDeliveryBtn}
            >
              <option value="">Select Table Number</option>
              {[...Array(25).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  Table {num + 1}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="customer-info">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer Name"
            required
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            required
          />
        </div>
        </div>

        <div className="cart-section">
          <h3>Current Cart</h3>
          <div className="cart-items">
            {currentCartPreview.length > 0
              ? currentCartPreview.map((item) => (
                  <div key={item.id} className="cart-item">
                    {item.size} Pizza with {item.cheese}, {item.sauce}, toppings: {item.toppings}
                  </div>
                ))
              : "Cart is currently Empty"}
          </div>
          <button onClick={handleAddToCart}>Add To Cart</button>
          <button onClick={handleSubmitOrder}>Submit Order</button>
          <footer>TOTAL : ${totalCost}</footer>
        </div>
      </div>
    </form>
  );
};
