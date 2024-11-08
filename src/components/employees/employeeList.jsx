import { useEffect, useState } from "react";
import { getEmployees } from "../../services/employeeService";
import { GetOrders } from "../../services/orderService";
import { Link } from "react-router-dom"; // Make sure you import Link
import "./employee.css";

export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [orders, setOrders] = useState([]);
  const [employeeOrdersCount, setEmployeeOrdersCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employees and orders in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeData, orderData] = await Promise.all([
          getEmployees(),
          GetOrders(),
        ]);

        setEmployees(employeeData);
        setOrders(orderData);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once, after the first render

  // Calculate orders per employee
  useEffect(() => {
    if (employees.length > 0 && orders.length > 0) {
      console.log("Employees:", employees);
      console.log("Orders:", orders);

      const counts = employees.reduce((acc, employee) => {
        // Debugging log to check userId and employee.id values
        console.log(`Checking employee ${employee.name} (ID: ${employee.id})`);

        // Count the number of orders for each employee (user)
        const count = orders.filter((order) => {
          console.log(`Checking order with userId ${order.userId}`);
          return order.userId === employee.id;
        }).length;

        acc[employee.id] = count;
        return acc;
      }, {});

      console.log("Order Counts by Employee:", counts);

      setEmployeeOrdersCount(counts);
    }
  }, [employees, orders]); // Runs after employees and orders have been set

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (employees.length === 0) {
    return <div>No employees found</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found</div>;
  }

  return (
    <section>
      <header>Current Employees</header>
      <div className="employee-grid">
        {employees.map(({ id, name, phone, address, email }) => {
          // Use the count from the state
          const orderCount = employeeOrdersCount[id] || 0; // Default to 0 if no count found
          return (
            <div key={id} className="employee-card">
              <h2>{name}</h2>
              <div className="info-row">
                <span className="label">Role:</span>
                <span className="value">Employee</span>
              </div>
              <div className="info-row">
                <span className="label">Phone Number:</span>
                <span className="value">{phone}</span>
              </div>
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">{address}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{email}</span>
              </div>
              <div className="info-row">
                <span className="label"># of Orders:</span>
                <span className="value">{orderCount}</span>
              </div>
              <div>
                <Link to={`/admin/employees/${id}`}>
                  <button>EDIT</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
