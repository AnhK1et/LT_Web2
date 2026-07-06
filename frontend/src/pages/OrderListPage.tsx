import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { OrderCard } from '@/components/common';
import { EmptyState, Breadcrumb, Pagination, Button } from '@/components/ui';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/store';

const statusFilters = [
  { value: '', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export default function OrderListPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const {
    orders,
    totalPages,
    totalElements,
    statusFilter,
    isLoading,
    setStatusFilter,
  } = useOrders();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-accent-50 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
          <Breadcrumb
            items={[{ label: 'Đơn hàng' }]}
            className="text-white/80 [&_a]:text-white/80 [&_span]:text-white"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Status Filter Tabs */}
        <div className="bg-white rounded-xl shadow-card p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value || undefined)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  statusFilter === filter.value
                    ? 'bg-primary text-white'
                    : 'text-accent-600 hover:bg-accent-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <OrderListSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="order"
            title="Không có đơn hàng nào"
            description="Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!"
            action={
              <Button onClick={() => navigate('/products')}>
                Mua sắm ngay
              </Button>
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={1}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    // Handle page change
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const OrderListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-card p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg" />
            <div>
              <div className="h-4 w-24 bg-accent-100 rounded mb-2" />
              <div className="h-3 w-16 bg-accent-100 rounded" />
            </div>
          </div>
          <div className="h-6 w-20 bg-accent-100 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-48 bg-accent-100 rounded" />
          <div className="h-6 w-24 bg-accent-100 rounded" />
        </div>
      </div>
    ))}
  </div>
);
