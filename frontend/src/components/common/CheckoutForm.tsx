import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store';
import { Input } from '@/components/ui';

interface CheckoutFormData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string;
  paymentMethod: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading?: boolean;
}

export const CheckoutForm = ({ onSubmit, isLoading }: CheckoutFormProps) => {
  const { user } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      shippingName: user?.name || '',
      shippingPhone: user?.phone || '',
      shippingAddress: user?.address || '',
      note: '',
      paymentMethod: 'COD',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-bold text-accent-900 mb-4">Thông tin giao hàng</h2>
        
        <div className="space-y-4">
          <Input
            label="Họ và tên"
            placeholder="Nhập họ và tên người nhận"
            error={errors.shippingName?.message}
            {...register('shippingName', {
              required: 'Họ và tên là bắt buộc',
              minLength: {
                value: 2,
                message: 'Họ và tên phải có ít nhất 2 ký tự',
              },
            })}
          />

          <Input
            label="Số điện thoại"
            type="tel"
            placeholder="Nhập số điện thoại"
            error={errors.shippingPhone?.message}
            {...register('shippingPhone', {
              required: 'Số điện thoại là bắt buộc',
              pattern: {
                value: /^(0[0-9]{9,10})$/,
                message: 'Số điện thoại không hợp lệ',
              },
            })}
          />

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">
              Địa chỉ giao hàng
            </label>
            <textarea
              placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
                errors.shippingAddress
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-accent-200 focus:border-primary'
              }`}
              {...register('shippingAddress', {
                required: 'Địa chỉ là bắt buộc',
                minLength: {
                  value: 10,
                  message: 'Địa chỉ phải có ít nhất 10 ký tự',
                },
              })}
            />
            {errors.shippingAddress && (
              <p className="mt-1 text-sm text-red-500">{errors.shippingAddress.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              placeholder="Ghi chú cho đơn hàng (ví dụ: giao giờ hành chính, gọi trước khi giao...)"
              rows={2}
              className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
              {...register('note')}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-bold text-accent-900 mb-4">Phương thức thanh toán</h2>
        
        <div className="space-y-3">
          <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedPaymentMethod === 'COD' 
              ? 'border-primary bg-primary-50' 
              : 'border-accent-200 hover:border-accent-300'
          }`}>
            <input
              type="radio"
              value="COD"
              {...register('paymentMethod')}
              className="w-5 h-5 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <span className="font-medium text-accent-900">Thanh toán khi nhận hàng (COD)</span>
              <p className="text-sm text-accent-500">Trả tiền mặt khi nhận được hàng</p>
            </div>
          </label>

          <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedPaymentMethod === 'VNPAY' 
              ? 'border-primary bg-primary-50' 
              : 'border-accent-200 hover:border-accent-300'
          }`}>
            <input
              type="radio"
              value="VNPAY"
              {...register('paymentMethod')}
              className="w-5 h-5 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <span className="font-medium text-accent-900">Thanh toán qua VNPay</span>
              <p className="text-sm text-accent-500">Thanh toán trực tuyến an toàn qua cổng VNPay</p>
            </div>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Đang chuyển hướng...</span>
          </>
        ) : (
          selectedPaymentMethod === 'VNPAY' ? 'Tiến hành thanh toán VNPay' : 'Đặt hàng'
        )}
      </button>
    </form>
  );
};
