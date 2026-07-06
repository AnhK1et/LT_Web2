import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productApi } from '@/api';
import { useAuthStore } from '@/store';
import { ProductGallery, ProductInfo, RelatedProducts } from '@/components/common';
import { Breadcrumb, Skeleton } from '@/components/ui';
import Swal from 'sweetalert2';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', 'slug', slug],
    queryFn: async () => {
      const response = await productApi.getBySlug(slug!);
      return response.data;
    },
    enabled: !!slug,
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

  const handleAddToCart = (quantity: number) => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng đăng nhập',
        text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng',
        confirmButtonText: 'Đăng nhập',
        confirmButtonColor: '#D70018',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    // TODO: Implement add to cart
    Swal.fire({
      icon: 'success',
      title: 'Thêm vào giỏ hàng thành công!',
      text: `Đã thêm ${quantity} sản phẩm vào giỏ hàng`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handleBuyNow = (quantity: number) => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng đăng nhập',
        text: 'Bạn cần đăng nhập để mua hàng',
        confirmButtonText: 'Đăng nhập',
        confirmButtonColor: '#D70018',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    // TODO: Add to cart and navigate to checkout
    navigate('/checkout');
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-accent-900 mb-4">Không tìm thấy sản phẩm</h1>
          <button
            onClick={() => navigate('/products')}
            className="text-primary hover:underline"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-accent-50 border-b border-accent-100">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { label: 'Sản phẩm', href: '/products' },
              ...(product.category
                ? [{ label: product.category.name, href: `/products?categoryId=${product.category.id}` }]
                : []),
              { label: product.name },
            ]}
          />
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
            <ProductGallery images={images as string[]} productName={product.name} />
          </div>

          {/* Info */}
          <div>
            <ProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
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
