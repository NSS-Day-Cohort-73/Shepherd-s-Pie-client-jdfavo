export const getEmployees = () => {
  return fetch("http://localhost:8088/users?isAdmin=false").then((res) =>
    res.json()
  );
};

export const getEmployeeById = (employeeId) => {
  return fetch(`http://localhost:8088/users?id=${employeeId}`).then((res) =>
    res.json()
  );
};

export const editEmployee = (editedEmployee) => {
  return fetch(`http://localhost:8088/users/${editedEmployee.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedEmployee),
  });
};
