import { type ReactNode } from 'react';
import { cn } from '@/utils';

export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className, hover = false, onClick }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-card border border-accent-100 overflow-hidden',
        hover && 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('px-4 py-3 border-b border-accent-100', className)}>{children}</div>
);

export const CardBody = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('p-4', className)}>{children}</div>
);

export const CardFooter = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('px-4 py-3 border-t border-accent-100 bg-accent-50', className)}>{children}</div>
);
