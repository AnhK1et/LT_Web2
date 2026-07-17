import { useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LOCK_DURATION = 1000; // 1 second lock after navigation

let navigationLockTimeout: ReturnType<typeof setTimeout> | null = null;

export const useNavigationLock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastNavigation = useRef<number>(0);

  useEffect(() => {
    lastNavigation.current = Date.now();
  }, [location.pathname]);

  const safeNavigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const now = Date.now();
    const timeSinceLastNav = now - lastNavigation.current;

    if (timeSinceLastNav < LOCK_DURATION) {
      console.warn('Navigation blocked - too soon after last navigation');
      return;
    }

    lastNavigation.current = now;
    navigate(to, options);
  }, [navigate]);

  return { safeNavigate };
};

// Hook to block rapid re-renders
export const useBlockReRender = () => {
  const location = useLocation();
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current++;
    if (renderCount.current > 10) {
      console.error('Component re-rendered too many times at:', location.pathname);
    }
  });
};
