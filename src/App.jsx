import { Route, Routes, BrowserRouter as Router, BrowserRouter } from "react-router-dom";
import "./App.css";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { ApplicationViews } from "./views/ApplicationView";

function App() {
  return (
    <>
      {<BrowserRouter>
        <Router>
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
        </Router>
        </BrowserRouter>
      }
    </>
  );
}

export default App;
