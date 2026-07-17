import { useState } from 'react';
import { cn } from '@/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export function ProductImage({ src, alt, className, fallbackText }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    const displayText = fallbackText || alt || 'Sản phẩm';
    const words = displayText.split(' ').slice(0, 3);
    const initials = words.map(w => w[0]).join('').toUpperCase();

    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-accent-100 to-accent-200',
          className
        )}
      >
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-accent-300 flex items-center justify-center">
            <span className="text-2xl font-bold text-accent-600">{initials}</span>
          </div>
          <p className="text-sm text-accent-600 font-medium truncate max-w-full px-2">
            {displayText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
