import { useEffect, useState } from "react";
import { NavBar } from "../components/nav/NavBar";
import { OrderDetails } from "../components/orders/OrderDetails";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { OrderList } from "../components/orders/OrderList.jsx";
import { EmployeeList } from "../components/employees/employeeList.jsx";

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const localPizzaUser = localStorage.getItem("pizza_user");
    if (localPizzaUser) {
      const pizzaUserObject = JSON.parse(localPizzaUser);
      setCurrentUser(pizzaUserObject);

      // If the user is an admin, redirect to the admin page
      if (pizzaUserObject.isAdmin) {
        navigate("/admin");
      }
    }
    setLoading(false); // Set loading to false after the check
  }, [navigate]); // Dependency on navigate

  // Check if the user is an admin
  const isAdmin = currentUser?.isAdmin === true;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Default Route for the Home Page (Order List) */}
      <Route
        path="/"
        element={
          <>
            <div>Shepard's Pie</div>
            <NavBar />
            <OrderList />
            {/* <CreateOrder /> */} {/*uncomment to test create order*/}
          </>
        }
      />
      <Route path="/orders/:orderId" element={<OrderDetails />} />

      {/* Admin Route - only accessible if user is an admin */}
      {isAdmin ? (
        <Route
          path="/admin"
          element={
            <>
              <div>Admin Dashboard</div>
              <NavBar />
              {/* Admin-specific content can be added here */}
              <EmployeeList />
            </>
          }
        />
      ) : (
        // Redirect non-admin users who try to access /admin
        <Route path="/admin" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};

//    setCurrentUser(pizzaUserObject);
