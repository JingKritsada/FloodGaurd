import type { Role } from "@/types/index.types";

import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/providers/AuthContext";

interface ProtectedRouteProps {
  requiredRoles?: Role[];
}

export default function ProtectedRoute({ requiredRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return <Navigate replace to="/forbidden" />;
  }

  return <Outlet />;
}
