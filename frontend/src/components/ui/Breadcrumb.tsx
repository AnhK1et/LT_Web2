import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      <Link
        to="/"
        className="flex items-center text-accent-500 hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-accent-400" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-accent-500 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-accent-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
