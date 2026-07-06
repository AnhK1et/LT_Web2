import api from './axios';
import type { ApiResponse, PageResponse, Order, OrderDetail } from '@/types';

export interface CheckoutRequest {
  receiverName: string;
  phone: string;
  address: string;
  city?: string;
  district?: string;
  paymentMethodId: number;
  note?: string;
}

export interface CancelOrderRequest {
  reason: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
  note?: string;
}

export interface OrderQueryParams {
  page?: number;
  size?: number;
  status?: string;
}

export const orderApi = {
  getUserOrders: (params?: OrderQueryParams) =>
    api.get<ApiResponse<PageResponse<Order>>>('/orders', { params }),
  
  getUserOrderById: (id: number) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`),
  
  cancelOrder: (id: number, data: CancelOrderRequest) =>
    api.put<ApiResponse<Order>>(`/orders/${id}/cancel`, data),
  
  checkout: (data: CheckoutRequest) =>
    api.post<ApiResponse<Order>>('/checkout', data),
  
  // Admin endpoints
  getAllOrders: (params?: OrderQueryParams) =>
    api.get<ApiResponse<PageResponse<Order>>>('/admin/orders', { params }),
  
  getOrderById: (id: number) =>
    api.get<ApiResponse<Order>>(`/admin/orders/${id}`),
  
  updateOrderStatus: (id: number, data: UpdateOrderStatusRequest) =>
    api.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, data),
};
