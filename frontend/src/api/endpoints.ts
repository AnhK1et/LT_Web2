import api from './axios';
import type { ApiResponse, PageResponse, Product, Category, Brand, Cart, CartItem } from '@/types';

export interface ProductQueryParams {
  page?: number;
  size?: number;
  categoryId?: number;
  brandId?: number;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
}

export interface BrandQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
}

export const productApi = {
  getAll: (params: ProductQueryParams) =>
    api.get<ApiResponse<PageResponse<Product>>>('/products', { params }),
  
  getById: (id: number) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),
  
  getBySlug: (slug: string) =>
    api.get<ApiResponse<Product>>(`/products/slug/${slug}`),
  
  getFeatured: () =>
    api.get<ApiResponse<Product[]>>('/products/featured'),
  
  getNew: () =>
    api.get<ApiResponse<Product[]>>('/products/new'),
  
  getBestSelling: (limit?: number) =>
    api.get<ApiResponse<Product[]>>('/products/best-selling', { 
      params: { limit } 
    }),
  
  search: (keyword: string, params?: ProductQueryParams) =>
    api.get<ApiResponse<PageResponse<Product>>>('/products/search', {
      params: { keyword, ...params },
    }),
};

export const categoryApi = {
  getAll: () =>
    api.get<ApiResponse<Category[]>>('/categories'),
  
  getActive: () =>
    api.get<ApiResponse<Category[]>>('/categories/active'),
  
  getById: (id: number) =>
    api.get<ApiResponse<Category>>(`/categories/${id}`),
  
  getBySlug: (slug: string) =>
    api.get<ApiResponse<Category>>(`/categories/slug/${slug}`),
  
  getAllPaged: (params: CategoryQueryParams) =>
    api.get<ApiResponse<PageResponse<Category>>>('/categories', { params }),
};

export const brandApi = {
  getAll: () =>
    api.get<ApiResponse<Brand[]>>('/brands'),
  
  getActive: () =>
    api.get<ApiResponse<Brand[]>>('/brands/active'),
  
  getById: (id: number) =>
    api.get<ApiResponse<Brand>>(`/brands/${id}`),
  
  getBySlug: (slug: string) =>
    api.get<ApiResponse<Brand>>(`/brands/slug/${slug}`),
  
  getAllPaged: (params: BrandQueryParams) =>
    api.get<ApiResponse<PageResponse<Brand>>>('/brands', { params }),
};
