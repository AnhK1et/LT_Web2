import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { USER_ROLES } from '@/constants';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'USER' | 'ADMIN';
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = '/login'
}: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // Wait for store hydration
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const isAdmin = user?.role?.slug === USER_ROLES.ADMIN;

  // Admin route - only admin allowed
  if (requiredRole === 'ADMIN' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Higher-order component version
export const withAuth = (Component: React.ComponentType, requiredRole?: 'USER' | 'ADMIN') => {
  return function AuthenticatedComponent() {
    const { isAuthenticated, user } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      setIsHydrated(true);
    }, []);

    if (!isHydrated) {
      return null;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    const isAdmin = user?.role?.slug === USER_ROLES.ADMIN;

    if (requiredRole === 'ADMIN' && !isAdmin) {
      return <Navigate to="/" replace />;
    }

    return <Component />;
  };
};
