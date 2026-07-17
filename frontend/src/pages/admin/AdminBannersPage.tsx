import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Edit2, Trash2, Eye, EyeOff, 
  ChevronLeft, ChevronRight, X, Upload, Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/api/axios';
import { getImageUrl } from '@/utils';
import { Button, Input } from '@/components/ui';
import type { Banner, BannerFormData } from '@/types';

const LINK_TYPES = [
  { value: 'NONE', label: 'Không liên kết' },
  { value: 'PRODUCT', label: 'Sản phẩm' },
  { value: 'CATEGORY', label: 'Danh mục' },
  { value: 'BRAND', label: 'Thương hiệu' },
  { value: 'URL', label: 'URL tùy chỉnh' },
];

const AdminBannersPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: '',
    linkType: 'NONE',
    targetId: undefined,
    displayOrder: 0,
    active: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners', page],
    queryFn: async () => {
      const response = await api.get(`/banners?page=${page}&size=10`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formDataSubmit: FormData) => {
      const response = await api.post('/banners', formDataSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData: formDataSubmit }: { id: number; form: FormData }) => {
      const response = await api.post(`/banners/${id}`, formDataSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch(`/banners/${id}/toggle-status`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });

  const openCreateModal = () => {
    setEditingBanner(null);
    setSelectedImage(null);
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      link: '',
      linkType: 'NONE',
      targetId: undefined,
      displayOrder: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setSelectedImage(null);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl,
      link: banner.link || '',
      linkType: banner.linkType || 'NONE',
      targetId: banner.targetId,
      displayOrder: banner.displayOrder,
      active: banner.active || banner.status === 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setSelectedImage(null);
  };

  const buildFormData = (): FormData => {
    const fd = new FormData();
    fd.append('title', formData.title);
    if (formData.subtitle) fd.append('subtitle', formData.subtitle);
    if (selectedImage) {
      fd.append('image', selectedImage);
    }
    if (formData.link) fd.append('link', formData.link);
    if (formData.linkType) fd.append('linkType', formData.linkType);
    if (formData.targetId) fd.append('targetId', String(formData.targetId));
    fd.append('displayOrder', String(formData.displayOrder || 0));
    fd.append('active', String(formData.active));
    return fd;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = buildFormData();
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, form: fd });
    } else {
      createMutation.mutate(fd);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa banner này?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-accent-900">Quản lý Banner</h1>
          <p className="text-accent-500 mt-1">Quản lý các banner hiển thị trên trang chủ</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Thêm Banner
        </Button>
      </div>

      {/* Banner Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
              <div className="aspect-video bg-accent-100 rounded-lg mb-4" />
              <div className="h-4 bg-accent-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-accent-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.content?.map((banner: Banner) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="relative aspect-video bg-accent-100">
                  <img
                    src={getImageUrl(banner.imageUrl)}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => toggleStatusMutation.mutate(banner.id)}
                      className={`p-2 rounded-lg ${
                        banner.status === 'ACTIVE'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {banner.status === 'ACTIVE' ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(banner)}
                      className="p-2 bg-blue-500 text-white rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 bg-red-500 text-white rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span
                    className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                      banner.status === 'ACTIVE'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {banner.status === 'ACTIVE' ? 'Hoạt động' : 'Tắt'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-accent-900 truncate">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-sm text-accent-500 mt-1 truncate">{banner.subtitle}</p>
                  )}
                  <div className="flex items-center justify-between mt-3 text-xs text-accent-400">
                    <span>Thứ tự: {banner.displayOrder}</span>
                    <span>{LINK_TYPES.find(l => l.value === banner.linkType)?.label || 'Không liên kết'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {(!data?.content || data.content.length === 0) && (
            <div className="text-center py-12 text-accent-400">
              <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Chưa có banner nào. Nhấn "Thêm Banner" để tạo mới.</p>
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-4 py-2 text-sm text-accent-600">
                Trang {page + 1} / {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-accent-900">
                  {editingBanner ? 'Sửa Banner' : 'Thêm Banner Mới'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-accent-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-accent-700 mb-2">
                    Hình ảnh {editingBanner ? '(Để trống nếu không thay đổi)' : '*'}
                  </label>
                  <div className="border-2 border-dashed border-accent-300 rounded-xl p-4">
                    {(selectedImage || formData.imageUrl) ? (
                      <div className="relative">
                        <img
                          src={selectedImage ? URL.createObjectURL(selectedImage) : getImageUrl(formData.imageUrl)}
                          alt="Preview"
                          className="w-full h-48 object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setFormData(prev => ({ ...prev, imageUrl: '' }));
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                        <Upload className="w-12 h-12 text-accent-400 mb-2" />
                        <span className="text-accent-500">Click để tải lên hình ảnh</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {!selectedImage && !formData.imageUrl && (
                    <label className="mt-2 flex items-center gap-2 text-sm text-primary cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Chọn file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-accent-700 mb-2">
                    Tiêu đề *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề banner"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-accent-700 mb-2">
                    Phụ đề
                  </label>
                  <Input
                    value={formData.subtitle}
                    onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Nhập phụ đề (tùy chọn)"
                  />
                </div>

                {/* Link Type */}
                <div>
                  <label className="block text-sm font-medium text-accent-700 mb-2">
                    Loại liên kết
                  </label>
                  <select
                    value={formData.linkType}
                    onChange={e => setFormData(prev => ({ ...prev, linkType: e.target.value }))}
                    className="w-full px-4 py-2 border border-accent-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {LINK_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Link URL */}
                {formData.linkType === 'URL' && (
                  <div>
                    <label className="block text-sm font-medium text-accent-700 mb-2">
                      URL liên kết
                    </label>
                    <Input
                      value={formData.link}
                      onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-medium text-accent-700 mb-2">
                    Thứ tự hiển thị
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={e => setFormData(prev => ({ 
                      ...prev, 
                      displayOrder: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={e => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-5 h-5 text-primary rounded border-accent-300 focus:ring-primary"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-accent-700">
                    Banner hoạt động
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Đang lưu...'
                      : editingBanner
                      ? 'Cập nhật'
                      : 'Tạo mới'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBannersPage;
