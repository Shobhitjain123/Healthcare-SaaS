import { Routes, Route, Navigate } from "react-router";
import "./App.css";
import { useAuthStore } from "./store/useAuthStore";
import Dashboard from "./modules/dashboard/Dashboard";
import Login from "./modules/auth/Login";
import Register from "./modules/auth/Register";
function App() {
  const { authUser } = useAuthStore();
  console.log("Auth User state", authUser);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
