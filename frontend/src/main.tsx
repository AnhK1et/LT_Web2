import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from '@/routes';
import { useAuthStore } from '@/store';
import { STORAGE_KEYS } from '@/constants';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Component to initialize auth state
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Restore auth state from localStorage on app load
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    
    console.log('[AuthInitializer] Checking localStorage:', {
      hasToken: !!token,
      hasUser: !!userStr,
    });
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log('[AuthInitializer] Restoring user:', userData);
        // Transform role if needed
        const transformedUser = {
          ...userData,
          role: typeof userData.role === 'string'
            ? { id: 0, name: userData.role, slug: userData.roleSlug || userData.role?.toLowerCase() }
            : userData.role,
        };
        setUser(transformedUser);
      } catch (err) {
        console.error('[AuthInitializer] Parse error:', err);
        // Invalid user data, clear storage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    
    setInitialized(true);
  }, [setUser]);

  // Don't render children until we've checked localStorage
  if (!initialized) {
    return null;
  }

  return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <AppRouter />
      </AuthInitializer>
    </QueryClientProvider>
  </StrictMode>
);
