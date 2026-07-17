import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productApi } from '@/api';
import { useAuthStore } from '@/store';
import { useCart } from '@/hooks/useCart';
import { ProductGallery, ProductInfo, RelatedProducts } from '@/components/common';
import { Breadcrumb, Skeleton } from '@/components/ui';
import { getImageUrl } from '@/utils';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', 'slug', slug],
    queryFn: async () => {
      const response = await productApi.getBySlug(slug!);
      return response.data;
    },
    enabled: !!slug,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const product = data?.data;

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | AKStore`;
    }
    return () => {
      document.title = 'AKStore - Công nghệ chính hãng';
    };
  }, [product]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    const errMsg = error && typeof error === 'object' && 'response' in error
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : 'Không thể tải sản phẩm. Vui lòng thử lại.';

    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-accent-900 mb-3">Không tìm thấy sản phẩm</h1>
          <p className="text-accent-500 mb-6">{errMsg || 'Sản phẩm có thể đã bị xóa hoặc không tồn tại.'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200 font-medium transition-colors"
            >
              Tải lại
            </button>
            <button
              onClick={() => navigate('/products')}
              className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              Danh sách sản phẩm
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rawImages = product.images || [];
  const imageUrls: string[] = Array.isArray(rawImages) && rawImages.length > 0
    ? rawImages.map((img: unknown) => {
        if (typeof img === 'string') return getImageUrl(img);
        if (img && typeof img === 'object' && 'imageUrl' in img) return getImageUrl((img as { imageUrl: string }).imageUrl);
        return '/placeholder.svg';
      })
    : product.thumbnail
      ? [getImageUrl(product.thumbnail)]
      : ['/placeholder.svg'];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb & Home */}
      <div className="bg-accent-50 border-b border-accent-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-accent-600 hover:text-primary transition-colors"
            >
              Trang chủ
            </button>
            <span className="text-accent-400">/</span>
            <button
              onClick={() => navigate('/products')}
              className="text-accent-600 hover:text-primary transition-colors"
            >
              Sản phẩm
            </button>
            {product.category && (
              <>
                <span className="text-accent-400">/</span>
                <button
                  onClick={() => navigate(`/products?categoryId=${product.category.id}`)}
                  className="text-accent-600 hover:text-primary transition-colors"
                >
                  {product.category.name}
                </button>
              </>
            )}
            <span className="text-accent-400">/</span>
            <span className="text-accent-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <ProductGallery images={imageUrls} productName={product.name} />
          </div>

          {/* Info */}
          <div>
            <ProductInfo
              product={product}
              onAddToCart={async (quantity, variantId) => {
                await addToCart(product.id, quantity, variantId);
              }}
              onBuyNow={async (quantity, variantId) => {
                await addToCart(product.id, quantity, variantId);
                navigate('/checkout', { state: { from: 'buy-now' } });
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Related Products */}
      {product.category && (
        <RelatedProducts
          categoryId={product.category.id}
          currentProductId={product.id}
        />
      )}
    </div>
  );
}

const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-white">
    <div className="bg-accent-50 border-b border-accent-100">
      <div className="container mx-auto px-4 py-3">
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Skeleton className="aspect-square rounded-xl mb-4" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
