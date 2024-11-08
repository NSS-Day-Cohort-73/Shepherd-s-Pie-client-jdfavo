import { useEffect, useState } from "react";
import { getEmployees } from "../../services/employeeService";
import "./employee.css";
import { Link, useNavigate } from "react-router-dom";

export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees().then((e) => {
      setEmployees(e);
    });
  }, []);

  return (
    <section>
      <header>Current Employees</header>
      <div className="employee-grid">
        {employees.map((e) => {
          return (
            <div key={e.id} className="employee-card">
              <h2>{e.name}</h2>
              <div className="info-row">
                <span className="label">Role : </span>
                <span className="value">Employee</span>
              </div>
              <div className="info-row">
                <span className="label">Phone Number : </span>
                <span className="value">{e.phone}</span>
              </div>
              <div className="info-row">
                <span className="label">Address : </span>
                <span className="value">{e.address}</span>
              </div>
              <div className="info-row">
                <span className="label">Email : </span>
                <span className="value">{e.email}</span>
              </div>
              <div className="info-row">
                <span className="label"># of Orders : </span>
                <span className="value">
                  needs state here based on assigned orders
                </span>
              </div>
              <div>
                <Link to={`/admin/employees/${e.id}`}>
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
