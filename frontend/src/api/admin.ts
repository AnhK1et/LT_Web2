import api from './axios';
import type { ApiResponse, PageResponse, Product, Category, Brand, Order, User, DashboardStats } from '@/types';
import type { ProductQueryParams as AdminProductQueryParams } from './endpoints';

export interface CategoryParams {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
}

export interface BrandParams {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
}

export type { ProductQueryParams as AdminProductQueryParams } from './endpoints';

export interface UserQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
  role?: string;
  status?: string;
}

export interface UpdateStatusRequest {
  status: string;
}

export interface AdminUpdateOrderStatusRequest {
  status: string;
  note?: string;
}

export const adminApi = {
  // Products
  getProducts: (params?: AdminProductQueryParams) =>
    api.get<ApiResponse<PageResponse<Product>>>('/admin/products', { params }),

  getProduct: (id: number) =>
    api.get<ApiResponse<Product>>(`/admin/products/${id}`),

  createProduct: (data: FormData) =>
    api.post<ApiResponse<Product>>('/admin/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateProduct: (id: number, data: FormData) =>
    api.put<ApiResponse<Product>>(`/admin/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteProduct: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/products/${id}`),

  // Categories
  getCategories: (params?: { page?: number; size?: number; keyword?: string }) =>
    api.get<ApiResponse<PageResponse<Category>>>('/admin/categories', { params }),

  getCategory: (id: number) =>
    api.get<ApiResponse<Category>>(`/admin/categories/${id}`),

  createCategory: (data: CategoryParams) =>
    api.post<ApiResponse<Category>>('/admin/categories', data),

  updateCategory: (id: number, data: Partial<CategoryParams>) =>
    api.put<ApiResponse<Category>>(`/admin/categories/${id}`, data),

  deleteCategory: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/categories/${id}`),

  // Brands
  getBrands: (params?: { page?: number; size?: number; keyword?: string }) =>
    api.get<ApiResponse<PageResponse<Brand>>>('/admin/brands', { params }),

  getBrand: (id: number) =>
    api.get<ApiResponse<Brand>>(`/admin/brands/${id}`),

  createBrand: (data: BrandParams) =>
    api.post<ApiResponse<Brand>>('/admin/brands', data),

  updateBrand: (id: number, data: Partial<BrandParams>) =>
    api.put<ApiResponse<Brand>>(`/admin/brands/${id}`, data),

  deleteBrand: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/brands/${id}`),

  // Orders
  getOrders: (params?: { page?: number; size?: number; status?: string }) =>
    api.get<ApiResponse<PageResponse<Order>>>('/admin/orders', { params }),

  getOrder: (id: number) =>
    api.get<ApiResponse<Order>>(`/admin/orders/${id}`),

  updateOrderStatus: (id: number, data: AdminUpdateOrderStatusRequest) =>
    api.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, data),

  // Users
  getUsers: (params?: UserQueryParams) =>
    api.get<ApiResponse<PageResponse<User>>>('/admin/users', { params }),

  getUser: (id: number) =>
    api.get<ApiResponse<User>>(`/admin/users/${id}`),

  updateUserStatus: (id: number, data: UpdateStatusRequest) =>
    api.put<ApiResponse<User>>(`/admin/users/${id}/status`, data),

  // Dashboard
  getDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/admin/dashboard'),

  getMonthlyRevenue: () =>
    api.get('/admin/dashboard/revenue/monthly'),

  getDailyRevenue: (days = 30) =>
    api.get('/admin/dashboard/revenue/daily', { params: { days } }),

  getTopProducts: (limit = 10) =>
    api.get('/admin/dashboard/top-products', { params: { limit } }),

  getLowStock: (threshold = 10, limit = 20) =>
    api.get('/admin/dashboard/low-stock', { params: { threshold, limit } }),
};
