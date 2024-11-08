import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { NavBar } from "../components/nav/NavBar.jsx";
import { OrderDetails } from "../components/orders/OrderDetails.jsx";
import { OrderList } from "../components/orders/OrderList";
import { EmployeeList } from "../components/employees/employeeList.jsx";
import { CreateOrder } from "../components/orders/CreateOrder.jsx";
import { UpdateOrder } from "../components/orders/UpdateOrder.jsx"; // Import UpdateOrder component

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch the current user from localStorage
  useEffect(() => {
    const localPizzaUser = localStorage.getItem("pizza_user");
    if (localPizzaUser) {
      const pizzaUserObject = JSON.parse(localPizzaUser);
      setCurrentUser(pizzaUserObject);
    }
  }, [navigate, location]);

  const isAdmin = currentUser?.isAdmin === true;

  return (
    <Routes>
      <Route
        path="/orders"
        element={
          <>
            <div>Shepard's Pie</div>
            <NavBar />
            <OrderList />
            <CreateOrder />
          </>
        }
      />

      <Route path="/orders/:orderId" element={<OrderDetails />} />

      {/* Add UpdateOrder route with orderId parameter */}
      <Route path="/orders/update/:orderId" element={<UpdateOrder />} />

      {/* Admin routes */}
      {isAdmin && (
        <>
          <Route path="/admin">
            <Route
              index
              element={
                <>
                  <div>Admin Dashboard</div>
                  <NavBar />
                  <EmployeeList />
                </>
              }
            />

            <Route
              path="orders"
              element={
                <>
                  <NavBar />
                  <OrderList />
                </>
              }
            />
          </Route>
        </>
      )}

      {/* Non-admin users should be redirected from /admin and /admin/orders */}
      {!isAdmin && (
        <>
          {/* Only redirect to / if the current path is not already / */}
          <Route
            path="/admin"
            element={
              location.pathname !== "/admin" ? (
                <Navigate to="/" replace />
              ) : null
            }
          />
          <Route
            path="/admin/orders"
            element={
              location.pathname !== "/admin/orders" ? (
                <Navigate to="/" replace />
              ) : null
            }
          />
        </>
      )}
    </Routes>
  );
};
