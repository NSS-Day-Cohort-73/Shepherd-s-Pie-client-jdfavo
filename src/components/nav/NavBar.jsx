import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useEffect, useState } from "react";

export const NavBar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setIsAdmin(currentUser.isAdmin);
  }, []);

  return (
    <ul className="navbar">
      <li className="navbar-item">
        <Link to="/orders">Orders</Link>
      </li>
      <li className="navbar-item">
        <Link to="/createOrder">Create New Orders</Link>
      </li>
      {isAdmin && (
        <>
          <li className="navbar-item">
            <Link to="/employees">Employees</Link>
          </li>
          <li className="navbar-item">
            <Link to="/salesReport">Sales Report</Link>
          </li>
        </>
      )}
    </ul>
  );
};
