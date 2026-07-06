import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Star, Minus, Plus, Check, Shield, Truck, RotateCcw } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, calculateDiscount } from '@/utils';
import type { Product } from '@/types';

interface ProductInfoProps {
  product: Product;
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
}

export const ProductInfo = ({ product, onAddToCart, onBuyNow }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specs'>('description');
  
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.price, product.salePrice!)
    : 0;
  const displayPrice = hasDiscount ? product.salePrice : product.price;
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 0;
  const stock = product.stock ?? product.quantity ?? 0;
  const isInStock = stock > 0;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleIncrease = () => {
    if (quantity < stock) setQuantity((q) => q + 1);
  };

  return (
    <div className="space-y-6">
      {/* Title & Rating */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {hasDiscount && (
            <Badge variant="danger" className="bg-primary text-white">
              -{discountPercent}%
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="info" className="bg-blue-500 text-white">
              Mới
            </Badge>
          )}
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-accent-900 mb-3">
          {product.name}
        </h1>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-accent-300'
                }`}
              />
            ))}
            <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
            <span className="text-accent-500">({reviewCount} đánh giá)</span>
          </div>
          <span className="text-accent-300">|</span>
          <span className="text-accent-500">SKU: {product.sku}</span>
        </div>
      </div>

      {/* Price */}
      <div className="bg-accent-50 rounded-xl p-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(displayPrice!)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-accent-400 line-through">
                {formatCurrency(product.price)}
              </span>
              <Badge variant="danger">-{discountPercent}%</Badge>
            </>
          )}
        </div>
        <p className="text-sm text-accent-500 mt-1">
          Giá đã bao gồm VAT
        </p>
      </div>

      {/* Category & Brand */}
      <div className="flex flex-wrap gap-4 text-sm">
        {product.category && (
          <Link
            to={`/products?categoryId=${product.category.id}`}
            className="text-primary hover:underline"
          >
            {product.category.name}
          </Link>
        )}
        {product.brand && (
          <>
            <span className="text-accent-300">•</span>
            <Link
              to={`/products?brandId=${product.brand.id}`}
              className="text-primary hover:underline"
            >
              {product.brand.name}
            </Link>
          </>
        )}
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2">
        {isInStock ? (
          <>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium">Còn hàng ({stock} sản phẩm)</span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-600 font-medium">Hết hàng</span>
          </>
        )}
      </div>

      {/* Quantity Selector */}
      {isInStock && (
        <div className="flex items-center gap-4">
          <span className="font-medium">Số lượng:</span>
          <div className="flex items-center border border-accent-200 rounded-lg">
            <button
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center hover:bg-accent-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > 0 && val <= stock) setQuantity(val);
              }}
              className="w-16 h-10 text-center border-x border-accent-200 focus:outline-none"
            />
            <button
              onClick={handleIncrease}
              disabled={quantity >= stock}
              className="w-10 h-10 flex items-center justify-center hover:bg-accent-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isInStock && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            leftIcon={<ShoppingCart className="w-5 h-5" />}
            onClick={() => onAddToCart(quantity)}
          >
            Thêm vào giỏ hàng
          </Button>
          <Button
            size="lg"
            className="flex-1"
            leftIcon={<Zap className="w-5 h-5" />}
            onClick={() => onBuyNow(quantity)}
          >
            Mua ngay
          </Button>
        </div>
      )}

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-accent-100">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-5 h-5 text-primary" />
          <span>Hàng chính hãng 100%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Truck className="w-5 h-5 text-primary" />
          <span>Giao hàng nhanh 24h</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <RotateCcw className="w-5 h-5 text-primary" />
          <span>Đổi trả trong 7 ngày</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-accent-100 pt-6">
        <div className="flex border-b border-accent-200">
          <button
            onClick={() => setSelectedTab('description')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'description'
                ? 'text-primary border-b-2 border-primary'
                : 'text-accent-500 hover:text-accent-700'
            }`}
          >
            Mô tả
          </button>
          <button
            onClick={() => setSelectedTab('specs')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'specs'
                ? 'text-primary border-b-2 border-primary'
                : 'text-accent-500 hover:text-accent-700'
            }`}
          >
            Thông số kỹ thuật
          </button>
        </div>

        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4"
        >
          {selectedTab === 'description' ? (
            <div className="prose prose-sm max-w-none text-accent-700">
              {product.description ? (
                <p className="whitespace-pre-wrap">{product.description}</p>
              ) : product.shortDescription ? (
                <p>{product.shortDescription}</p>
              ) : (
                <p className="text-accent-500 italic">Không có mô tả</p>
              )}
            </div>
          ) : (
            <div className="text-accent-700">
              <p className="text-accent-500 italic">Thông số kỹ thuật đang được cập nhật...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
