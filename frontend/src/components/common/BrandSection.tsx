import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActiveBrands } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui';

export const BrandSection = () => {
  const { data: brands, isLoading } = useActiveBrands();
  const brandList = Array.isArray(brands) ? brands : [];

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-accent-900 mb-6">Thương hiệu nổi bật</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brandList.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-accent-900">Thương hiệu nổi bật</h2>
          <Link
            to="/brands"
            className="text-primary hover:text-primary-700 font-medium transition-colors"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brandList.slice(0, 12).map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                to={`/products?brand=${brand.slug}`}
                className="group block bg-accent-50 rounded-xl p-4 hover:bg-primary transition-colors duration-300"
              >
                <div className="aspect-video flex items-center justify-center mb-2">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain group-hover:brightness-0 group-hover:invert transition-all"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-accent-300 group-hover:text-white transition-colors">
                      {brand.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="text-center font-medium text-sm text-accent-700 group-hover:text-white transition-colors truncate">
                  {brand.name}
                </h3>
                {brand.productCount !== undefined && (
                  <p className="text-center text-xs text-accent-500 group-hover:text-white/80 mt-1 transition-colors">
                    {brand.productCount} sản phẩm
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
