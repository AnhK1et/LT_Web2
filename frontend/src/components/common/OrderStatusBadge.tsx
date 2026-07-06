import { cn } from '@/utils';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | string;

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Chờ xác nhận',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    className: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  PROCESSING: {
    label: 'Đang xử lý',
    className: 'bg-purple-100 text-purple-700 border-purple-300',
  },
  SHIPPING: {
    label: 'Đang giao',
    className: 'bg-orange-100 text-orange-700 border-orange-300',
  },
  DELIVERED: {
    label: 'Đã giao',
    className: 'bg-green-100 text-green-700 border-green-300',
  },
  CANCELLED: {
    label: 'Đã hủy',
    className: 'bg-red-100 text-red-700 border-red-300',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    className: 'bg-green-100 text-green-700 border-green-300',
  },
};

export const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export const getPaymentStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'text-green-600';
    case 'UNPAID':
      return 'text-yellow-600';
    case 'FAILED':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};
