import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editEmployee, getEmployeeById } from "../../services/employeeService";

export const EditEmployee = () => {
  const [employee, setEmployee] = useState();
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    email: "",
  });

  const { employeeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getEmployeeById(employeeId).then((employeeArray) => {
      const employeeObj = employeeArray[0];
      setEmployee(employeeObj);
      // Set initial form data from employee object
      setFormData({
        address: employeeObj.address,
        phone: employeeObj.phone,
        email: employeeObj.email,
      });
    });
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const editedEmployee = {
      id: employee.id,
      name: employee.name,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      isAdmin: false,
    };
    editEmployee(editedEmployee).then(() => {
      navigate("/admin");
    });
  };

  return (
    <div>
      <h2>{employee?.name}</h2>
      <section>
        <div>
          <span>Address : </span>
          <input
            type="text"
            name="address"
            defaultValue={employee?.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <span>Phone Number : </span>
          <input
            type="text"
            name="phone"
            defaultValue={employee?.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <span>Email : </span>
          <input
            type="text"
            name="email"
            defaultValue={employee?.email}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSave}>Save Changes</button>
      </section>
    </div>
  );
};
