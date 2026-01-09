import './InfiniteScroll.css';
import { Skeleton } from './Skeleton';

interface InfiniteScrollProps {
  observerTarget: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  hasMore: boolean;
  loadingComponent?: React.ReactNode;
  endMessage?: React.ReactNode;
}

export function InfiniteScrollTrigger({
  observerTarget,
  isLoading,
  hasMore,
  loadingComponent,
  endMessage,
}: InfiniteScrollProps) {
  return (
    <div className="infinite-scroll-trigger" ref={observerTarget}>
      {isLoading && (
        <div className="infinite-scroll-trigger__loading">
          {loadingComponent || (
            <>
              <Skeleton.ProductCard />
              <Skeleton.ProductCard />
              <Skeleton.ProductCard />
            </>
          )}
        </div>
      )}
      {!hasMore && !isLoading && (
        <div className="infinite-scroll-trigger__end">
          {endMessage || <p>No hay más productos para mostrar</p>}
        </div>
      )}
    </div>
  );
}
