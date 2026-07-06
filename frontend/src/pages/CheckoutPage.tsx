import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckoutForm, OrderSummary, SuccessDialog } from '@/components/common';
import { Breadcrumb } from '@/components/ui';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/store';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  
  const {
    items,
    selectedItems,
    totals,
    isLoading,
    isCheckingOut,
    checkout,
    refetch,
  } = useCart();

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderData, setOrderData] = useState<{ orderId?: number; orderCode?: string } | null>(null);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // If coming from cart, select all items if none selected
  useEffect(() => {
    if (location.state?.from === 'cart' && selectedItems.length === 0 && items.length > 0) {
      // Select all items for checkout
    }
  }, [location.state, selectedItems.length, items.length]);

  // Filter selected items
  const selectedCartItems = items.filter((item) => selectedItems.includes(item.id));
  const hasItemsToCheckout = selectedCartItems.length > 0;

  const handleCheckoutSubmit = async (data: {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    note: string;
    paymentMethod: string;
  }) => {
    if (!hasItemsToCheckout) {
      Swal.fire({
        icon: 'warning',
        title: 'Không có sản phẩm',
        text: 'Vui lòng chọn sản phẩm để thanh toán',
      });
      return;
    }

    try {
      const result = await checkout({
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,
        note: data.note,
        paymentMethod: data.paymentMethod,
      });

      // Refresh cart
      await refetch();

      // Show success dialog
      const responseData = result as { data?: { orderId?: number; orderCode?: string } };
      setOrderData({
        orderId: responseData.data?.orderId,
        orderCode: responseData.data?.orderCode,
      });
      setShowSuccess(true);

    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({
        icon: 'error',
        title: 'Đặt hàng thất bại',
        text: err.response?.data?.message || 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#D70018',
      });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setOrderData(null);
    navigate('/');
  };

  if (!hasItemsToCheckout && !isLoading) {
    return (
      <div className="min-h-screen bg-accent-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-accent-900 mb-4">Không có sản phẩm để thanh toán</h2>
          <p className="text-accent-500 mb-6">Vui lòng thêm sản phẩm vào giỏ hàng</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent-50 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Thanh toán</h1>
          <Breadcrumb
            items={[
              { label: 'Giỏ hàng', href: '/cart' },
              { label: 'Thanh toán' },
            ]}
            className="text-white/80 [&_a]:text-white/80 [&_span]:text-white"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <CheckoutForm
              onSubmit={handleCheckoutSubmit}
              isLoading={isCheckingOut}
            />
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-96"
          >
            <OrderSummary
              items={selectedCartItems}
              subtotal={totals.subtotal}
              shipping={totals.shipping}
              discount={totals.discount}
              total={totals.total}
            />
          </motion.div>
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        orderCode={orderData?.orderCode || ''}
        orderId={orderData?.orderId}
      />
    </div>
  );
}
