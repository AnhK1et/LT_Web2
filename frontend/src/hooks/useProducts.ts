import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, categoryApi, brandApi } from '@/api';
import type { ProductQueryParams, CategoryQueryParams, BrandQueryParams } from '@/api/endpoints';

// Products
export const useProducts = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await productApi.getAll(params);
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await productApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', 'slug', slug],
    queryFn: async () => {
      const { data } = await productApi.getBySlug(slug);
      return data;
    },
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await productApi.getFeatured();
      return data;
    },
  });
};

export const useNewProducts = () => {
  return useQuery({
    queryKey: ['products', 'new'],
    queryFn: async () => {
      const { data } = await productApi.getNew();
      return data;
    },
  });
};

export const useBestSellingProducts = (limit = 10) => {
  return useQuery({
    queryKey: ['products', 'best-selling', limit],
    queryFn: async () => {
      const { data } = await productApi.getBestSelling(limit);
      return data;
    },
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryApi.getAll();
      // API returns ApiResponse<Category[]>, so response.data is ApiResponse<Category[]>
      // response.data.data is Category[]
      return response.data.data || [];
    },
  });
};

export const useActiveCategories = () => {
  return useQuery({
    queryKey: ['categories', 'active'],
    queryFn: async () => {
      const response = await categoryApi.getActive();
      return response.data.data || [];
    },
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data } = await categoryApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
};

// Brands
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await brandApi.getAll();
      return response.data.data || [];
    },
  });
};

export const useActiveBrands = () => {
  return useQuery({
    queryKey: ['brands', 'active'],
    queryFn: async () => {
      const response = await brandApi.getActive();
      return response.data.data || [];
    },
  });
};

export const useBrand = (id: number) => {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: async () => {
      const { data } = await brandApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
};
