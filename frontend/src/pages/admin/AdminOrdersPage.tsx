import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AdminTable, Modal, ConfirmDialog } from '@/components/admin';
import { Button, Input } from '@/components/ui';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useAdmin';
import { formatCurrency } from '@/utils';
import type { Order } from '@/types';

const statusOptions = [
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPING: 'bg-orange-100 text-orange-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang xử lý',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {labels[status] || status}
    </span>
  );
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const queryParams = useMemo(() => ({
    page: page - 1,
    size: 10,
    status: statusFilter,
  }), [page, statusFilter]);

  const { orders, totalPages, totalElements, isLoading, refetch } = useAdminOrders(queryParams);

  const updateStatusMutation = useUpdateOrderStatus();

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus) {
      await updateStatusMutation.mutateAsync({ id: selectedOrder.id, status: newStatus });
      setIsStatusModalOpen(false);
      refetch();
    }
  };

  const columns = [
    {
      key: 'orderCode',
      label: 'Mã đơn',
      render: (item: Order) => (
        <span className="font-bold text-primary">{item.orderCode}</span>
      ),
    },
    {
      key: 'userName',
      label: 'Khách hàng',
      render: (item: Order) => (
        <div>
          <p className="font-medium text-accent-900">{item.userName || 'Khách vãng lai'}</p>
          <p className="text-xs text-accent-500">{item.userEmail}</p>
        </div>
      ),
    },
    {
      key: 'receiver',
      label: 'Người nhận',
      render: (item: Order) => (
        <div>
          <p className="text-sm">{item.receiverName}</p>
          <p className="text-xs text-accent-500">{item.receiverPhone}</p>
        </div>
      ),
    },
    {
      key: 'totalPrice',
      label: 'Tổng tiền',
      render: (item: Order) => (
        <span className="font-bold text-primary">{formatCurrency(item.totalPrice)}</span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Thanh toán',
      render: (item: Order) => item.paymentMethodName || 'COD',
    },
    {
      key: 'orderStatus',
      label: 'Trạng thái',
      render: (item: Order) => getStatusBadge(item.orderStatus),
    },
    {
      key: 'createdAt',
      label: 'Ngày đặt',
      render: (item: Order) => (
        <span className="text-sm text-accent-600">
          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (item: Order) => (
        <button
          onClick={() => openDetailModal(item)}
          className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          Chi tiết
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-accent-900">Đơn hàng</h1>
            <p className="text-accent-500 mt-1">Quản lý đơn hàng ({totalElements} đơn hàng)</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-card p-4 flex flex-wrap gap-4">
          <select
            value={statusFilter || ''}
            onChange={(e) => {
              setStatusFilter(e.target.value || undefined);
              setPage(1);
            }}
            className="px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tất cả trạng thái</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <AdminTable
          columns={columns}
          data={orders}
          loading={isLoading}
          emptyText="Không có đơn hàng nào"
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  page === i + 1
                    ? 'bg-primary text-white'
                    : 'bg-white text-accent-600 hover:bg-accent-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Chi tiết đơn hàng ${selectedOrder?.orderCode}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status & Actions */}
            <div className="flex items-center justify-between">
              {getStatusBadge(selectedOrder.orderStatus)}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openStatusModal(selectedOrder);
                  }}
                  disabled={selectedOrder.orderStatus === 'CANCELLED' || selectedOrder.orderStatus === 'DELIVERED'}
                >
                  Cập nhật trạng thái
                </Button>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="font-semibold text-accent-900 mb-2">Thông tin khách hàng</h3>
              <div className="bg-accent-50 rounded-lg p-4 space-y-1 text-sm">
                <p><span className="text-accent-500">Tên:</span> {selectedOrder.userName || 'Khách vãng lai'}</p>
                <p><span className="text-accent-500">Email:</span> {selectedOrder.userEmail || '-'}</p>
              </div>
            </div>

            {/* Shipping Info */}
            <div>
              <h3 className="font-semibold text-accent-900 mb-2">Địa chỉ giao hàng</h3>
              <div className="bg-accent-50 rounded-lg p-4 space-y-1 text-sm">
                <p><span className="text-accent-500">Người nhận:</span> {selectedOrder.receiverName}</p>
                <p><span className="text-accent-500">SĐT:</span> {selectedOrder.receiverPhone}</p>
                <p><span className="text-accent-500">Địa chỉ:</span> {selectedOrder.receiverAddress}</p>
                {selectedOrder.note && <p><span className="text-accent-500">Ghi chú:</span> {selectedOrder.note}</p>}
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold text-accent-900 mb-2">Sản phẩm</h3>
              <div className="border border-accent-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-accent-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Sản phẩm</th>
                      <th className="px-4 py-2 text-center">SL</th>
                      <th className="px-4 py-2 text-right">Giá</th>
                      <th className="px-4 py-2 text-right">Tổng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-accent-100">
                    {selectedOrder.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-accent-500">{item.productSku}</p>
                        </td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-accent-500">Tạm tính</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent-500">Phí vận chuyển</span>
                <span>{formatCurrency(selectedOrder.shippingFee)}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatCurrency(selectedOrder.totalPrice)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Cập nhật trạng thái đơn hàng"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-accent-600">
            Đơn hàng: <span className="font-bold">{selectedOrder?.orderCode}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-2">Trạng thái mới</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="flex-1"
              onClick={handleUpdateStatus}
              isLoading={updateStatusMutation.isPending}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
