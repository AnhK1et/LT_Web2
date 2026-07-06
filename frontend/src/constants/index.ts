export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCT_DETAIL: '/products/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  USER_ORDERS: '/orders',
  USER_PROFILE: '/profile',
  USER_PASSWORD: '/change-password',
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    BRANDS: '/admin/brands',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
  },
} as const;

export const ORDER_STATUS = {
  pending: { label: 'Chờ xác nhận', color: 'warning' },
  confirmed: { label: 'Đã xác nhận', color: 'info' },
  processing: { label: 'Đang xử lý', color: 'info' },
  shipping: { label: 'Đang giao', color: 'primary' },
  delivered: { label: 'Đã giao', color: 'success' },
  cancelled: { label: 'Đã hủy', color: 'danger' },
  returned: { label: 'Trả hàng', color: 'danger' },
} as const;

export const PAYMENT_STATUS = {
  pending: { label: 'Chờ thanh toán', color: 'warning' },
  paid: { label: 'Đã thanh toán', color: 'success' },
  failed: { label: 'Thanh toán thất bại', color: 'danger' },
  refunded: { label: 'Đã hoàn tiền', color: 'info' },
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;
