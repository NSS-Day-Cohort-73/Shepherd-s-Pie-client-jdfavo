import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useEffect, useState } from "react";

export const NavBar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("pizza-user"));
    if (currentUser && currentUser.isAdmin !== undefined) {
      setIsAdmin(currentUser.isAdmin);
    }
  }, []);

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <button className="navbar-button" onClick={() => navigate("/orders")}>
            <span>Orders</span>
          </button>
        </li>
        <li className="navbar-item">
          <button
            className="navbar-button"
            onClick={() => navigate("/createOrder")}
          >
            <span>Create New Order</span>
          </button>
        </li>
        {isAdmin && (
          <>
            <li className="navbar-item">
              <button
                className="navbar-button"
                onClick={() => navigate("/employees")}
              >
                <span>Employees</span>
              </button>
            </li>
            <li className="navbar-item">
              <button
                className="navbar-button"
                onClick={() => navigate("/salesReport")}
              >
                <span>Sales Report</span>
              </button>
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
