import api from './axios';
import type { ApiResponse, Cart } from '@/types';

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  variantId?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartCheckoutRequest {
  receiverName: string;
  phone: string;
  address: string;
  city?: string;
  district?: string;
  paymentMethodCode: string;
  note?: string;
}

export const cartApi = {
  getCart: () =>
    api.get<ApiResponse<Cart>>('/cart'),

  addItem: (data: AddToCartRequest) =>
    api.post<ApiResponse<Cart>>('/cart/items', data),

  updateItem: (itemId: number, data: UpdateCartItemRequest) =>
    api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, data),

  removeItem: (itemId: number) =>
    api.delete<ApiResponse<void>>(`/cart/items/${itemId}`),

  clearCart: () =>
    api.delete<ApiResponse<void>>('/cart/clear'),

  checkout: (data: CartCheckoutRequest) =>
    api.post<ApiResponse<{ orderId: number; orderCode: string }>>('/checkout', data),
};
