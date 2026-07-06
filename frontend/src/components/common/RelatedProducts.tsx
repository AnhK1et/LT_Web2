import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { ProductListSkeleton } from './ProductCardSkeleton';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';

interface RelatedProductsProps {
  categoryId?: number;
  currentProductId?: number;
}

export const RelatedProducts = ({ categoryId, currentProductId }: RelatedProductsProps) => {
  const { data, isLoading } = useProducts({ 
    categoryId,
    size: 8 
  });

  const products = (data?.data?.content || []).filter(
    (p: Product) => p.id !== currentProductId
  );

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-accent-900 mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductListSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-accent-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-accent-900">Sản phẩm liên quan</h2>
          <Link
            to={categoryId ? `/products?categoryId=${categoryId}` : '/products'}
            className="text-primary hover:text-primary-700 font-medium transition-colors"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product, index) => (
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
      </div>
    </section>
  );
};
