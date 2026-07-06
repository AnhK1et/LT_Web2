import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { useActiveBrands } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui';

export default function BrandsPage() {
  const navigate = useNavigate();
  const { data: brands, isLoading } = useActiveBrands();
  const brandList = Array.isArray(brands) ? brands : [];

  return (
    <div className="min-h-screen bg-accent-50 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Thương hiệu</h1>
          <p className="text-white/80">Khám phá các thương hiệu nổi tiếng</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brandList.map((brand, index) => (
              <motion.button
                key={brand.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => navigate(`/products?brand=${brand.id}`)}
                className="bg-white rounded-xl p-6 text-center hover:shadow-card hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 bg-accent-50 rounded-xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-3xl font-bold text-accent-300">{brand.name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="font-bold text-accent-900 mb-1">{brand.name}</h3>
                {brand.productCount !== undefined && (
                  <p className="text-sm text-accent-500">{brand.productCount} sản phẩm</p>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {brandList.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-accent-500">Không có thương hiệu nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
