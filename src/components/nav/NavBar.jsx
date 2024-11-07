import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./NavBar.css";

export const NavBar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("pizza_user"));
    if (currentUser && currentUser.isAdmin !== undefined) {
      setIsAdmin(currentUser.isAdmin);
    }
  }, []);

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {/* Non-Admin users: Link to orders */}
        {!isAdmin && (
          <li className="navbar-item">
            <Link to="/orders" className="navbar-button">
              <span>Orders</span>
            </Link>
          </li>
        )}

        {/* Both admin and non-admin can create new orders */}
        <li className="navbar-item">
          <Link to="/createOrder" className="navbar-button">
            <span>Create New Order</span>
          </Link>
        </li>

        {/* Admin-only Links */}
        {isAdmin && (
          <>
            {/* Admins get the Admin Orders link */}
            <li className="navbar-item">
              <Link to="/admin/orders" className="navbar-button">
                <span>Orders</span>
              </Link>
            </li>

            <li className="navbar-item">
              <Link to="/admin" className="navbar-button">
                <span>Employees</span>
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/salesReport" className="navbar-button">
                <span>Sales Report</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
