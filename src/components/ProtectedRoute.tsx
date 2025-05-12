
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requiresAdmin = false }: ProtectedRouteProps) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    // Return loading state while checking authentication
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!authState.user) {
    return <Navigate to="/login" />;
  }

  // If admin access is required but user is not an admin
  if (requiresAdmin && !authState.isAdmin) {
    return <Navigate to="/" />;
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};
