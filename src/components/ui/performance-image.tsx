import { useState, useRef, useEffect } from 'react';

interface PerformanceImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export function PerformanceImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false
}: PerformanceImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Convert to WebP if possible
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('placeholder.svg') || originalSrc.includes('.svg')) {
      return originalSrc;
    }
    
    // Check if browser supports WebP
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };
    
    if (supportsWebP() && !originalSrc.includes('.webp')) {
      // In a real implementation, you'd have a service to convert images
      // For now, we'll keep the original format
      return originalSrc;
    }
    
    return originalSrc;
  };

  useEffect(() => {
    if (priority && imgRef.current) {
      // Preload priority images
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedSrc(src);
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        ref={imgRef}
        src={hasError ? '/placeholder.svg' : getOptimizedSrc(src)}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </div>
  );
}
