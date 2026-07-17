import api from './axios';
import type { ApiResponse } from '@/types';

export interface VnpayCreateRequest {
  orderId: number;
  amount: number;
  orderInfo?: string;
}

export interface VnpayPaymentResponse {
  success: boolean;
  message: string;
  orderId?: number;
  orderCode?: string;
  transactionId?: string;
  amount?: string;
  paymentStatus?: string;
}

export const paymentApi = {
  createVnpayPayment: (data: VnpayCreateRequest) =>
    api.post<ApiResponse<{ paymentUrl: string }>>('/payment/vnpay/create', data),

  getVnpayReturn: (params: Record<string, string>) =>
    api.get<ApiResponse<VnpayPaymentResponse>>('/payment/vnpay/return', { params }),
};
