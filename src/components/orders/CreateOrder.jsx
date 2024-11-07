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
import { useNavigate } from "react-router-dom";

export const CreateOrder = () => {
  //gathering state
  const [sizes, setSizes] = useState([]);
  const [cheese, setCheese] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [deliverySurcharge, setDeliverySurcharge] = useState(0);

  //setting state
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedCheese, setSelectedCheese] = useState(0);
  const [selectedSauces, setSelectedSauces] = useState(0);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [currentCart, setCurrentCart] = useState([]);
  const [currentCartPreview, setCurrentCartPreview] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isDeliveryBtn, setIsDeliveryBtn] = useState(false);
  const [submitOrderBtn, setSubmitOrderBtn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getSizes(),
      getCheese(),
      getSauce(),
      getToppings(),
      getDeliveryStatus(),
    ]).then(
      ([sizesData, cheeseData, sauceData, toppingsData, deliveryData]) => {
        setSizes(sizesData);
        setCheese(cheeseData);
        setSauces(sauceData);
        setToppings(toppingsData);
        setDeliverySurcharge(deliveryData);
      }
    );
  }, []);

  const handleToppingChange = (toppingId) => {
    setSelectedToppings((prevToppings) => {
      if (prevToppings.includes(toppingId)) {
        // If topping is already selected, remove it
        return prevToppings.filter((t) => t !== toppingId);
      } else {
        // If topping is not selected, add it
        return [...prevToppings, toppingId];
      }
    });
  };

  const handleAddToCart = (event) => {
    event.preventDefault();

    // Check if required selections are made
    if (selectedCheese === 0 || selectedSauces === 0 || selectedSize === 0) {
      alert("Please select size, cheese, and sauce before adding to cart");
      return;
    }

    // If we get here, all required selections are made
    console.log("new cart item being created...");
    const newCartItem = {
      size: selectedSize,
      cheese: selectedCheese,
      sauce: selectedSauces,
      toppings: selectedToppings,
    };

    const updatedCart = [...currentCart, newCartItem];
    setCurrentCart(updatedCart);

    // const currentCartSizes = sizes.find((s) => s.id === newCartItem.size);
    // const updatedSizes = [...currentCartPreview, currentCartSizes.size];
    // setCurrentCartPreview(updatedSizes);

    // Reset form only after successful addition
    setSelectedCheese(0);
    setSelectedSauces(0);
    setSelectedSize(0);
    setSelectedToppings([]);
  };

  //Just for the current cart preview
  useEffect(() => {
    if (currentCart.length > 0) {
      // Map through the entire cart to create preview data
      const previewItems = currentCart.map((item) => {
        const sizeDetails = sizes.find((s) => s.id === item.size);
        const itemId = `${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        return {
          id: itemId,
          size: sizeDetails?.size,
        };
      });

      setCurrentCartPreview(previewItems);
    } else {
      setCurrentCartPreview([]); // Reset preview when cart is empty
    }
  }, [currentCart]);

  //Total Cost Updating
  useEffect(() => {
    if (currentCart.length > 0) {
      const currentPizzaToCalc = currentCart.at(-1);
      console.log(currentPizzaToCalc);
      const toppingsCalc = currentPizzaToCalc.toppings.length * 0.5;
      const sizeToCalc = sizes.find(
        (pizza) => pizza.id === currentPizzaToCalc.size
      );
      const sizeCalc = sizeToCalc.price;
      const currentPizzaCost = toppingsCalc + sizeCalc;
      setTotalCost((prevTotal) => prevTotal + currentPizzaCost);
    }
  }, [currentCart]);

  const handleSubmitOrder = (event) => {
    event.preventDefault();

    if (currentCart.length > 0) {
      // Calculate total order price
      const orderItems = currentCart.map((item, index) => {
        const sizeDetails = sizes.find((s) => s.id === item.size);
        const cheeseDetails = cheese.find((c) => c.id === item.cheese);
        const sauceDetails = sauces.find((s) => s.id === item.sauce);
        const toppingsPrice = item.toppings.length * 0.5; // Assuming $0.50 per topping

        return {
          id: index + 1,
          size: sizeDetails.size,
          cheese: cheeseDetails.name,
          sauce: sauceDetails.name,
          toppings: item.toppings,
          basePrice: sizeDetails.price,
          toppingsPrice: toppingsPrice,
          totalPrice: sizeDetails.price + toppingsPrice,
        };
      });

      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      const deliveryFee = isDeliveryBtn ? 10 : 0;
      const total = subtotal + deliveryFee;

      const newOrder = {
        // customerName: customerName, // need this state
        // phoneNumber: phoneNumber, // need this state
        isDelivery: isDeliveryBtn,
        deliveryAddress: isDeliveryBtn ? deliveryAddress : null,
        orderDate: new Date().toISOString(),
        items: orderItems,
        subtotal: subtotal,
        total: total,
      };

      // Post the order
      postOrder(newOrder)
        .then((response) => response.json())
        .then(() => {
          // Clear cart and reset form
          setCurrentCart([]);
          setCurrentCartPreview([]);
          setSelectedSize(0);
          setSelectedCheese(0);
          setSelectedSauces(0);
          setSelectedToppings([]);
          setDeliveryAddress("");
          // Reset other form fields
          //   setCustomerName("");
          //   setPhoneNumber("");
        })
        .then(() => {
          navigate("/");
        });
    }
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
                onChange={(e) => {
                  setSelectedSize(parseInt(e.target.value));
                }}
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
                onChange={(e) => {
                  setSelectedCheese(parseInt(e.target.value));
                }}
              >
                <option value={0}>Choose Cheese</option>
                {cheese.map((cheese) => (
                  <option key={cheese.id} value={cheese.id}>
                    {cheese.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset>
              <label>SAUCE : </label>
              <select
                value={selectedSauces}
                onChange={(s) => {
                  setSelectedSauces(parseInt(s.target.value));
                }}
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

          <fieldset className="delivery-section">
            <label>
              <input
                type="checkbox"
                checked={isDeliveryBtn}
                onChange={() => setIsDeliveryBtn(!isDeliveryBtn)}
              />
              <span>Delivery</span>
            </label>

            {isDeliveryBtn && (
              <div>
                <label>Address : </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter delivery address"
                  required
                />
              </div>
            )}
          </fieldset>
        </div>

        <div className="cart-section">
          <h3>Current Cart</h3>
          <div className="cart-items">
            {currentCartPreview.length > 0
              ? currentCartPreview.map((item) => (
                  <div key={item.id} className="cart-item">
                    {item.size} Pizza
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
