import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useAuth";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { data: user } = useCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
