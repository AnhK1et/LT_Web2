import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { StatCard } from '@/components/admin';
import { useAdminDashboard, useAdminMonthlyRevenue, useAdminDailyRevenue } from '@/hooks/useAdmin';
import { formatCurrency } from '@/utils';

export default function AdminDashboardPage() {
  const { stats, isLoading, error, refetch } = useAdminDashboard();
  const { revenue: monthlyRevenue, isLoading: monthlyLoading } = useAdminMonthlyRevenue();
  const { revenue: dailyRevenue, isLoading: dailyLoading } = useAdminDailyRevenue(7);

  console.log('[DashboardPage] Rendering:', { isLoading, error, stats });

  if (isLoading) {
    console.log('[DashboardPage] Showing skeleton...');
    return <DashboardSkeleton />;
  }

  if (error) {
    console.log('[DashboardPage] Showing error:', error);
    return <ErrorState onRetry={refetch} error={error} />;
  }

  console.log('[DashboardPage] Rendering content...');

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-accent-900">Dashboard</h1>
            <p className="text-accent-500 mt-1">Tổng quan về cửa hàng của bạn</p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng người dùng"
            value={stats?.totalUsers?.toLocaleString() || '0'}
            icon={Users}
            trend={stats?.userGrowth}
          />
          <StatCard
            title="Tổng sản phẩm"
            value={stats?.totalProducts?.toLocaleString() || '0'}
            icon={Package}
          />
          <StatCard
            title="Tổng đơn hàng"
            value={stats?.totalOrders?.toLocaleString() || '0'}
            icon={ShoppingCart}
          />
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={DollarSign}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <h2 className="text-lg font-bold text-accent-900 mb-4">Trạng thái đơn hàng</h2>
            <div className="space-y-4">
              {stats?.ordersByStatus && stats.ordersByStatus.length > 0 ? (
                stats.ordersByStatus.map((item) => {
                  const total = stats.totalOrders || 1;
                  const percent = Math.round((item.count / total) * 100);
                  return (
                    <div key={item.status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-accent-700">{getStatusLabel(item.status)}</span>
                        <span className="font-medium text-accent-900">{item.count} ({percent}%)</span>
                      </div>
                      <div className="h-3 bg-accent-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full ${getStatusColor(item.status)}`}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-accent-500 py-4">Chưa có dữ liệu đơn hàng</p>
              )}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <h2 className="text-lg font-bold text-accent-900 mb-4">Top sản phẩm bán chạy</h2>
            <div className="space-y-4">
              {stats?.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <span className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center text-sm font-medium text-accent-600">
                      {index + 1}
                    </span>
                    <img
                      src={product.thumbnail || '/placeholder.png'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-accent-50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-accent-900 truncate">{product.name}</p>
                      <p className="text-sm text-accent-500">{product.soldCount} đã bán</p>
                    </div>
                    <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-accent-500 py-4">Chưa có dữ liệu</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Revenue Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <h2 className="text-lg font-bold text-accent-900 mb-4">Doanh thu theo tháng</h2>
            <div className="space-y-3">
              {monthlyRevenue?.byPeriod && monthlyRevenue.byPeriod.length > 0 ? (
                monthlyRevenue.byPeriod.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
                    <span className="text-accent-700 font-medium">{item.period}</span>
                    <div className="text-right">
                      <span className="font-bold text-primary">{formatCurrency(item.revenue)}</span>
                      <span className="text-xs text-accent-500 ml-2">{item.orderCount} đơn</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-accent-500 py-4">Chưa có dữ liệu doanh thu</p>
              )}
            </div>
          </motion.div>

          {/* Daily Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <h2 className="text-lg font-bold text-accent-900 mb-4">Doanh thu 7 ngày gần nhất</h2>
            <div className="space-y-3">
              {dailyRevenue?.byPeriod && dailyRevenue.byPeriod.length > 0 ? (
                dailyRevenue.byPeriod.slice(0, 7).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
                    <span className="text-accent-700 font-medium">{item.period}</span>
                    <div className="text-right">
                      <span className="font-bold text-primary">{formatCurrency(item.revenue)}</span>
                      <span className="text-xs text-accent-500 ml-2">{item.orderCount} đơn</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-accent-500 py-4">Chưa có dữ liệu</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Low Stock Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-accent-900">Sản phẩm sắp hết hàng</h2>
            <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
              {stats?.lowStockProducts?.length || 0} sản phẩm
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="border border-accent-200 rounded-lg p-4">
                  <p className="font-medium text-accent-900 truncate">{product.name}</p>
                  <p className="text-sm text-accent-500 mt-1">SKU: {product.sku}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">Còn {product.quantity} sản phẩm</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-accent-500 py-4">Không có sản phẩm sắp hết hàng</p>
            )}
          </div>
        </motion.div>
      </div>
  );
}

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="h-8 w-48 bg-accent-100 rounded animate-pulse" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="h-64 bg-white rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

const ErrorState = ({ onRetry, error }: { onRetry: () => void; error: unknown }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <AlertTriangle className="w-8 h-8 text-red-500" />
    </div>
    <h2 className="text-xl font-bold text-accent-900 mb-2">Đã xảy ra lỗi</h2>
    <p className="text-accent-500 mb-4 text-center max-w-md">
      {error instanceof Error ? error.message : 'Không thể tải dữ liệu Dashboard'}
    </p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      Thử lại
    </button>
  </div>
);

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang xử lý',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
    RETURNED: 'Trả hàng',
  };
  return labels[status] || status;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-400',
    CONFIRMED: 'bg-blue-400',
    PROCESSING: 'bg-blue-400',
    SHIPPING: 'bg-orange-400',
    DELIVERED: 'bg-green-400',
    CANCELLED: 'bg-red-400',
    RETURNED: 'bg-purple-400',
  };
  return colors[status] || 'bg-gray-400';
};
