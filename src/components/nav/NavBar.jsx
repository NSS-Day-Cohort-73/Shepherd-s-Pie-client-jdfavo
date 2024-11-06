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

  console.log("isAdmin state:", isAdmin);

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

//   useEffect(() => {
//     const currentUser = JSON.parse(localStorage.getItem("pizza-user"));
//     console.log("Current user:", currentUser);

//     if (currentUser && currentUser.isAdmin !== undefined) {
//       console.log("isAdmin value:", currentUser.isAdmin);
//       setIsAdmin(currentUser.isAdmin);
//     } else {
//       console.error("Could not retrieve isAdmin property from currentUser");
//     }
//   }, []);

//   console.log("isAdmin state:", isAdmin);

// useEffect(() => {
//     try {
//       const currentUser = JSON.parse(localStorage.getItem("pizza-user"));
//       if (currentUser) {
//         if (currentUser.isAdmin !== undefined) {
//           console.log("isAdmin value:", currentUser.isAdmin);
//           setIsAdmin(currentUser.isAdmin);
//         } else {
//           console.error("Could not retrieve isAdmin property from currentUser");
//         }
//       } else {
//         console.log("Current user is null");
//       }
//     } catch (error) {
//       console.error("Error handling NavBar component:", error);
//       // Display a fallback or error message to the user
//       return <div>An error occurred while loading the navigation bar.</div>;
//     }
//   }, []);
