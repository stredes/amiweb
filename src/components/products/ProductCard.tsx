import { memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../features/catalog/types';
import Button from '../ui/Button';
import GlareHover from '../ui/GlareHover';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../features/cart/cartContext';
import { ROUTES } from '../../config/routes';
import './ProductCard.css';

type ProductCardProps = {
  product: Product;
  categoryName?: string;
  onQuote: (product: Product) => void;
};

const fallbackImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="%23f8f9fa"/><rect x="40" y="40" width="560" height="340" rx="24" fill="%23ffffff" stroke="%23dee2e6" stroke-width="2"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="%238b1538">AMILAB</text></svg>';

const ProductCard = memo(function ProductCard({ product, categoryName, onQuote }: ProductCardProps) {
  const { addItem } = useCart();
  
  const detailPath = useMemo(
    () => ROUTES.productDetail.replace(':productId', product.id),
    [product.id]
  );
  
  const imageSrc = useMemo(() => {
    const candidate = product.imageUrl?.trim();
    return candidate ? candidate : fallbackImage;
  }, [product.imageUrl]);

  const handleAddToCart = useCallback(() => {
    addItem(product);
  }, [addItem, product]);

  return (
    <GlareHover
      className="product-card-wrapper"
      width="100%"
      height="auto"
      background="transparent"
      borderRadius="var(--radius-lg)"
      borderColor="transparent"
      glareColor="#ffffff"
      glareOpacity={0.15}
      glareAngle={-30}
      glareSize={200}
      transitionDuration={600}
    >
      <div className="product-card">
        {/* Imagen del producto */}
        <div className="product-card__image">
          <img 
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="product-card__img"
            onError={(event) => {
              if (event.currentTarget.src !== fallbackImage) {
                event.currentTarget.src = fallbackImage;
              }
            }}
          />
          <div className="product-card__badge">{product.brand || 'AMILAB'}</div>
        </div>

        {/* Contenido del producto */}
        <div className="product-card__content">
          <h3 className="product-card__title" title={product.name}>
            {product.name}
          </h3>
          
          <div className="product-card__meta">
            {categoryName && (
              <span className="product-card__category">
                📦 {categoryName}
              </span>
            )}
          </div>

          {useMemo(() => {
            if (!product.shortDescription) return null;
            const desc = product.shortDescription.length > 100
              ? `${product.shortDescription.substring(0, 100)}...`
              : product.shortDescription;
            return <p className="product-card__description">{desc}</p>;
          }, [product.shortDescription])}

          {/* Información adicional si existe */}
          {(product.familia || product.subfamilia) && (
            <div className="product-card__tags">
              {product.familia && (
                <span className="product-card__tag">{product.familia}</span>
              )}
              {product.subfamilia && (
                <span className="product-card__tag product-card__tag--secondary">
                  {product.subfamilia}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="product-card__actions">
          <Link to={detailPath} className="product-card__link-full">
            <Button variant="primary" size="md" className="product-card__btn-detail">
              Ver detalle
            </Button>
          </Link>
          <button 
            type="button" 
            onClick={handleAddToCart}
            className="product-card__btn-icon"
            aria-label="Agregar al carrito"
            title="Agregar al carrito"
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>
    </GlareHover>
  );
});

export default ProductCard;
