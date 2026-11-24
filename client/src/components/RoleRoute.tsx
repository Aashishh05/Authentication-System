import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/auth";

const RoleRoute = ({ allowed }: { allowed: Role[] }) => {
  const { hasRole } = useAuth();
  return hasRole(...allowed) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default RoleRoute;