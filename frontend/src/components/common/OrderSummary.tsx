import { Link } from 'react-router-dom';
import { formatCurrency, getImageUrl } from '@/utils';
import type { CartItem } from '@/types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export const OrderSummary = ({
  items,
  subtotal,
  shipping,
  discount,
  total,
}: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
      <h2 className="text-lg font-bold text-accent-900 mb-4">Đơn hàng của bạn</h2>

      {/* Items List */}
      <div className="max-h-64 overflow-y-auto space-y-3 mb-4 pb-4 border-b border-accent-100">
        {items.map((item) => {
          const product = item.product;
          if (!product) return null;

          const hasDiscount = product.salePrice && product.salePrice < product.price;
          const displayPrice = hasDiscount ? product.salePrice : product.price;
          const itemSubtotal = (displayPrice || 0) * item.quantity;

          return (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 bg-accent-50 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={getImageUrl(product.thumbnail)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${product.slug}`}
                  className="text-sm font-medium text-accent-900 hover:text-primary transition-colors line-clamp-2"
                >
                  {product.name}
                </Link>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-accent-500">x{item.quantity}</span>
                  <span className="text-sm font-bold text-primary">
                    {formatCurrency(itemSubtotal)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-accent-600">Tạm tính</span>
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
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-accent-100">
        <span className="text-lg font-bold text-accent-900">Tổng cộng</span>
        <span className="text-2xl font-bold text-primary">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
};
