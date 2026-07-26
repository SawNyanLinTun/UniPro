import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Requires a Supabase session. Unauthenticated users are sent home and the
 * sign-in modal is opened (HashRouter-safe).
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      openAuthModal('signin');
    }
  }, [loading, session, openAuthModal]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-text-secondary animate-pulse">
        Checking session…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
