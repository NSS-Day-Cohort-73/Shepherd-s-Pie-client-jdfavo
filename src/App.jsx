import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { ApplicationViews } from "./views/ApplicationView";
import { Authorized } from "./Authorized";


function App() {
  return (
    <>
      {
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="*"
            element={
              <Authorized>
                <ApplicationViews />
              </Authorized>
            }
          />
        </Routes>
      }
    </>
  );
}

export default App;
