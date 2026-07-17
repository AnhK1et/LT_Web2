import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, calculateDiscount, getImageUrl } from '@/utils';
import { Checkbox } from '@/components/ui';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isSelected: boolean;
  onSelectChange: (itemId: number) => void;
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  isSelected,
  onSelectChange,
}: CartItemProps) => {
  const product = item.product;
  if (!product) return null;

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const displayPrice = hasDiscount ? product.salePrice : product.price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.price, product.salePrice!)
    : 0;
  const subtotal = (displayPrice || 0) * item.quantity;
  const stock = product.stock ?? product.quantity ?? 0;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < stock) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white rounded-xl shadow-card p-4 hover:shadow-card-hover transition-shadow"
    >
      <div className="flex gap-4">
        {/* Checkbox */}
        <div className="flex items-start pt-2">
          <Checkbox
            checked={isSelected}
            onChange={() => onSelectChange(item.id)}
          />
        </div>

        {/* Image */}
        <Link
          to={`/products/${product.slug}`}
          className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-accent-50 rounded-lg overflow-hidden"
        >
          <img
            src={getImageUrl(product.thumbnail)}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${product.slug}`}
            className="font-medium text-accent-900 hover:text-primary transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-primary text-white text-xs rounded">
              -{discountPercent}%
            </span>
          )}

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {formatCurrency(displayPrice || 0)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-accent-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="mt-3 flex items-center justify-between">
            {/* Quantity Selector */}
            <div className="flex items-center border border-accent-200 rounded-lg">
              <button
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-accent-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 sm:w-12 text-center font-medium">{item.quantity}</span>
              <button
                onClick={handleIncrease}
                disabled={item.quantity >= stock}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-accent-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="text-sm text-accent-500">Thành tiền:</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(subtotal)}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 text-accent-400 hover:text-red-500 transition-colors"
              title="Xóa sản phẩm"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
