import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Package, CreditCard, ChevronRight } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatCurrency } from '@/utils';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const itemCount = order.items?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all"
    >
      <Link to={`/orders/${order.id}`} className="block">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-accent-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-accent-50 rounded-lg">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-accent-900">{order.orderCode}</p>
                <div className="flex items-center gap-2 text-sm text-accent-500 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <OrderStatusBadge status={order.orderStatus} />
              <ChevronRight className="w-5 h-5 text-accent-400 hidden md:block" />
            </div>
          </div>
        </div>

        {/* Items Preview */}
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-accent-600">
              <span>{itemCount} sản phẩm</span>
              {order.items?.[0] && (
                <>
                  <span className="text-accent-300">•</span>
                  <span className="line-clamp-1">{order.items[0].productName}</span>
                  {itemCount > 1 && (
                    <span className="text-primary">+{itemCount - 1} sản phẩm khác</span>
                  )}
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {formatCurrency(order.totalPrice)}
              </p>
              <div className="flex items-center gap-1 text-sm text-accent-500 justify-end mt-1">
                <CreditCard className="w-4 h-4" />
                <span>{order.paymentMethodName || 'COD'}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
