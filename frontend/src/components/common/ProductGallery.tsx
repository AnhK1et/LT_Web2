import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  const getInitials = (name: string) => {
    const words = name.split(' ').slice(0, 2);
    return words.map(w => w[0]).join('').toUpperCase();
  };

  const handleImgError = (index: number) => {
    setImgErrors(prev => new Set([...prev, index]));
  };

  const allImages = images.length > 0 ? images : ['/placeholder.svg'];
  const currentImage = allImages[currentIndex];
  const isCurrentError = imgErrors.has(currentIndex);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-accent-50 rounded-xl overflow-hidden cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {isCurrentError ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-100 to-accent-200">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-2xl bg-accent-300 flex items-center justify-center">
                    <span className="text-3xl font-bold text-accent-600">{getInitials(productName)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={currentImage}
                alt={productName}
                className="w-full h-full object-cover"
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        transform: 'scale(2)',
                      }
                    : undefined
                }
                onError={() => handleImgError(currentIndex)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-accent-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-accent-700" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <ZoomIn className="w-4 h-4" />
          <span>{isZoomed ? 'Thu nhỏ' : 'Phóng to'}</span>
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary'
                  : 'border-transparent hover:border-accent-300'
              }`}
            >
              {imgErrors.has(index) ? (
                <div className="w-full h-full flex items-center justify-center bg-accent-100">
                  <span className="text-sm font-bold text-accent-500">{getInitials(productName)}</span>
                </div>
              ) : (
                <img
                  src={image}
                  alt={`${productName} - ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImgError(index)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
