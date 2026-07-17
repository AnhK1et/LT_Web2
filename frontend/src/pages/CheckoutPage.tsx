import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckoutForm, OrderSummary, SuccessDialog } from '@/components/common';
import { Breadcrumb } from '@/components/ui';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/store';
import { paymentApi } from '@/api/payment';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  
  const {
    items,
    selectedItems,
    totals,
    isLoading,
    isCheckingOut,
    checkout,
    refetch,
    setSelectedItems,
  } = useCart();

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderData, setOrderData] = useState<{ orderId?: number; orderCode?: string } | null>(null);

  const [isResolvingBuyNow, setIsResolvingBuyNow] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // If coming from cart or buy-now, select all items if none selected
  useEffect(() => {
    if ((location.state?.from === 'cart' || location.state?.from === 'buy-now') && selectedItems.length === 0 && items.length > 0) {
      setSelectedItems(items.map((item) => item.id));
    }
  }, [location.state, selectedItems.length, items.length, setSelectedItems]);

  // Resolve buy-now by refetching cart if needed
  useEffect(() => {
    let cancelled = false;
    const resolveBuyNow = async () => {
      if (location.state?.from !== 'buy-now' || isResolvingBuyNow) return;
      if (items.length > 0 || isLoading) return;

      setIsResolvingBuyNow(true);
      try {
        await refetch();
      } finally {
        if (!cancelled) {
          setIsResolvingBuyNow(false);
        }
      }
    };

    void resolveBuyNow();
    return () => {
      cancelled = true;
    };
  }, [location.state?.from, items.length, isLoading, refetch, isResolvingBuyNow]);

  // Handle VNPAY payment redirect
  const handleVnpayPayment = async (data: {
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
      // First create the order (pending payment)
      const result = await checkout({
        receiverName: data.shippingName,
        phone: data.shippingPhone,
        address: data.shippingAddress,
        note: data.note,
        paymentMethodCode: 'VNPAY',
      });

      // Get orderId from response
      const responseData = result as { data?: { orderId?: number; orderCode?: string } };
      const orderId = responseData.data?.orderId;

      if (!orderId) {
        throw new Error('Không lấy được thông tin đơn hàng');
      }

      // Call VNPAY API to create payment URL
      const vnpayResponse = await paymentApi.createVnpayPayment({
        orderId: orderId,
        amount: totals.total,
        orderInfo: `Thanh toan don hang ${responseData.data?.orderCode}`,
      });

      const paymentUrl = vnpayResponse.data?.data?.paymentUrl;
      
      if (paymentUrl) {
        // Redirect to VNPAY
        window.location.href = paymentUrl;
      } else {
        throw new Error('Không tạo được link thanh toán VNPAY');
      }

    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      Swal.fire({
        icon: 'error',
        title: 'Thanh toán thất bại',
        text: err.response?.data?.message || err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#D70018',
      });
    }
  };

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

    // If VNPAY, handle separately
    if (data.paymentMethod === 'VNPAY') {
      await handleVnpayPayment(data);
      return;
    }

    try {
      const result = await checkout({
        receiverName: data.shippingName,
        phone: data.shippingPhone,
        address: data.shippingAddress,
        note: data.note,
        paymentMethodCode: data.paymentMethod,
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
