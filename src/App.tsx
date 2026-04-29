import { Routes, Route, Navigate } from "react-router";
import "./App.css";
import { useAuthStore } from "./store/useAuthStore";
import Dashboard from "./modules/dashboard/Dashboard";
import Home from "./modules/home/Home";
import Login from "./modules/auth/Login";
import Register from "./modules/auth/Register";
import { Toaster } from "react-hot-toast";
import Patients from "./modules/patients/Patients";
import Analytics from "./modules/analytics/Analytics";
import PatientDetails from "./modules/patient-details/PatientDetails";
function App() {
  const { authUser } = useAuthStore();
  console.log("Auth User state", authUser);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <Home>
                <Dashboard />
              </Home>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/patients"
          element={
            authUser ? (
              <Home>
                <Patients />
              </Home>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/patients/:patientId"
          element={
            authUser ? (
              <Home>
                <PatientDetails />
              </Home>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/analytics"
          element={
            authUser ? (
              <Home>
                <Analytics />
              </Home>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
