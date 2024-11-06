import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { OrderList } from "../components/orders/OrderList";
import { NavBar } from "../components/nav/NavBar";

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const localPizzaUser = localStorage.getItem("pizza_user");
    const pizzaUserObject = JSON.parse(localPizzaUser);

    if (pizzaUserObject && pizzaUserObject.isAdmin !== undefined) {
      setCurrentUser(pizzaUserObject);
    } else {
      setCurrentUser(null);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <div> Shepard's Pie</div>
            <NavBar user={pizzaUserObject} />
            <OrderList />
          </>
        }
      ></Route>
    </Routes>
  );
};

//    setCurrentUser(pizzaUserObject);
