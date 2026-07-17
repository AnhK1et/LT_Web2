import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi, brandApi } from '@/api';
import type { ProductQueryParams } from '@/api/endpoints';

export const useProducts = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: ['products', params.page ?? 0, params.size ?? 12, params.categoryId, params.brandId, params.keyword, params.sortBy, params.sortOrder],
    queryFn: async () => {
      const { data } = await productApi.getAll(params);
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
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
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product-slug', slug],
    queryFn: async () => {
      const { data } = await productApi.getBySlug(slug);
      return data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'] as const,
    queryFn: async () => {
      const { data } = await productApi.getFeatured();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useNewProducts = () => {
  return useQuery({
    queryKey: ['new-products'] as const,
    queryFn: async () => {
      const { data } = await productApi.getNew();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useBestSellingProducts = (limit = 10) => {
  return useQuery({
    queryKey: ['best-selling-products', limit],
    queryFn: async () => {
      const { data } = await productApi.getBestSelling(limit);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'] as const,
    queryFn: async () => {
      const response = await categoryApi.getAll();
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useActiveCategories = () => {
  return useQuery({
    queryKey: ['active-categories'] as const,
    queryFn: async () => {
      const response = await categoryApi.getActive();
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
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
    staleTime: 1000 * 60 * 5,
  });
};

// Brands
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'] as const,
    queryFn: async () => {
      const response = await brandApi.getAll();
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useActiveBrands = () => {
  return useQuery({
    queryKey: ['active-brands'] as const,
    queryFn: async () => {
      const response = await brandApi.getActive();
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 5,
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
    staleTime: 1000 * 60 * 5,
  });
};

// Search suggestions
export const useSearchSuggestions = (keyword: string) => {
  return useQuery({
    queryKey: ['search-suggestions', keyword],
    queryFn: async () => {
      if (!keyword || keyword.trim().length < 2) return [];
      const { data } = await productApi.search(keyword, { size: 8 });
      return data.data?.content || [];
    },
    enabled: keyword.trim().length >= 2,
    staleTime: 1000 * 30,
  });
};
