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
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('[ProtectedRoute] Render:', {
      path: location.pathname,
      isHydrated,
      isAuthenticated,
      userRole: user?.role,
      requiredRole,
      isAdmin: user?.role?.slug === USER_ROLES.ADMIN,
    });
  }, [isHydrated, isAuthenticated, user, location.pathname, requiredRole]);

  // Wait for hydration
  if (!isHydrated) {
    console.log('[ProtectedRoute] Waiting for hydration...');
    return null;
  }

  // Not logged in
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const isAdmin = user?.role?.slug === USER_ROLES.ADMIN;

  // Admin route - only admin allowed
  if (requiredRole === 'ADMIN' && !isAdmin) {
    console.log('[ProtectedRoute] Not admin, redirecting to /');
    return <Navigate to="/" replace />;
  }

  // User route - any authenticated user
  if (requiredRole === 'USER' && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  console.log('[ProtectedRoute] Access granted');
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

    if (requiredRole === 'ADMIN' && !isAdmin) {
      return <Navigate to="/" replace />;
    }

    return <Component />;
  };
};
