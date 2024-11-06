import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { OrderList } from "../components/orders/OrderList";

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const localPizzaUser = localStorage.getItem("pizza_user");
    const pizzaUserObject = JSON.parse(localPizzaUser);

    setCurrentUser(pizzaUserObject);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <div> Shepard's Pie</div>
            <OrderList />
          </>
        }
      ></Route>
    </Routes>
  );
};
