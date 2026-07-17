import { useRef, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';

interface DebouncedLinkProps extends LinkProps {
  debounceMs?: number;
}

export const DebouncedLink = ({ to, onClick, debounceMs = 500, children, ...props }: DebouncedLinkProps) => {
  const lastClickTime = useRef<number>(0);
  const navigate = useNavigate();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const now = Date.now();
      if (now - lastClickTime.current < debounceMs) {
        e.preventDefault();
        return;
      }
      lastClickTime.current = now;

      if (onClick) {
        onClick(e);
      }
    },
    [onClick, debounceMs]
  );

  return (
    <RouterLink to={to} onClick={handleClick} {...props}>
      {children}
    </RouterLink>
  );
};
