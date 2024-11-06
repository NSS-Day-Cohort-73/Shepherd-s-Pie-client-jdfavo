export const getEmployees = () => {
  return fetch("http://localhost:8088/users?isAdmin=false").then((res) =>
    res.json()
  );
};
