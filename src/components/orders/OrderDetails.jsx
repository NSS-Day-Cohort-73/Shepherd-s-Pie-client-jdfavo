import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetOrderById, getToppings, getSizes, getCheese, getSauce, updateOrderById } from "../../services/orderService";
import { UpdateOrder } from "./updateOrder";
import "./Order.css";

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [toppings, setToppings] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [cheeseOptions, setCheeseOptions] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [updatingPizzaIndex, setUpdatingPizzaIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const orderData = await GetOrderById(orderId);
      const toppingsData = await getToppings();
      const sizesData = await getSizes();
      const cheeseData = await getCheese();
      const sauceData = await getSauce();

      setOrder(orderData);
      setToppings(toppingsData);
      setSizes(sizesData);
      setCheeseOptions(cheeseData);
      setSauces(sauceData);
    };

    fetchData();
  }, [orderId]);

  const getToppingNames = (toppingIds) => {
    return toppingIds
      .map((id) => {
        const topping = toppings.find((top) => top.id === id);
        return topping ? topping.name : "Unknown";
      })
      .join(", ");
  };

  const handleSaveUpdates = async (updatedOrder) => {
    await updateOrderById(orderId, updatedOrder);
    setUpdatingPizzaIndex(null);
    setOrder(updatedOrder);
    navigate("/orders");
  };

  const handleEditPizza = (index) => {
    setUpdatingPizzaIndex(index);
  };

  const handleCancelEdit = () => {
    setUpdatingPizzaIndex(null);
  };

  const handleRemovePizza = (index) => {
    const updatedItems = order.items.filter((_, i) => i !== index);
    setOrder({ ...order, items: updatedItems });
  };

  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="order-details-container">
      <h3>Order Details for Order #{order.id}</h3>

      {updatingPizzaIndex !== null ? (
        <UpdateOrder
          order={order}
          pizzaIndex={updatingPizzaIndex}
          sizes={sizes}
          cheeseOptions={cheeseOptions}
          sauces={sauces}
          toppings={toppings}
          onSave={(updatedPizza) => {
            const updatedItems = order.items.map((item, index) =>
              index === updatingPizzaIndex ? updatedPizza : item
            );
            setOrder({ ...order, items: updatedItems });
            setUpdatingPizzaIndex(null); // Exit edit mode
          }}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <div className="pizza-list">
            {order.items?.map((item, index) => (
              <div key={index} className="pizza-card">
                <div className="pizza-info">
                  <h4>Pizza #{index + 1}</h4>
                  <p><strong>Size:</strong> {item.size}</p>
                  <p><strong>Cheese:</strong> {item.cheese}</p>
                  <p><strong>Sauce:</strong> {item.sauce}</p>
                  <p><strong>Toppings:</strong> {getToppingNames(item.toppings)}</p>
                </div>
                <div className="pizza-actions">
                  <button className="update-btn" onClick={() => handleEditPizza(index)}>
                    Update
                  </button>
                  <button className="remove-btn" onClick={() => handleRemovePizza(index)}>
                    Remove
                  </button>
                  <p className="pizza-cost"><strong>Cost:</strong> ${item.totalPrice?.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <p><strong>Order Summary:</strong></p>
            <p>Delivery: {order.isDelivery ? "✓" : "✗"}</p>
            <p className="total-cost"><strong>Total Cost:</strong> ${order.total.toFixed(2)}</p>
          </div>

          <div className="order-actions">
            <button className="add-pizza-btn" onClick={() => setUpdatingPizzaIndex(order.items.length)}>
              Add Pizza
            </button>
            <button className="finish-btn" onClick={() => handleSaveUpdates(order)}>
              Finish Updating
            </button>
          </div>
        </>
      )}
    </div>
  );
};
