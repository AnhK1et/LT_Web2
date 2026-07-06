import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActiveCategories } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui';

const categoryIcons: Record<string, string> = {
  smartphone: '📱',
  laptop: '💻',
  tablet: '📲',
  accessory: '🎧',
  smartwatch: '⌚',
  camera: '📷',
  tivi: '📺',
  default: '🏷️',
};

export const CategorySection = () => {
  const { data: categories, isLoading } = useActiveCategories();
  const categoryList = Array.isArray(categories) ? categories : [];

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-accent-50 rounded-xl p-4 animate-pulse">
                <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categoryList.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-accent-900">Danh mục sản phẩm</h2>
          <Link
            to="/categories"
            className="text-primary hover:text-primary-700 font-medium transition-colors"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categoryList.slice(0, 12).map((category, index) => {
            const icon = categoryIcons[category.slug] || categoryIcons.default;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/products?category=${category.slug}`}
                  className="group flex flex-col items-center p-4 bg-accent-50 rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {icon}
                  </span>
                  <h3 className="font-medium text-center text-sm text-accent-700 group-hover:text-white transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  {category.productCount !== undefined && (
                    <span className="text-xs text-accent-500 group-hover:text-white/80 mt-1 transition-colors">
                      {category.productCount} sản phẩm
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
