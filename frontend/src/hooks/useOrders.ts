import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/api';
import { useAuthStore } from '@/store';
import Swal from 'sweetalert2';
import type { Order } from '@/types';

export const useOrders = (params?: { status?: string; page?: number; size?: number }) => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(params?.status);

  // Fetch orders
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['orders', params?.page ?? 0, params?.size ?? 10, params?.status],
    queryFn: async () => {
      const response = await orderApi.getUserOrders(params);
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const orders: Order[] = ordersData?.data?.content || [];
  const totalPages = ordersData?.data?.totalPages || 1;
  const totalElements = ordersData?.data?.totalElements || 0;

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: number; reason?: string }) => {
      const response = await orderApi.cancelOrder(orderId, { reason: reason || 'Khách hàng yêu cầu hủy' });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      Swal.fire({
        icon: 'success',
        title: 'Hủy đơn hàng thành công!',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({
        icon: 'error',
        title: 'Hủy đơn hàng thất bại',
        text: err.response?.data?.message || 'Vui lòng thử lại',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#D70018',
      });
    },
  });

  const cancelOrder = useCallback(
    async (orderId: number, reason?: string) => {
      const result = await Swal.fire({
        title: 'Xác nhận hủy đơn hàng',
        text: 'Bạn có chắc muốn hủy đơn hàng này? Hành động này không thể hoàn tác.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hủy đơn',
        cancelButtonText: 'Không',
        confirmButtonColor: '#D70018',
        input: 'text',
        inputPlaceholder: 'Lý do hủy (tùy chọn)',
        inputValidator: (value) => {
          // Just allow empty or any text
          return null;
        },
      });

      if (result.isConfirmed) {
        await cancelOrderMutation.mutateAsync({ orderId, reason: result.value });
      }
    },
    [cancelOrderMutation]
  );

  return {
    // Data
    orders,
    totalPages,
    totalElements,
    statusFilter,
    
    // Loading states
    isLoading,
    isCancelling: cancelOrderMutation.isPending,
    error,
    
    // Actions
    cancelOrder,
    refetch,
    setStatusFilter,
  };
};

// Hook for single order detail
export const useOrderDetail = (orderId: number | undefined) => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    data: orderData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['order', orderId] as const,
    queryFn: async () => {
      const response = await orderApi.getUserOrderById(orderId!);
      return response.data;
    },
    enabled: isAuthenticated && !!orderId,
    staleTime: 1000 * 60,
  });

  const order: Order | null = orderData?.data || null;

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (reason?: string) => {
      const response = await orderApi.cancelOrder(orderId!, { reason: reason || 'Khách hàng yêu cầu hủy' });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      Swal.fire({
        icon: 'success',
        title: 'Hủy đơn hàng thành công!',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({
        icon: 'error',
        title: 'Hủy đơn hàng thất bại',
        text: err.response?.data?.message || 'Vui lòng thử lại',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#D70018',
      });
    },
  });

  const cancelOrder = useCallback(
    async (reason?: string) => {
      const result = await Swal.fire({
        title: 'Xác nhận hủy đơn hàng',
        text: 'Bạn có chắc muốn hủy đơn hàng này? Hành động này không thể hoàn tác.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hủy đơn',
        cancelButtonText: 'Không',
        confirmButtonColor: '#D70018',
        input: 'text',
        inputPlaceholder: 'Lý do hủy (tùy chọn)',
      });

      if (result.isConfirmed) {
        await cancelOrderMutation.mutateAsync(result.value);
      }
    },
    [cancelOrderMutation]
  );

  // Check if order can be cancelled
  const canCancel = order?.orderStatus === 'PENDING';

  return {
    order,
    isLoading,
    isCancelling: cancelOrderMutation.isPending,
    error,
    cancelOrder,
    canCancel,
    refetch,
  };
};
