import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';
import './ImageGallery.css';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  thumbnailPosition?: 'bottom' | 'left' | 'right';
  showZoom?: boolean;
  showFullscreen?: boolean;
  className?: string;
}

export function ImageGallery({
  images,
  alt = 'Product image',
  thumbnailPosition = 'bottom',
  showZoom = true,
  showFullscreen = true,
  className = '',
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showZoom) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFullscreen) return;
    
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  const currentImage = images[currentIndex];

  return (
    <>
      <div className={`image-gallery image-gallery--${thumbnailPosition} ${className}`}>
        <div className="image-gallery__main">
          <div
            className={`image-gallery__main-container ${isZooming ? 'image-gallery__main-container--zooming' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
          >
            <img
              src={currentImage}
              alt={`${alt} ${currentIndex + 1}`}
              className="image-gallery__main-image"
              style={
                isZooming
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transform: 'scale(2)',
                    }
                  : undefined
              }
            />
            
            {showFullscreen && (
              <button
                className="image-gallery__zoom-button"
                onClick={() => setIsFullscreen(true)}
                aria-label="View fullscreen"
              >
                <FiZoomIn />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <>
              <button
                className="image-gallery__nav image-gallery__nav--prev"
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                <FiChevronLeft />
              </button>
              <button
                className="image-gallery__nav image-gallery__nav--next"
                onClick={handleNext}
                aria-label="Next image"
              >
                <FiChevronRight />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="image-gallery__thumbnails">
            {images.map((image, index) => (
              <button
                key={index}
                className={`image-gallery__thumbnail ${
                  index === currentIndex ? 'image-gallery__thumbnail--active' : ''
                }`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={image} alt={`${alt} thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {isFullscreen && (
        <div
          className="image-gallery-fullscreen"
          onClick={() => setIsFullscreen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="image-gallery-fullscreen__close"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen"
          >
            <FiX />
          </button>

          <div className="image-gallery-fullscreen__content" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentImage}
              alt={`${alt} ${currentIndex + 1}`}
              className="image-gallery-fullscreen__image"
            />

            {images.length > 1 && (
              <>
                <button
                  className="image-gallery-fullscreen__nav image-gallery-fullscreen__nav--prev"
                  onClick={handlePrevious}
                  aria-label="Previous image"
                >
                  <FiChevronLeft />
                </button>
                <button
                  className="image-gallery-fullscreen__nav image-gallery-fullscreen__nav--next"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <FiChevronRight />
                </button>

                <div className="image-gallery-fullscreen__counter">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
