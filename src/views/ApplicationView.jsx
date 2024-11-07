import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { NavBar } from "../components/nav/NavBar.jsx";
import { OrderDetails } from "../components/orders/OrderDetails.jsx";
import { OrderList } from "../components/orders/OrderList";
import { EmployeeList } from "../components/employees/employeeList.jsx";
import { EditEmployee } from "../components/employees/EditEmployee.jsx";
import { CreateOrder } from "../components/orders/CreateOrder.jsx";

// Layout component that includes common elements
const Layout = () => {
  return (
    <>
      <div>Shepard's Pie</div>
      <NavBar />
      <Outlet />
    </>
  );
};

// Admin layout component
const AdminLayout = () => {
  return (
    <>
      <div>Admin Dashboard</div>
      <NavBar />
      <Outlet />
    </>
  );
};

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const localPizzaUser = localStorage.getItem("pizza_user");
    if (localPizzaUser) {
      const pizzaUserObject = JSON.parse(localPizzaUser);
      setCurrentUser(pizzaUserObject);
    }
  }, []);

  const isAdmin = currentUser?.isAdmin === true;

  return (
    <Routes>
      {/* Main layout routes */}
      <Route element={<Layout />}>
        <Route index element={<OrderList />} />
        <Route path="orders/:orderId" element={<OrderDetails />} />
        <Route path="createOrder" element={<CreateOrder />} />
      </Route>

      {/* Admin routes */}
      {isAdmin ? (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<EmployeeList />} />
          <Route path="employees/:employeeId" element={<EditEmployee />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="createOrder" element={<CreateOrder />} />
        </Route>
      ) : (
        <Route path="admin/*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};
