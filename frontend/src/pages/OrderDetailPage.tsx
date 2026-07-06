import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, User, MapPin, Phone, CreditCard, Calendar, FileText } from 'lucide-react';
import { OrderTimeline, OrderStatusBadge } from '@/components/common';
import { Breadcrumb, Button, Skeleton } from '@/components/ui';
import { formatCurrency } from '@/utils';
import { useOrderDetail } from '@/hooks/useOrders';
import { useAuthStore } from '@/store';
import { Link } from 'react-router-dom';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const orderId = id ? parseInt(id) : undefined;
  const { order, isLoading, isCancelling, cancelOrder, canCancel } = useOrderDetail(orderId);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-accent-900 mb-4">Không tìm thấy đơn hàng</h1>
          <Link to="/orders" className="text-primary hover:underline">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    cancelOrder();
  };

  return (
    <div className="min-h-screen bg-accent-50 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Chi tiết đơn hàng</h1>
          <Breadcrumb
            items={[
              { label: 'Đơn hàng', href: '/orders' },
              { label: order.orderCode },
            ]}
            className="text-white/80 [&_a]:text-white/80 [&_span]:text-white"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-card p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-accent-900">{order.orderCode}</h2>
                <p className="text-sm text-accent-500 flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <OrderStatusBadge status={order.orderStatus} className="text-sm px-3 py-1" />
              {canCancel && (
                <Button
                  variant="danger"
                  onClick={handleCancel}
                  isLoading={isCancelling}
                >
                  Hủy đơn
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        {order.orderStatus !== 'CANCELLED' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <OrderTimeline currentStatus={order.orderStatus} />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <h3 className="font-semibold text-accent-900 mb-4">Sản phẩm đã đặt</h3>
              <div className="space-y-4">
                {order.items?.map((item: typeof order.items[0]) => (
                  <div key={item.id} className="flex gap-4 border-b border-accent-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-accent-50 rounded-lg overflow-hidden flex-shrink-0">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-accent-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-accent-900 line-clamp-2">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-accent-500 mt-1">
                        SKU: {item.productSku}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-accent-500">
                          {formatCurrency(item.price)} x {item.quantity}
                        </span>
                        <span className="font-bold text-primary">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <h3 className="font-semibold text-accent-900 mb-4">Tổng cộng</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-accent-600">Tạm tính</span>
                  <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-accent-600">Phí vận chuyển</span>
                  <span className="font-medium">{formatCurrency(order.shippingFee)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-600">Giảm giá</span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(order.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-accent-100">
                  <span className="font-semibold text-accent-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <h3 className="font-semibold text-accent-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Thông tin giao hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-accent-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-accent-500">Người nhận</p>
                    <p className="font-medium text-accent-900">{order.receiverName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-accent-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-accent-500">Số điện thoại</p>
                    <p className="font-medium text-accent-900">{order.receiverPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-accent-500">Địa chỉ</p>
                    <p className="font-medium text-accent-900">{order.receiverAddress}</p>
                  </div>
                </div>
                {order.note && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-accent-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-accent-500">Ghi chú</p>
                      <p className="font-medium text-accent-900">{order.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <h3 className="font-semibold text-accent-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Thanh toán
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-accent-600">Phương thức</span>
                  <span className="font-medium text-accent-900">{order.paymentMethodName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-600">Trạng thái</span>
                  <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-medium"
          >
            ← Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

const OrderDetailSkeleton = () => (
  <div className="min-h-screen bg-accent-50 pb-12">
    <div className="bg-gradient-to-r from-primary to-red-600 text-white py-8">
      <div className="container mx-auto px-4">
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-xl" />
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  </div>
);
