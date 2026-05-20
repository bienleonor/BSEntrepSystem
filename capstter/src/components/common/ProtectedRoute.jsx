import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";
import { useRBAC } from "../../utils/rbac";

export default function ProtectedRoute({ roles = [] }) {
  const { isAuthenticated, loading } = useAuth();
  const { role } = useRBAC();

  if (loading) return <div>Loading...</div>;

  // not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // role-based authorization
  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // allow children
  return <Outlet />;
}