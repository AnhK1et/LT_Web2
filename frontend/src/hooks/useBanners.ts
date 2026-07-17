import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import type { Banner, BannerFormData, PageResponse } from '@/types';

const BANNER_KEY = ['banners'];

export const useBanners = (page = 0, size = 10) => {
  return useQuery({
    queryKey: [...BANNER_KEY, 'list', page, size],
    queryFn: async () => {
      const response = await api.get<PageResponse<Banner>>(`/banners?page=${page}&size=${size}`);
      return response.data;
    },
  });
};

export const useActiveBanners = () => {
  return useQuery({
    queryKey: [...BANNER_KEY, 'active'],
    queryFn: async () => {
      const response = await api.get<Banner[]>(`/banners/active`);
      return response.data;
    },
  });
};

export const useBanner = (id: number) => {
  return useQuery({
    queryKey: [...BANNER_KEY, id],
    queryFn: async () => {
      const response = await api.get<Banner>(`/banners/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BannerFormData) => {
      const response = await api.post<Banner>('/banners', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_KEY });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BannerFormData }) => {
      const response = await api.put<Banner>(`/banners/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: BANNER_KEY });
      queryClient.invalidateQueries({ queryKey: [...BANNER_KEY, id] });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_KEY });
    },
  });
};

export const useToggleBannerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<Banner>(`/banners/${id}/toggle-status`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_KEY });
    },
  });
};
