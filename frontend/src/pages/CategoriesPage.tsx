import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useActiveCategories } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useActiveCategories();
  const categoryList = Array.isArray(categories) ? categories : [];

  return (
    <div className="min-h-screen bg-accent-50 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Danh mục sản phẩm</h1>
          <p className="text-white/80">Khám phá các danh mục sản phẩm</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryList.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/products?category=${category.id}`)}
                className="bg-white rounded-xl p-6 text-center hover:shadow-card hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-accent-900 mb-1">{category.name}</h3>
                {category.productCount !== undefined && (
                  <p className="text-sm text-accent-500">{category.productCount} sản phẩm</p>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {categoryList.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-accent-500">Không có danh mục nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
