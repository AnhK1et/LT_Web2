import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api';
import type { CategoryParams, BrandParams } from '@/api/admin';
import Swal from 'sweetalert2';
import type { Product, Category, Brand, Order, User } from '@/types';

// Products
export const useAdminProducts = (params?: {
  page?: number;
  size?: number;
  keyword?: string;
  categoryId?: number;
  brandId?: number;
}) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-products', params],
    queryFn: async () => {
      const response = await adminApi.getProducts(params);
      return response.data;
    },
  });

  return {
    products: data?.data?.content || [],
    totalPages: data?.data?.totalPages || 1,
    totalElements: data?.data?.totalElements || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useAdminProduct = (id?: number) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const response = await adminApi.getProduct(id!);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    product: data?.data,
    isLoading,
    error,
  };
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await adminApi.createProduct(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      Swal.fire({ icon: 'success', title: 'Thêm sản phẩm thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await adminApi.updateProduct(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await adminApi.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      Swal.fire({ icon: 'success', title: 'Xóa thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

// Categories
export const useAdminCategories = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await adminApi.getCategories();
      return response.data;
    },
  });

  const categories = Array.isArray(data?.data) ? data?.data : (data?.data?.content || []);

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Category>) => {
      const response = await adminApi.createCategory(data as CategoryParams);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      Swal.fire({ icon: 'success', title: 'Thêm danh mục thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Category> }) => {
      const response = await adminApi.updateCategory(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await adminApi.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      Swal.fire({ icon: 'success', title: 'Xóa thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

// Brands
export const useAdminBrands = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: async () => {
      const response = await adminApi.getBrands();
      return response.data;
    },
  });

  const brands = Array.isArray(data?.data) ? data?.data : (data?.data?.content || []);

  return {
    brands,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Brand>) => {
      const response = await adminApi.createBrand(data as BrandParams);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      Swal.fire({ icon: 'success', title: 'Thêm thương hiệu thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Brand> }) => {
      const response = await adminApi.updateBrand(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await adminApi.deleteBrand(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      Swal.fire({ icon: 'success', title: 'Xóa thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

// Orders
export const useAdminOrders = (params?: { page?: number; size?: number; status?: string }) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-orders', params],
    queryFn: async () => {
      const response = await adminApi.getOrders(params);
      return response.data;
    },
  });

  return {
    orders: data?.data?.content || [],
    totalPages: data?.data?.totalPages || 1,
    totalElements: data?.data?.totalElements || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useAdminOrder = (id?: number) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const response = await adminApi.getOrder(id!);
      return response.data;
    },
    enabled: !!id,
  });

  return {
    order: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await adminApi.updateOrderStatus(id, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
      Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

// Users
export const useAdminUsers = (params?: { page?: number; size?: number; keyword?: string; role?: string }) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-users', params],
    queryFn: async () => {
      const response = await adminApi.getUsers(params);
      return response.data;
    },
  });

  return {
    users: data?.data?.content || [],
    totalPages: data?.data?.totalPages || 1,
    totalElements: data?.data?.totalElements || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await adminApi.updateUserStatus(id, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

// Dashboard
export const useAdminDashboard = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      console.log('[Dashboard Hook] Calling API...');
      try {
        const response = await adminApi.getDashboard();
        console.log('[Dashboard Hook] Response received:', response.data);
        return response.data;
      } catch (err: unknown) {
        console.error('[Dashboard Hook] API Error:', err);
        throw err;
      }
    },
    retry: 1,
  });

  console.log('[Dashboard Hook] Current state:', { data, isLoading, error });

  return {
    stats: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useAdminMonthlyRevenue = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-revenue-monthly'],
    queryFn: async () => {
      try {
        const response = await adminApi.getMonthlyRevenue();
        console.log('[Monthly Revenue API] Response:', response.data);
        return response.data;
      } catch (err: unknown) {
        console.error('[Monthly Revenue API] Error:', err);
        throw err;
      }
    },
    retry: 1,
  });

  return {
    revenue: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useAdminDailyRevenue = (days = 30) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-revenue-daily', days],
    queryFn: async () => {
      try {
        const response = await adminApi.getDailyRevenue(days);
        console.log('[Daily Revenue API] Response:', response.data);
        return response.data;
      } catch (err: unknown) {
        console.error('[Daily Revenue API] Error:', err);
        throw err;
      }
    },
    retry: 1,
  });

  return {
    revenue: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useAdminTopProducts = (limit = 10) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-top-products', limit],
    queryFn: async () => {
      try {
        const response = await adminApi.getTopProducts(limit);
        console.log('[Top Products API] Response:', response.data);
        return response.data;
      } catch (err: unknown) {
        console.error('[Top Products API] Error:', err);
        throw err;
      }
    },
    retry: 1,
  });

  return {
    products: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useAdminLowStock = (threshold = 10, limit = 20) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-low-stock', threshold, limit],
    queryFn: async () => {
      try {
        const response = await adminApi.getLowStock(threshold, limit);
        console.log('[Low Stock API] Response:', response.data);
        return response.data;
      } catch (err: unknown) {
        console.error('[Low Stock API] Error:', err);
        throw err;
      }
    },
    retry: 1,
  });

  return {
    products: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};
