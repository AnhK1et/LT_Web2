import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Star, Minus, Plus, Check, Shield, Truck, RotateCcw } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, calculateDiscount } from '@/utils';
import type { Product, ProductVariant } from '@/types';

interface ProductInfoProps {
  product: Product;
  onAddToCart: (quantity: number, variantId?: number) => Promise<void>;
  onBuyNow: (quantity: number, variantId?: number) => Promise<void>;
}

export const ProductInfo = ({ product, onAddToCart, onBuyNow }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<ProductVariant['id'] | undefined>(
    product.variants?.find((v) => v.isDefault)?.id || product.variants?.[0]?.id
  );
  const [selectedTab, setSelectedTab] = useState<'description' | 'specs'>('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const variants = product.variants || [];
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  const basePrice = product.price;
  const baseSalePrice = product.salePrice;
  const variantAdjustment = selectedVariant?.priceAdjustment || 0;

  const currentPrice = baseSalePrice && baseSalePrice < basePrice ? baseSalePrice : basePrice;
  const displayPrice = currentPrice + (variantAdjustment || 0);

  const hasDiscount = baseSalePrice && baseSalePrice < basePrice;
  const discountPercent = hasDiscount
    ? calculateDiscount(basePrice, baseSalePrice!)
    : 0;

  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 0;

  // Calculate stock: variant stock > product quantity
  const stock = selectedVariant?.stock !== undefined
    ? selectedVariant.stock
    : (product.quantity !== undefined ? product.quantity : 0);
  const isInStock = stock > 0;

  // Calculate total stock from all variants for display
  const totalVariantStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  const totalStock = variants.length > 0 ? totalVariantStock : (product.quantity || 0);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleIncrease = () => {
    if (quantity < stock) setQuantity((q) => q + 1);
  };

  const handleVariantChange = (variantId: ProductVariant['id']) => {
    setSelectedVariantId(variantId);
    setQuantity(1);
  };

  const handleAddToCartClick = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart(quantity, selectedVariantId);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNowClick = async () => {
    setIsBuyingNow(true);
    try {
      await onBuyNow(quantity, selectedVariantId);
    } finally {
      setIsBuyingNow(false);
    }
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
                {formatCurrency(product.price + (variantAdjustment || 0))}
              </span>
              <Badge variant="danger">-{discountPercent}%</Badge>
            </>
          )}
          {!hasDiscount && variantAdjustment ? (
            <span className="text-sm text-accent-500">
              +{formatCurrency(variantAdjustment)} cho dung lượng cao
            </span>
          ) : null}
        </div>
        <p className="text-sm text-accent-500 mt-1">
          Giá đã bao gồm VAT
        </p>
      </div>

      {/* Variant Selector */}
      {(product.variants && product.variants.length > 0) && (
        <div className="space-y-3">
          <div className="font-medium">Dung lượng:</div>
          <div className="flex flex-wrap gap-3">
            {product.variants
              .filter((v) => !v.deletedAt)
              .map((variant) => {
                const isActive = selectedVariantId === variant.id;
                const variantPrice = (baseSalePrice && baseSalePrice < basePrice ? baseSalePrice : basePrice) + (variant.priceAdjustment || 0);
                const vStock = variant.stock || 0;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => handleVariantChange(variant.id)}
                    disabled={vStock <= 0}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? 'border-primary bg-primary/5 text-primary'
                        : vStock <= 0
                          ? 'border-accent-200 text-accent-400 cursor-not-allowed opacity-60'
                          : 'border-accent-200 text-accent-700 hover:border-accent-300'
                    }`}
                  >
                    <span>{variant.capacity}</span>
                    <span className="text-xs text-accent-500">
                      {formatCurrency(variantPrice)}
                    </span>
                    {variant.isDefault && (
                      <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs text-accent-600">
                        Mặc định
                      </span>
                    )}
                    {vStock <= 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                        Hết hàng
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
          {selectedVariant && (
            <div className="flex items-center gap-2 text-sm text-accent-600">
              {(selectedVariant.stock || 0) > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Còn hàng ({selectedVariant.stock} sản phẩm)</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Hết hàng</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Fallback: Show stock info when no variants */}
      {(!product.variants || product.variants.length === 0) && (
        <div className="flex items-center gap-2 text-sm text-accent-600">
          {(product.quantity || 0) > 0 ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Còn hàng ({product.quantity} sản phẩm)</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Hết hàng</span>
            </>
          )}
        </div>
      )}

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
      <div className="space-y-3">
        {isInStock ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              leftIcon={<ShoppingCart className="w-5 h-5" />}
              onClick={handleAddToCartClick}
              isLoading={isAddingToCart}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              size="lg"
              className="flex-1"
              leftIcon={<Zap className="w-5 h-5" />}
              onClick={handleBuyNowClick}
              isLoading={isBuyingNow}
            >
              Mua ngay
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Sản phẩm hiện đang hết hàng</span>
            </div>
            <Button
              size="lg"
              className="w-full"
              leftIcon={<Zap className="w-5 h-5" />}
              onClick={handleBuyNowClick}
              isLoading={isBuyingNow}
            >
              Đặt hàng trước
            </Button>
          </div>
        )}
      </div>

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
