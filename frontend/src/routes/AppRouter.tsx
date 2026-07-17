import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserLayout } from '@/components/layout';
import { AdminLayout } from '@/components/admin';
import { NotFound } from '@/components/ui';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

// User Pages - Lazy loaded
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const OAuthCallbackPage = lazy(() => import('@/pages/OAuthCallbackPage'));
const ProductListPage = lazy(() => import('@/pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderListPage = lazy(() => import('@/pages/OrderListPage'));
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const NewsPage = lazy(() => import('@/pages/NewsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PromotionsPage = lazy(() => import('@/pages/PromotionsPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const BrandsPage = lazy(() => import('@/pages/BrandsPage'));
const PaymentReturnPage = lazy(() => import('@/pages/PaymentReturnPage'));

// Admin Pages - Lazy loaded
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));
const AdminBrandsPage = lazy(() => import('@/pages/admin/AdminBrandsPage'));
const AdminBannersPage = lazy(() => import('@/pages/admin/AdminBannersPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminInventoryLogsPage = lazy(() => import('@/pages/admin/AdminInventoryLogsPage'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-accent-500">Đang tải...</p>
    </div>
  </div>
);

export const AppRouter = () => (
  <Routes>
    {/* User Routes */}
    <Route path="/" element={<UserLayout />}>
      <Route index element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
      <Route path="login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
      <Route path="register" element={<Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>} />
      <Route path="oauth/callback" element={<Suspense fallback={<PageLoader />}><OAuthCallbackPage /></Suspense>} />
      <Route path="products" element={<Suspense fallback={<PageLoader />}><ProductListPage /></Suspense>} />
      <Route path="products/:slug" element={<Suspense fallback={<PageLoader />}><ProductDetailPage /></Suspense>} />
      <Route path="cart" element={<ProtectedRoute requiredRole="USER"><Suspense fallback={<PageLoader />}><CartPage /></Suspense></ProtectedRoute>} />
      <Route path="checkout" element={<ProtectedRoute requiredRole="USER"><Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense></ProtectedRoute>} />
      <Route path="orders" element={<ProtectedRoute requiredRole="USER"><Suspense fallback={<PageLoader />}><OrderListPage /></Suspense></ProtectedRoute>} />
      <Route path="orders/:id" element={<ProtectedRoute requiredRole="USER"><Suspense fallback={<PageLoader />}><OrderDetailPage /></Suspense></ProtectedRoute>} />
      <Route path="profile" element={<ProtectedRoute requiredRole="USER"><Suspense fallback={<PageLoader />}><UserProfilePage /></Suspense></ProtectedRoute>} />
      <Route path="about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
      <Route path="news" element={<Suspense fallback={<PageLoader />}><NewsPage /></Suspense>} />
      <Route path="contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
      <Route path="promotions" element={<Suspense fallback={<PageLoader />}><PromotionsPage /></Suspense>} />
      <Route path="categories" element={<Suspense fallback={<PageLoader />}><CategoriesPage /></Suspense>} />
      <Route path="brands" element={<Suspense fallback={<PageLoader />}><BrandsPage /></Suspense>} />
      <Route path="payment/return" element={<PaymentReturnPage />} />
    </Route>

    {/* Admin Routes */}
    <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
      <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense>} />
      <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProductsPage /></Suspense>} />
      <Route path="categories" element={<Suspense fallback={<PageLoader />}><AdminCategoriesPage /></Suspense>} />
      <Route path="brands" element={<Suspense fallback={<PageLoader />}><AdminBrandsPage /></Suspense>} />
      <Route path="banners" element={<Suspense fallback={<PageLoader />}><AdminBannersPage /></Suspense>} />
      <Route path="orders" element={<Suspense fallback={<PageLoader />}><AdminOrdersPage /></Suspense>} />
      <Route path="orders/:id" element={<Suspense fallback={<PageLoader />}><AdminOrdersPage /></Suspense>} />
      <Route path="users" element={<Suspense fallback={<PageLoader />}><AdminUsersPage /></Suspense>} />
      <Route path="inventory/:id" element={<Suspense fallback={<PageLoader />}><AdminInventoryLogsPage /></Suspense>} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
