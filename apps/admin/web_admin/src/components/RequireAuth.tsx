import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthSession } from '../lib/auth';

export function RequireAuth() {
  const session = useAuthSession();
  const location = useLocation();
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}