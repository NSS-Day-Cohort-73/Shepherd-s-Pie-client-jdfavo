import React, { useState, useEffect } from "react";

export const UpdateOrder = ({ order, pizzaIndex, sizes, cheeseOptions, sauces, toppings, onSave, onCancel }) => {
  const currentPizza = order.items[pizzaIndex];

  const [size, setSize] = useState(currentPizza?.size || 0);
  const [cheese, setCheese] = useState(currentPizza?.cheese || 0);
  const [sauce, setSauce] = useState(currentPizza?.sauce || 0);
  const [selectedToppings, setSelectedToppings] = useState(currentPizza?.toppings || []);

  const handleToppingChange = (toppingId) => {
    setSelectedToppings((prevToppings) => {
      if (prevToppings.includes(toppingId)) {
        return prevToppings.filter((t) => t !== toppingId);
      } else {
        return [...prevToppings, toppingId];
      }
    });
  };

  const handleSave = () => {
    const updatedPizza = { size, cheese, sauce, toppings: selectedToppings };
    onSave(updatedPizza);
  };

  return (
    <div>
      <h3>Update Pizza</h3>
      <div>
        <label>Size:</label>
        <select value={size} onChange={(e) => setSize(parseInt(e.target.value))}>
          <option value={0}>Choose Size</option>
          {sizes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.size} ({s.diameter}") - ${s.price}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Cheese:</label>
        <select value={cheese} onChange={(e) => setCheese(parseInt(e.target.value))}>
          <option value={0}>Choose Cheese</option>
          {cheeseOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Sauce:</label>
        <select value={sauce} onChange={(e) => setSauce(parseInt(e.target.value))}>
          <option value={0}>Choose Sauce</option>
          {sauces.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Toppings:</label>
        <div className="toppings-container">
          {toppings.map((topping) => (
            <div key={topping.id} className="topping-item">
              <input
                type="checkbox"
                checked={selectedToppings.includes(topping.id)}
                onChange={() => handleToppingChange(topping.id)}
              />
              <label>{topping.name} (+${topping.price})</label>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};
