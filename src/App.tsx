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
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  const { authUser } = useAuthStore();
  console.log("Auth User state", authUser);

  return (
    <>
      <Routes>
        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:patientId" element={<PatientDetails />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Public auth routes */}
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
