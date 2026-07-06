import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminTable, Modal, ConfirmDialog } from '@/components/admin';
import { Button, Input } from '@/components/ui';
import {
  useAdminBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from '@/hooks/useAdmin';
import type { Brand } from '@/types';

interface BrandFormData {
  name: string;
  slug: string;
  description: string;
  active: string;
  logo?: FileList;
}

const defaultFormValues: BrandFormData = {
  name: '',
  slug: '',
  description: '',
  active: 'true',
};

export default function AdminBrandsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const { brands, isLoading } = useAdminBrands();
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();
  const deleteMutation = useDeleteBrand();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BrandFormData>({
    defaultValues: defaultFormValues,
  });

  const openCreateModal = () => {
    setSelectedBrand(null);
    reset(defaultFormValues);
    setIsModalOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand);
    reset({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      active: brand.active !== false ? 'true' : 'false',
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: BrandFormData) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      if (data.description) formData.append('description', data.description);
      formData.append('active', data.active);
      if (data.logo?.[0]) formData.append('logo', data.logo[0]);

      if (selectedBrand) {
        await updateMutation.mutateAsync({ id: selectedBrand.id, data: formData });
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
    if (selectedBrand) {
      await deleteMutation.mutateAsync(selectedBrand.id);
      setIsDeleteDialogOpen(false);
      setSelectedBrand(null);
    }
  };

  const columns = [
    {
      key: 'logo',
      label: 'Logo',
      render: (item: Brand) => (
        item.logo ? (
          <img
            src={item.logo}
            alt={item.name}
            className="w-12 h-12 rounded-lg object-contain bg-white border"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-accent-400">{item.name.charAt(0)}</span>
          </div>
        )
      ),
      className: 'w-16',
    },
    {
      key: 'name',
      label: 'Tên thương hiệu',
      render: (item: Brand) => (
        <div>
          <p className="font-medium text-accent-900">{item.name}</p>
          <p className="text-xs text-accent-500">/{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Mô tả',
      render: (item: Brand) => (
        <span className="text-sm text-accent-600 line-clamp-1">
          {item.description || '-'}
        </span>
      ),
    },
    {
      key: 'productCount',
      label: 'Số sản phẩm',
      render: (item: Brand) => item.productCount || 0,
      className: 'text-center',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (item: Brand) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            item.active !== false
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {item.active !== false ? 'Hoạt động' : 'Không hoạt động'}
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
            <h1 className="text-2xl font-bold text-accent-900">Thương hiệu</h1>
            <p className="text-accent-500 mt-1">Quản lý thương hiệu sản phẩm</p>
          </div>
          <Button onClick={openCreateModal}>+ Thêm thương hiệu</Button>
        </div>

        {/* Table */}
        <AdminTable
          columns={columns}
          data={brands}
          loading={isLoading}
          emptyText="Không có thương hiệu nào"
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Tên thương hiệu *"
            {...register('name', { required: 'Tên thương hiệu là bắt buộc' })}
            error={errors.name?.message}
          />

          <Input
            label="Slug *"
            {...register('slug', { required: 'Slug là bắt buộc' })}
            error={errors.slug?.message}
          />

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Mô tả</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Nhập mô tả thương hiệu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Logo</label>
            <input
              type="file"
              accept="image/*"
              {...register('logo')}
              className="w-full text-sm text-accent-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Trạng thái</label>
            <select
              {...register('active')}
              className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {selectedBrand ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xóa thương hiệu"
        message={`Bạn có chắc muốn xóa thương hiệu "${selectedBrand?.name}"?`}
        confirmText="Xóa"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
