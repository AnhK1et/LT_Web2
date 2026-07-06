import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminTable, Modal, ConfirmDialog } from '@/components/admin';
import { Button, Input } from '@/components/ui';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useAdmin';
import type { Category } from '@/types';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  status: string;
}

const defaultFormValues: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  status: 'ACTIVE',
};

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { categories, isLoading } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: defaultFormValues,
  });

  const nameValue = watch('name');

  // Auto-generate slug from name
  useState(() => {
    if (nameValue && !selectedCategory) {
      const slug = nameValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  });

  const openCreateModal = () => {
    setSelectedCategory(null);
    reset(defaultFormValues);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      status: category.status || 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({ id: selectedCategory.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
      reset();
    } catch {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      await deleteMutation.mutateAsync(selectedCategory.id);
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Ảnh',
      render: (item: Category) => (
        item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-lg object-cover bg-accent-50"
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
      label: 'Tên danh mục',
      render: (item: Category) => (
        <div>
          <p className="font-medium text-accent-900">{item.name}</p>
          <p className="text-xs text-accent-500">/{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Mô tả',
      render: (item: Category) => (
        <span className="text-sm text-accent-600 line-clamp-1">
          {item.description || '-'}
        </span>
      ),
    },
    {
      key: 'productCount',
      label: 'Số sản phẩm',
      render: (item: Category) => item.productCount || 0,
      className: 'text-center',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (item: Category) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            item.status === 'ACTIVE'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {item.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
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
            <h1 className="text-2xl font-bold text-accent-900">Danh mục</h1>
            <p className="text-accent-500 mt-1">Quản lý danh mục sản phẩm</p>
          </div>
          <Button onClick={openCreateModal}>+ Thêm danh mục</Button>
        </div>

        {/* Table */}
        <AdminTable
          columns={columns}
          data={categories}
          loading={isLoading}
          emptyText="Không có danh mục nào"
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Tên danh mục *"
            {...register('name', { required: 'Tên danh mục là bắt buộc' })}
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
              placeholder="Nhập mô tả danh mục"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Trạng thái</label>
            <select
              {...register('status')}
              className="w-full px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {selectedCategory ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${selectedCategory?.name}"?`}
        confirmText="Xóa"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
