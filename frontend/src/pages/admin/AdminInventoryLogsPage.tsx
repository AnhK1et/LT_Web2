import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { AdminTable, Modal } from '@/components/admin';
import { Button, Input } from '@/components/ui';
import { useProductInventoryLogs, useVariantInventoryLogs, useAdjustProductStock, useAdjustVariantStock } from '@/hooks/useAdmin';
import type { InventoryLog } from '@/types';
import { RefreshCw, ChevronRight } from 'lucide-react';

const changeTypeLabels: Record<string, string> = {
  sale: 'Bán hàng',
  restock: 'Nhập kho',
  adjustment: 'Điều chỉnh',
  return: 'Trả hàng',
  cancel: 'Hủy đơn',
  return_restock: 'Hoàn kho',
};

const changeTypeColors: Record<string, string> = {
  sale: 'bg-red-100 text-red-700',
  restock: 'bg-green-100 text-green-700',
  adjustment: 'bg-blue-100 text-blue-700',
  return: 'bg-purple-100 text-purple-700',
  cancel: 'bg-orange-100 text-orange-700',
  return_restock: 'bg-emerald-100 text-emerald-700',
};

export default function AdminInventoryLogsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = (searchParams.get('type') || 'product') as 'product' | 'variant';

  const [page, setPage] = useState(1);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    quantity: 0,
    changeType: 'adjustment',
    note: '',
  });

  const numericId = Number(id);

  const { logs: productLogs, totalPages: productTotalPages, totalElements: productTotalElements, isLoading: productLoading } =
    useProductInventoryLogs(type === 'product' ? numericId : undefined, { page: page - 1, size: 20 });

  const { logs: variantLogs, totalPages: variantTotalPages, totalElements: variantTotalElements, isLoading: variantLoading } =
    useVariantInventoryLogs(type === 'variant' ? numericId : undefined, { page: page - 1, size: 20 });

  const adjustProductMutation = useAdjustProductStock();
  const adjustVariantMutation = useAdjustVariantStock();

  const isLoading = type === 'product' ? productLoading : variantLoading;
  const logs = type === 'product' ? productLogs : variantLogs;
  const totalPages = type === 'product' ? productTotalPages : variantTotalPages;
  const totalElements = type === 'product' ? productTotalElements : variantTotalElements;

  const openAdjustModal = () => {
    setAdjustForm({ quantity: 0, changeType: 'adjustment', note: '' });
    setIsAdjustModalOpen(true);
  };

  const handleAdjust = async () => {
    if (!numericId || adjustForm.quantity <= 0) return;

    try {
      if (type === 'product') {
        await adjustProductMutation.mutateAsync({
          productId: numericId,
          quantity: adjustForm.quantity,
          changeType: adjustForm.changeType,
          note: adjustForm.note || undefined,
        });
      } else {
        await adjustVariantMutation.mutateAsync({
          variantId: numericId,
          quantity: adjustForm.quantity,
          changeType: adjustForm.changeType,
          note: adjustForm.note || undefined,
        });
      }
      setIsAdjustModalOpen(false);
    } catch {
      // handled in hook
    }
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Thời gian',
      render: (item: InventoryLog) => (
        <span className="text-sm text-accent-600">
          {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '-'}
        </span>
      ),
      className: 'w-48',
    },
    {
      key: 'changeType',
      label: 'Loại thay đổi',
      render: (item: InventoryLog) => (
        <span className={`px-2 py-1 text-xs rounded-full ${changeTypeColors[item.changeType] || 'bg-gray-100 text-gray-700'}`}>
          {changeTypeLabels[item.changeType] || item.changeType}
        </span>
      ),
      className: 'w-36',
    },
    {
      key: 'quantityChange',
      label: 'Số lượng thay đổi',
      render: (item: InventoryLog) => (
        <span className={`font-medium ${item.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {item.quantityChange > 0 ? '+' : ''}{item.quantityChange}
        </span>
      ),
      className: 'w-40',
    },
    {
      key: 'quantity',
      label: 'Số lượng',
      render: (item: InventoryLog) => (
        <span className="text-sm">
          {item.previousQuantity ?? '-'} → {item.newQuantity ?? '-'}
        </span>
      ),
      className: 'w-40',
    },
    {
      key: 'note',
      label: 'Ghi chú',
      render: (item: InventoryLog) => (
        <span className="text-sm text-accent-600 line-clamp-1">
          {item.note || '-'}
        </span>
      ),
    },
    {
      key: 'createdBy',
      label: 'Người thực hiện',
      render: (item: InventoryLog) => (
        <span className="text-sm">{item.createdBy || '-'}</span>
      ),
      className: 'w-40',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-accent-500 mb-1">
            <Link to="/admin/products" className="hover:text-primary">Sản phẩm</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Nhật ký tồn kho</span>
          </div>
          <h1 className="text-2xl font-bold text-accent-900">Nhật ký tồn kho</h1>
          <p className="text-accent-500 mt-1">
            Theo dõi lịch sử nhập/xuất/điều chỉnh tồn kho ({totalElements} bản ghi)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={openAdjustModal}>
            Cập nhật tồn kho
          </Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="bg-white rounded-xl shadow-card p-4 flex gap-4">
        <button
          onClick={() => setSearchParams({ type: 'product' })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            type === 'product' ? 'bg-primary text-white' : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
          }`}
        >
          Theo sản phẩm
        </button>
        <button
          onClick={() => setSearchParams({ type: 'variant' })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            type === 'variant' ? 'bg-primary text-white' : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
          }`}
        >
          Theo biến thể
        </button>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={logs || []}
        loading={isLoading}
        emptyText="Không có nhật ký tồn kho"
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

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title={`Cập nhật tồn kho ${type === 'product' ? 'sản phẩm' : 'biến thể'}`}
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsAdjustModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleAdjust}
              isLoading={adjustProductMutation.isPending || adjustVariantMutation.isPending}
            >
              Cập nhật
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">
              Loại thay đổi
            </label>
            <select
              value={adjustForm.changeType}
              onChange={(e) => setAdjustForm({ ...adjustForm, changeType: e.target.value })}
              className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="adjustment">Điều chỉnh</option>
              <option value="restock">Nhập kho</option>
              <option value="return_restock">Hoàn kho</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">
              Số lượng {adjustForm.changeType === 'restock' || adjustForm.changeType === 'return_restock' ? 'nhập vào' : 'thay đổi'}
            </label>
            <Input
              type="number"
              min={1}
              value={adjustForm.quantity}
              onChange={(e) => setAdjustForm({ ...adjustForm, quantity: Number(e.target.value) })}
              placeholder="Nhập số lượng"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">
              Ghi chú
            </label>
            <textarea
              rows={3}
              value={adjustForm.note}
              onChange={(e) => setAdjustForm({ ...adjustForm, note: e.target.value })}
              className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Nhập ghi chú..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
