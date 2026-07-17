import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { paymentApi } from '@/api/payment';
import Swal from 'sweetalert2';

export default function PaymentReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refetch } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    handlePaymentReturn();
  }, []);

  const handlePaymentReturn = async () => {
    try {
      // Get response code from URL params
      const responseCode = searchParams.get('vnp_ResponseCode');
      const transactionStatus = searchParams.get('vnp_TransactionStatus');
      const orderCode = searchParams.get('vnp_OrderInfo');

      // If success
      if (responseCode === '00' && transactionStatus === '00') {
        setStatus('success');
        
        // Refresh cart
        await refetch();
        
        // Show success message and redirect
        Swal.fire({
          icon: 'success',
          title: 'Thanh toán thành công!',
          text: 'Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.',
          confirmButtonText: 'Xem đơn hàng',
          confirmButtonColor: '#D70018',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/orders');
          } else {
            navigate('/');
          }
        });
      } else {
        setStatus('failed');
        
        Swal.fire({
          icon: 'error',
          title: 'Thanh toán thất bại',
          text: getErrorMessage(responseCode),
          confirmButtonText: 'Quay lại',
          confirmButtonColor: '#D70018',
        }).then(() => {
          navigate('/checkout');
        });
      }
    } catch (error) {
      setStatus('failed');
      console.error('Payment return error:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: 'Vui lòng kiểm tra lại trạng thái đơn hàng.',
        confirmButtonText: 'Quay lại trang chủ',
        confirmButtonColor: '#D70018',
      }).then(() => {
        navigate('/');
      });
    }
  };

  const getErrorMessage = (code: string | null) => {
    const messages: Record<string, string> = {
      '01': 'Giao dịch chưa hoàn tất.',
      '02': 'Giao dịch bị từ chối.',
      '04': 'Giao dịch đã bị hủy.',
      '05': 'Giao dịch thất bại.',
      '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking.',
      '10': 'Xác thực khách hàng thất bại.',
      '11': 'Đã hết hạn chờ thanh toán.',
      '12': 'Thẻ/Tài khoản bị khóa.',
      '13': 'Nhập sai mật khẩu xác thực giao dịch OTP.',
      '24': 'Khách hàng hủy giao dịch.',
      '51': 'Tài khoản không đủ số dư.',
      '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.',
      '81': 'Sai mã OTP.',
    };
    return messages[code || ''] || 'Đã xảy ra lỗi không xác định.';
  };

  return (
    <div className="min-h-screen bg-accent-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-card p-8 max-w-md w-full mx-4 text-center"
      >
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-accent-900 mb-2">
              Đang xử lý thanh toán...
            </h2>
            <p className="text-accent-500">
              Vui lòng đợi trong giây lát
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-accent-900 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-accent-500">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-accent-900 mb-2">
              Thanh toán thất bại
            </h2>
            <p className="text-accent-500">
              Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
