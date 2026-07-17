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
    queryKey: ['admin-products', params?.page ?? 0, params?.size ?? 10, params?.keyword, params?.categoryId, params?.brandId],
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
      const response = await adminApi.updateCategory(id, data as CategoryParams);
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
    mutationFn: async (formData: FormData) => {
      const response = await adminApi.createBrand(formData);
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
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
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
    queryKey: ['admin-orders', params?.page ?? 0, params?.size ?? 10, params?.status] as const,
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
    queryKey: ['admin-users', params?.page ?? 0, params?.size ?? 10, params?.keyword, params?.role] as const,
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
    queryKey: ['admin-dashboard'] as const,
    queryFn: async () => {
      const response = await adminApi.getDashboard();
      return response.data.data; // Return DashboardStats directly
    },
    retry: 1,
  });

  return {
    stats: data,
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
    queryKey: ['admin-revenue-monthly'] as const,
    queryFn: async () => {
      const response = await adminApi.getMonthlyRevenue();
      return response.data.data; // Return RevenueData directly
    },
    retry: 1,
  });

  return {
    revenue: data,
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
    queryKey: ['admin-revenue-daily', days] as const,
    queryFn: async () => {
      const response = await adminApi.getDailyRevenue(days);
      return response.data.data; // Return RevenueData directly
    },
    retry: 1,
  });

  return {
    revenue: data,
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
    queryKey: ['admin-top-products', limit] as const,
    queryFn: async () => {
      const response = await adminApi.getTopProducts(limit);
      return response.data.data; // Return TopProduct[] directly
    },
    retry: 1,
  });

  return {
    products: data || [],
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
    queryKey: ['admin-low-stock', threshold, limit] as const,
    queryFn: async () => {
      const response = await adminApi.getLowStock(threshold, limit);
      return response.data.data; // Return LowStockProduct[] directly
    },
    retry: 1,
  });

  return {
    products: data || [],
    isLoading,
    error,
    refetch,
  };
};

// Inventory logs
export const useProductInventoryLogs = (productId?: number, params?: { page?: number; size?: number }) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-product-inventory-logs', productId, params?.page ?? 0, params?.size ?? 10] as const,
    queryFn: async () => {
      if (!productId) return null;
      const response = await adminApi.getProductInventoryLogs(productId, params);
      return response.data;
    },
    enabled: !!productId,
  });

  return {
    logs: data?.content || [],
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || 0,
    isLoading,
    error,
  };
};

export const useVariantInventoryLogs = (variantId?: number, params?: { page?: number; size?: number }) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-variant-inventory-logs', variantId, params?.page ?? 0, params?.size ?? 10] as const,
    queryFn: async () => {
      if (!variantId) return null;
      const response = await adminApi.getVariantInventoryLogs(variantId, params);
      return response.data;
    },
    enabled: !!variantId,
  });

  return {
    logs: data?.content || [],
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || 0,
    isLoading,
    error,
  };
};

// Inventory actions
export const useAdjustProductStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity, changeType, note }: { productId: number; quantity: number; changeType: string; note?: string }) => {
      const response = await adminApi.adjustProductStock(productId, { quantity, changeType, note });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product-inventory-logs'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      Swal.fire({ icon: 'success', title: 'Cập nhật tồn kho thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};

export const useAdjustVariantStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ variantId, quantity, changeType, note }: { variantId: number; quantity: number; changeType: string; note?: string }) => {
      const response = await adminApi.adjustVariantStock(variantId, { quantity, changeType, note });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-variant-inventory-logs'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      Swal.fire({ icon: 'success', title: 'Cập nhật tồn kho thành công!', timer: 2000, showConfirmButton: false });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
    },
  });
};
