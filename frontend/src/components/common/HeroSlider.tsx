import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useActiveBanners } from '@/hooks/useBanners';
import { getImageUrl } from '@/utils';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=500&fit=crop',
    title: 'iPhone 16 Pro Max',
    subtitle: 'Siêu phẩm công nghệ đỉnh cao',
    buttonText: 'Mua ngay',
    buttonLink: '/products',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=500&fit=crop',
    title: 'MacBook Pro M3',
    subtitle: 'Hiệu năng vượt trội với chip M3',
    buttonText: 'Khám phá',
    buttonLink: '/products',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&h=500&fit=crop',
    title: 'Samsung Galaxy S24',
    subtitle: 'Trí tuệ nhân tạo trong tầm tay',
    buttonText: 'Xem ngay',
    buttonLink: '/products',
  },
];

const getLinkUrl = (linkType?: string, link?: string) => {
  if (!linkType || linkType === 'NONE' || !link) return '/products';
  
  switch (linkType) {
    case 'PRODUCT':
      return `/products/${link}`;
    case 'CATEGORY':
      return `/products?categoryId=${link}`;
    case 'BRAND':
      return `/products?brandId=${link}`;
    case 'URL':
    default:
      return link || '/products';
  }
};

export const HeroSlider = () => {
  const { data: banners } = useActiveBanners();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [imgError, setImgError] = useState(false);

  const slides: Slide[] = banners && banners.length > 0
    ? banners.map((banner) => ({
        id: banner.id,
        image: getImageUrl(banner.imageUrl),
        title: banner.title,
        subtitle: banner.subtitle || '',
        buttonText: 'Xem ngay',
        buttonLink: getLinkUrl(banner.linkType, banner.link),
      }))
    : defaultSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setImgError(false);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setImgError(false);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setImgError(false);
  };

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, nextSlide]);

  useEffect(() => {
    setImgError(false);
  }, [currentSlide]);

  const currentImage = imgError 
    ? 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&h=400&fit=crop' 
    : slides[currentSlide]?.image;

  return (
    <div 
      className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={currentImage}
            alt={slides[currentSlide]?.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-lg"
              >
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
                  {slides[currentSlide]?.title}
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-white/90 mb-4 md:mb-6">
                  {slides[currentSlide]?.subtitle}
                </p>
                <Link to={slides[currentSlide]?.buttonLink}>
                  <Button size="lg" className="bg-primary hover:bg-primary-700 text-white">
                    {slides[currentSlide]?.buttonText}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-primary w-6 md:w-8'
                    : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
