export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: number[];
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  address?: string;
  role: {
    id: number;
    name: string;
    slug: string;
  };
  status: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock?: number;
  quantity?: number;
  soldCount?: number;
  viewCount?: number;
  thumbnail?: string;
  images?: string[];
  category?: Category;
  brand?: Brand;
  status?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: Category;
  children?: Category[];
  productCount?: number;
  status?: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  productCount?: number;
  status?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderCode: string;
  userId?: number;
  userEmail?: string;
  userName?: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity?: string;
  receiverDistrict?: string;
  note?: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalPrice: number;
  paymentMethodName: string;
  paymentMethodCode?: string;
  paymentStatus: string;
  orderStatus: string;
  cancelledReason?: string;
  deliveredAt?: string;
  items?: OrderDetail[];
  createdAt: string;
  updatedAt?: string;
}

export interface OrderDetail {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  productImage?: string;
  price: number;
  quantity: number;
  discountAmount: number;
  subtotal: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  instructions?: string;
  isActive: boolean;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: {
    status: string;
    count: number;
  }[];
  topProducts: TopProduct[];
  lowStockProducts: LowStockProduct[];
}

export interface TopProduct {
  id: number;
  name: string;
  sku: string;
  thumbnail: string;
  price: number;
  soldCount: number;
  orderCount: number;
  revenue: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  sku: string;
  quantity: number;
}

export interface RevenueData {
  total: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  orderCount: number;
  byPeriod: {
    period: string;
    revenue: number;
    orderCount: number;
  }[];
}
