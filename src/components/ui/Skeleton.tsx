import type { CSSProperties } from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  style?: CSSProperties;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = '',
  variant = 'rectangular',
  style: styleProp,
}: SkeletonProps) {
  const style = {
    width,
    height,
    borderRadius: variant === 'circular' ? '50%' : borderRadius,
    ...styleProp,
  };

  return <div className={`skeleton ${className}`} style={style} />;
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height="200px" className="skeleton-card__image" />
      <div className="skeleton-card__content">
        <Skeleton height="24px" width="80%" className="skeleton-card__title" />
        <Skeleton height="16px" width="60%" className="skeleton-card__subtitle" />
        <Skeleton height="16px" width="100%" className="skeleton-card__text" />
        <Skeleton height="16px" width="90%" className="skeleton-card__text" />
        <div className="skeleton-card__footer">
          <Skeleton height="32px" width="100px" />
          <Skeleton height="32px" width="120px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProductCard() {
  return (
    <div className="skeleton-product-card">
      <Skeleton height="280px" borderRadius="12px 12px 0 0" />
      <div className="skeleton-product-card__body">
        <Skeleton height="20px" width="70%" />
        <Skeleton height="16px" width="50%" style={{ marginTop: '8px' }} />
        <Skeleton height="24px" width="40%" style={{ marginTop: '12px' }} />
        <Skeleton height="40px" width="100%" style={{ marginTop: '16px' }} />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          <Skeleton variant="circular" width="48px" height="48px" />
          <div className="skeleton-list-item__content">
            <Skeleton height="20px" width="60%" />
            <Skeleton height="16px" width="40%" style={{ marginTop: '8px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table__header">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height="40px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table__row">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="32px" />
          ))}
        </div>
      ))}
    </div>
  );
}
