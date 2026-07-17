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
  Calendar,
} from 'lucide-react';
import { StatCard } from '@/components/admin';
import { useAdminDashboard, useAdminMonthlyRevenue, useAdminDailyRevenue } from '@/hooks/useAdmin';
import { formatCurrency, getImageUrl } from '@/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

interface RevenuePeriod {
  period: string;
  revenue: number;
  orderCount: number;
}

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { stats, isLoading, error, refetch } = useAdminDashboard();
  const { revenue: monthlyRevenue } = useAdminMonthlyRevenue();
  const { revenue: dailyRevenue } = useAdminDailyRevenue(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} error={error} />;
  }

  const totalOrders = stats?.totalOrders ?? 0;
  const completedOrders = stats?.ordersByStatus?.find(s => s.status === 'DELIVERED')?.count ?? 0;
  const cancelledOrders = stats?.ordersByStatus?.find(s => s.status === 'CANCELLED')?.count ?? 0;
  const pendingOrders = stats?.ordersByStatus?.find(s => s.status === 'PENDING')?.count ?? 0;
  const processingOrders = stats?.ordersByStatus?.filter(s => ['CONFIRMED', 'PROCESSING', 'SHIPPING'].includes(s.status)).reduce((acc, s) => acc + s.count, 0) ?? 0;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  // Prepare chart data
  const orderStatusData = stats?.ordersByStatus?.map(item => ({
    name: getStatusLabel(item.status),
    value: item.count,
    status: item.status,
  })) || [];

  const pieColors = ['#F59E0B', '#3B82F6', '#8B5CF6', '#F97316', '#10B981', '#EF4444'];

  const dailyChartData = dailyRevenue?.byPeriod?.map(item => ({
    date: item.period,
    doanhThu: item.revenue,
    soDon: item.orderCount,
  })).reverse() || [];

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

        {/* Stats Grid - Tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng người dùng"
            value={stats?.totalUsers?.toLocaleString() || '0'}
            icon={Users}
          />
          <StatCard
            title="Tổng sản phẩm"
            value={stats?.totalProducts?.toLocaleString() || '0'}
            icon={Package}
          />
          <StatCard
            title="Tổng đơn hàng"
            value={totalOrders.toLocaleString()}
            icon={ShoppingCart}
          />
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={DollarSign}
          />
        </div>

        {/* Order Stats - Chi tiết đơn hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-accent-500">Đơn hoàn thành</span>
              <span className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </span>
            </div>
            <p className="text-2xl font-bold text-accent-900">{completedOrders}</p>
            <p className="text-xs text-accent-500 mt-1">{completionRate}% tổng đơn</p>
          </div>
          <div className="bg-white rounded-xl shadow-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-accent-500">Đơn chờ xử lý</span>
              <span className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-yellow-600" />
              </span>
            </div>
            <p className="text-2xl font-bold text-accent-900">{pendingOrders}</p>
            <p className="text-xs text-accent-500 mt-1">Cần xác nhận</p>
          </div>
          <div className="bg-white rounded-xl shadow-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-accent-500">Đơn đã hủy</span>
              <span className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </span>
            </div>
            <p className="text-2xl font-bold text-accent-900">{cancelledOrders}</p>
            <p className="text-xs text-accent-500 mt-1">
              {totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0}% tổng đơn
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-accent-500">Doanh thu thực tế</span>
              <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </span>
            </div>
            <p className="text-2xl font-bold text-primary">{formatCurrency(stats?.totalRevenue || 0)}</p>
            <p className="text-xs text-accent-500 mt-1">Từ đơn đã giao</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent-500" />
          <div className="flex bg-white rounded-lg p-1 shadow-card">
            {[
              { key: '7d', label: '7 ngày' },
              { key: '30d', label: '30 ngày' },
              { key: '90d', label: '90 ngày' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setTimeRange(opt.key as '7d' | '30d' | '90d')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === opt.key
                    ? 'bg-primary text-white'
                    : 'text-accent-600 hover:bg-accent-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - Full Width on large screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-card p-6"
          >
            <h2 className="text-lg font-bold text-accent-900 mb-4">Doanh thu theo thời gian</h2>
            {dailyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="doanhThu"
                    stroke="#DC2626"
                    strokeWidth={3}
                    dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#DC2626' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-accent-500">
                Chưa có dữ liệu doanh thu
              </div>
            )}
          </motion.div>

          {/* Order Status Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <h2 className="text-lg font-bold text-accent-900 mb-4">Trạng thái đơn hàng</h2>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={entry.status} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} đơn`, 'Số lượng']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-sm text-accent-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-accent-500">
                Chưa có dữ liệu đơn hàng
              </div>
            )}
          </motion.div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h2 className="text-lg font-bold text-accent-900 mb-4">Top sản phẩm bán chạy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats?.topProducts && stats.topProducts.length > 0 ? (
              stats.topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="border border-accent-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-400 text-white' :
                      index === 1 ? 'bg-gray-300 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-accent-100 text-accent-600'
                    }`}>
                      {index + 1}
                    </span>
                    <img
                      src={getImageUrl(product.thumbnail)}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-accent-50"
                    />
                  </div>
                  <p className="font-medium text-accent-900 truncate text-sm">{product.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-accent-500">{product.soldCount} đã bán</span>
                    <span className="font-bold text-primary text-sm">{formatCurrency(product.price)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-accent-500 py-4">Chưa có dữ liệu</p>
            )}
          </div>
        </motion.div>

        {/* Monthly Revenue Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h2 className="text-lg font-bold text-accent-900 mb-4">Doanh thu theo tháng</h2>
          {monthlyRevenue?.byPeriod && monthlyRevenue.byPeriod.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRevenue.byPeriod.slice(0, 6).map(item => ({
                thang: item.period,
                doanhThu: item.revenue,
                soDon: item.orderCount,
              })).reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="thang" stroke="#6B7280" fontSize={12} />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === 'doanhThu' ? formatCurrency(value) : value,
                    name === 'doanhThu' ? 'Doanh thu' : 'Số đơn'
                  ]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Bar dataKey="doanhThu" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-accent-500">
              Chưa có dữ liệu doanh thu theo tháng
            </div>
          )}
        </motion.div>

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
    SHIPPING: 'Đang giao hàng',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
    RETURNED: 'Trả hàng',
  };
  const upperStatus = status.toUpperCase();
  return labels[upperStatus] || status;
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
  const upperStatus = status.toUpperCase();
  return colors[upperStatus] || 'bg-gray-400';
};
