import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Star } from 'lucide-react';
import { formatCurrency, calculateDiscount } from '@/utils';
import { Badge, Skeleton } from '@/components/ui';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.price, product.salePrice!)
    : 0;
  const displayPrice = hasDiscount ? product.salePrice : product.price;
  const isNew = product.isNew;
  const rating = product.rating || 4.5;
  const soldCount = product.soldCount || Math.floor(Math.random() * 500) + 50;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-xl shadow-card hover:shadow-card-hover overflow-hidden"
    >
      {/* Image Container */}
      <Link to={`/products/${product.slug}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-accent-50">
          <img
            src={product.thumbnail || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <Badge variant="danger" className="bg-primary text-white">
              -{discountPercent}%
            </Badge>
          )}
          {isNew && (
            <Badge variant="info" className="bg-blue-500 text-white">
              Mới
            </Badge>
          )}
        </div>

        {/* Flash Sale Badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2">
            <div className="bg-gradient-to-r from-primary to-red-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
              <Zap className="w-3 h-3" />
              FLASH
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-medium text-accent-900 line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">
            {formatCurrency(displayPrice!)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-accent-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Rating & Sold */}
        <div className="mt-2 flex items-center gap-3 text-sm text-accent-500">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <span>Đã bán {soldCount}</span>
        </div>

        {/* Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(product);
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-accent-100 text-accent-700 rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Giỏ hàng</span>
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="flex items-center justify-center py-2 px-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Mua ngay
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
