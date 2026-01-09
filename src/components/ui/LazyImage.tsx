import { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  blur?: boolean;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyImage({
  src,
  alt,
  placeholder,
  blur = true,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`lazy-image ${className}`} ref={imgRef}>
      {!isLoaded && placeholder && (
        <img
          src={placeholder}
          alt={alt}
          className={`lazy-image__placeholder ${blur ? 'lazy-image__placeholder--blur' : ''}`}
          aria-hidden="true"
        />
      )}
      {isInView && (
        <img
          {...props}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={`lazy-image__img ${isLoaded ? 'lazy-image__img--loaded' : ''}`}
        />
      )}
    </div>
  );
}

interface OptimizedImageProps extends LazyImageProps {
  srcSet?: string;
  sizes?: string;
  webpSrc?: string;
  avifSrc?: string;
}

export function OptimizedImage({
  src,
  srcSet,
  sizes,
  webpSrc,
  avifSrc,
  alt,
  ...props
}: OptimizedImageProps) {
  return (
    <picture className="optimized-image">
      {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      {srcSet && <source srcSet={srcSet} sizes={sizes} />}
      <LazyImage src={src} alt={alt} {...props} />
    </picture>
  );
}
