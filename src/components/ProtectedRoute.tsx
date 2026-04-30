import { Navigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { FullPageSkeleton } from "@/components/LoadingSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authUser, isAuthChecking } = useAuthStore();

  if (isAuthChecking) {
    return <FullPageSkeleton />;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
