import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminTable, Modal, ConfirmDialog } from '@/components/admin';
import { Button, Input } from '@/components/ui';
import {
  useAdminProducts,
  useAdminCategories,
  useAdminBrands,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useAdmin';
import { formatCurrency } from '@/utils';
import type { Product } from '@/types';

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  categoryId?: number;
  brandId?: number;
  isFeatured: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  thumbnail?: FileList;
  images?: FileList;
}

const defaultFormValues: ProductFormData = {
  name: '',
  sku: '',
  description: '',
  price: 0,
  salePrice: undefined,
  stock: 0,
  categoryId: undefined,
  brandId: undefined,
  isFeatured: false,
  status: 'active',
};

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [brandFilter, setBrandFilter] = useState<number | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { products, totalPages, totalElements, isLoading, refetch } = useAdminProducts({
    page: page - 1,
    size: 10,
    keyword: searchKeyword,
    categoryId: categoryFilter,
    brandId: brandFilter,
  });

  const { categories } = useAdminCategories();
  const { brands } = useAdminBrands();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: defaultFormValues,
  });

  const isFeatured = watch('isFeatured');

  const openCreateModal = () => {
    setSelectedProduct(null);
    reset(defaultFormValues);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    reset({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock || 0,
      categoryId: product.category?.id,
      brandId: product.brand?.id,
      isFeatured: product.isFeatured || false,
      status: (product.status as ProductFormData['status']) || 'active',
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('sku', data.sku);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    if (data.salePrice) formData.append('salePrice', String(data.salePrice));
    formData.append('stock', String(data.stock));
    if (data.categoryId) formData.append('categoryId', String(data.categoryId));
    if (data.brandId) formData.append('brandId', String(data.brandId));
    formData.append('isFeatured', String(data.isFeatured));
    formData.append('status', (data.status || 'ACTIVE').toLowerCase());
    if (data.thumbnail?.[0]) formData.append('thumbnail', data.thumbnail[0]);
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      if (selectedProduct) {
        await updateMutation.mutateAsync({ id: selectedProduct.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
      reset();
    } catch {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      await deleteMutation.mutateAsync(selectedProduct.id);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const columns = [
    {
      key: 'thumbnail',
      label: 'Ảnh',
      render: (item: Product) => (
        <img
          src={item.thumbnail || '/placeholder.png'}
          alt={item.name}
          className="w-12 h-12 rounded-lg object-cover bg-accent-50"
        />
      ),
      className: 'w-16',
    },
    {
      key: 'name',
      label: 'Tên sản phẩm',
      render: (item: Product) => (
        <div>
          <p className="font-medium text-accent-900">{item.name}</p>
          <p className="text-xs text-accent-500">SKU: {item.sku}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Danh mục',
      render: (item: Product) => (item as any).categoryName || item.category?.name || '-',
    },
    {
      key: 'brand',
      label: 'Thương hiệu',
      render: (item: Product) => (item as any).brandName || item.brand?.name || '-',
    },
    {
      key: 'price',
      label: 'Giá',
      render: (item: Product) => (
        <div>
          <p className="font-bold text-primary">{formatCurrency(item.salePrice || item.price)}</p>
          {item.salePrice && item.salePrice < item.price && (
            <p className="text-xs text-accent-400 line-through">{formatCurrency(item.price)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Tồn kho',
      render: (item: Product) => (
        <span className={item.stock === 0 ? 'text-red-500 font-medium' : ''}>
          {item.stock || 0}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (item: Product) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            item.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {item.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-accent-900">Sản phẩm</h1>
            <p className="text-accent-500 mt-1">Quản lý sản phẩm ({totalElements} sản phẩm)</p>
          </div>
          <Button onClick={openCreateModal}>+ Thêm sản phẩm</Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-card p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-accent-700 mb-1">Tìm kiếm</label>
              <Input
                placeholder="Tìm theo tên hoặc SKU..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-accent-700 mb-1">Danh mục</label>
              <select
                value={categoryFilter || ''}
                onChange={(e) => {
                  setCategoryFilter(e.target.value ? Number(e.target.value) : undefined);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-accent-700 mb-1">Thương hiệu</label>
              <select
                value={brandFilter || ''}
                onChange={(e) => {
                  setBrandFilter(e.target.value ? Number(e.target.value) : undefined);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setSearchKeyword('');
                  setCategoryFilter(undefined);
                  setBrandFilter(undefined);
                  setPage(1);
                }}
                className="whitespace-nowrap"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <AdminTable
          columns={columns}
          data={products}
          loading={isLoading}
          emptyText="Không có sản phẩm nào"
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tên sản phẩm *"
              {...register('name', { required: 'Tên sản phẩm là bắt buộc' })}
              error={errors.name?.message}
            />
            <Input
              label="SKU *"
              {...register('sku', { required: 'SKU là bắt buộc' })}
              error={errors.sku?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Giá *"
              type="number"
              {...register('price', { required: 'Giá là bắt buộc', min: 0 })}
              error={errors.price?.message}
            />
            <Input
              label="Giá giảm"
              type="number"
              {...register('salePrice', { min: 0 })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Số lượng tồn kho *"
              type="number"
              {...register('stock', { required: 'Số lượng là bắt buộc', min: 0 })}
              error={errors.stock?.message}
            />
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-1">Danh mục</label>
              <select
                {...register('categoryId')}
                className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-1">Thương hiệu</label>
              <select
                {...register('brandId')}
                className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Trạng thái</label>
            <select
              {...register('status')}
              className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
          </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Mô tả</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="isFeatured"
              {...register('isFeatured')}
              className="w-4 h-4 text-primary rounded border-accent-300 focus:ring-primary"
            />
            <label htmlFor="isFeatured" className="text-sm text-accent-700">
              Sản phẩm nổi bật
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-1">Ảnh đại diện</label>
              <input
                type="file"
                accept="image/*"
                {...register('thumbnail')}
                className="w-full text-sm text-accent-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-1">Ảnh sản phẩm</label>
              <input
                type="file"
                accept="image/*"
                multiple
                {...register('images')}
                className="w-full text-sm text-accent-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {selectedProduct ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa sản phẩm "${selectedProduct?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
