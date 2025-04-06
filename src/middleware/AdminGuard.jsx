// middleware/AdminGuard.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "app/contexts/auth/context";

export const AdminGuard = () => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin" || user?.username?.toLowerCase() === "sadmin";

  if (!isAdmin) {
    return <Navigate to="/dashboards/home" replace />;
  }

  return <Outlet />;
};