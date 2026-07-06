import { Link } from 'react-router-dom';
import { Truck, Shield, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/ui';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export const CartSummary = ({
  subtotal,
  shipping,
  discount,
  total,
  itemCount,
  onCheckout,
  isLoading,
}: CartSummaryProps) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
      <h2 className="text-lg font-bold text-accent-900 mb-4">Tóm tắt đơn hàng</h2>

      {/* Summary */}
      <div className="space-y-3 border-b border-accent-100 pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-accent-600">
            Tạm tính ({itemCount} sản phẩm)
          </span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-accent-600">Phí vận chuyển</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Miễn phí</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-accent-600">Giảm giá</span>
            <span className="font-medium text-green-600">
              -{formatCurrency(discount)}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-4">
        <span className="text-lg font-bold text-accent-900">Tổng cộng</span>
        <span className="text-2xl font-bold text-primary">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        className="w-full"
        size="lg"
        disabled={itemCount === 0 || isLoading}
        isLoading={isLoading}
      >
        Tiến hành thanh toán
      </Button>

      {/* Benefits */}
      <div className="mt-6 pt-4 border-t border-accent-100 space-y-3">
        <div className="flex items-center gap-2 text-sm text-accent-600">
          <Truck className="w-4 h-4 text-primary" />
          <span>Giao hàng miễn phí cho đơn từ 500.000đ</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-accent-600">
          <Shield className="w-4 h-4 text-primary" />
          <span>Thanh toán an toàn 100%</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-accent-600">
          <RotateCcw className="w-4 h-4 text-primary" />
          <span>Đổi trả trong 7 ngày</span>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="mt-4 text-center">
        <Link
          to="/products"
          className="text-primary hover:text-primary-700 text-sm font-medium"
        >
          ← Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};
