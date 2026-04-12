import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "student" | "tutor" | "admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
