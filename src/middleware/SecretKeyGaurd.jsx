// middleware/SecretKeyGuard.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "app/contexts/auth/context";

export const SecretKeyGuard = () => {
  const { user, isSecretKeyVerified } = useAuthContext();
  
  if (user?.username?.toLowerCase() === 'sadmin') {
    if (!isSecretKeyVerified) {
      return <Navigate to="/verify-secret-key" replace />;
    }
  }

  return <Outlet />;
};