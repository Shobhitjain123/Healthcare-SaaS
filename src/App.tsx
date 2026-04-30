import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import "./App.css";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { FullPageSkeleton } from "./components/LoadingSkeleton";

// Lazy load route components for code splitting
const Dashboard = lazy(() => import("./modules/dashboard/Dashboard"));
const Home = lazy(() => import("./modules/home/Home"));
const Login = lazy(() => import("./modules/auth/Login"));
const Register = lazy(() => import("./modules/auth/Register"));
const Patients = lazy(() => import("./modules/patients/Patients"));
const Analytics = lazy(() => import("./modules/analytics/Analytics"));
const PatientDetails = lazy(() => import("./modules/patient-details/PatientDetails"));

function App() {
  const { authUser } = useAuthStore();

  return (
    <>
      <Suspense fallback={<FullPageSkeleton />}>
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
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
