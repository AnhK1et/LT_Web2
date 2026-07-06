import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Clock } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductListSkeleton } from './ProductCardSkeleton';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui';
import type { Product } from '@/types';

export const FlashSaleSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { data, isLoading } = useProducts({ size: 20 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const products = data?.data?.content?.filter(
    (p: Product) => p.salePrice && p.salePrice < p.price
  ) || [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 260;
      const newPosition =
        direction === 'left'
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-accent-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>
          <ProductListSkeleton count={6} />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-r from-primary to-red-600">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white text-primary p-2 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Flash Sale</h2>
              <p className="text-white/80 text-sm">Giảm giá cực sốc trong ngày</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CountdownTimer />
            <div className="flex gap-1 ml-4">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Slider */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.slice(0, 12).map((product: Product, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[240px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-6">
          <Link
            to="/products?sale=true"
            className="inline-flex items-center gap-2 px-6 py-2 bg-white text-primary font-medium rounded-lg hover:bg-accent-50 transition-colors"
          >
            Xem tất cả Flash Sale
          </Link>
        </div>
      </div>
    </section>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1 text-white">
      <Clock className="w-4 h-4" />
      <div className="flex gap-1">
        <TimeBox value={timeLeft.hours} />
        <span className="text-lg font-bold">:</span>
        <TimeBox value={timeLeft.minutes} />
        <span className="text-lg font-bold">:</span>
        <TimeBox value={timeLeft.seconds} />
      </div>
    </div>
  );
};

const TimeBox = ({ value }: { value: number }) => (
  <span className="bg-white text-primary px-2 py-1 rounded font-bold text-sm min-w-[2rem] text-center">
    {value.toString().padStart(2, '0')}
  </span>
);
