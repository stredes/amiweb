import { useState, useEffect, useCallback, useRef } from 'react';

interface InfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export function useInfiniteScroll({
  threshold = 0.5,
  rootMargin = '100px',
  hasMore,
  isLoading,
  onLoadMore,
}: InfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerTarget.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, threshold, rootMargin]);

  return { observerTarget };
}

interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  itemCount: number;
  overscan?: number;
}

export function useVirtualScroll({
  itemHeight,
  containerHeight,
  itemCount,
  overscan = 3,
}: VirtualScrollOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      offsetTop: i * itemHeight,
    });
  }

  const totalHeight = itemCount * itemHeight;

  return {
    visibleItems,
    totalHeight,
    handleScroll,
  };
}
