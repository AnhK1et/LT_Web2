import { type ReactNode } from 'react';
import { Package, ShoppingBag, Search, FileX, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';

interface EmptyStateProps {
  icon?: 'cart' | 'product' | 'search' | 'order' | 'error';
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ icon = 'product', title, description, action, className }: EmptyStateProps) => {
  const icons = {
    cart: ShoppingBag,
    product: Package,
    search: Search,
    order: FileX,
    error: AlertCircle,
  };

  const Icon = icons[icon];

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="w-20 h-20 rounded-full bg-accent-100 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-accent-400" />
      </div>
      <h3 className="text-lg font-semibold text-accent-900 mb-2">{title}</h3>
      {description && <p className="text-accent-500 mb-6 max-w-md">{description}</p>}
      {action}
    </div>
  );
};
