import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useEffect, useState } from "react";

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
        <li className="navbar-item">
          <Link to="/orders" className="navbar-button">
            <span>Orders</span>
          </Link>
        </li>

        <li className="navbar-item">
          <Link to="/createOrder" className="navbar-button">
            <span>Create New Order</span>
          </Link>
        </li>

        {isAdmin && (
          <>
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

// return (
//   <ul className="navbar">
//     <li className="navbar-item">
//       <Link to="/orders">Orders</Link>
//     </li>
//     <li className="navbar-item">
//       <Link to="/createOrder">Create New Orders</Link>
//     </li>
//     {isAdmin && (
//       <>
//         <li className="navbar-item">
//           <Link to="/employees">Employees</Link>
//         </li>
//         <li className="navbar-item">
//           <Link to="/salesReport">Sales Report</Link>
//         </li>
//       </>
//     )}
//   </ul>
//     );
