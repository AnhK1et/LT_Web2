import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { EmptyState } from '@/components/ui';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
}

export const ProductGrid = ({ products, isLoading, viewMode }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        : 'space-y-4'
      }>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="product"
        title="Không tìm thấy sản phẩm"
        description="Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác"
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductListCard product={product} />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

// List view card
const ProductListCard = ({ product }: { product: Product }) => {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const displayPrice = hasDiscount ? product.salePrice : product.price;

  return (
    <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover overflow-hidden transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 aspect-square sm:aspect-auto bg-accent-50 flex-shrink-0">
          <img
            src={product.thumbnail || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-medium text-accent-900 hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
              }).format(displayPrice!)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-accent-400 line-through">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-accent-500 line-clamp-2 flex-1">
            {product.shortDescription || product.description?.slice(0, 150)}
          </p>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 px-4 bg-accent-100 text-accent-700 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
              Thêm vào giỏ
            </button>
            <button className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
