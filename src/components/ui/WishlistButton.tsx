import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '../../contexts/WishlistContext';
import { showToast } from './Toast';
import './WishlistButton.css';

interface WishlistButtonProps {
  productId: string;
  productName: string;
  productPrice?: number;
  productImage?: string;
  productSlug?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function WishlistButton({
  productId,
  productName,
  productPrice,
  productImage,
  productSlug,
  size = 'md',
  showLabel = false,
  className = '',
}: WishlistButtonProps) {
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const handleToggle = () => {
    if (inWishlist) {
      removeItem(productId);
      showToast.info('Producto eliminado de favoritos');
    } else {
      addItem({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        slug: productSlug,
      });
      showToast.success('Producto agregado a favoritos');
    }
  };

  return (
    <button
      className={`wishlist-button wishlist-button--${size} ${
        inWishlist ? 'wishlist-button--active' : ''
      } ${className}`}
      onClick={handleToggle}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
    >
      {inWishlist ? (
        <FaHeart className="wishlist-button__icon wishlist-button__icon--filled" />
      ) : (
        <FiHeart className="wishlist-button__icon" />
      )}
      {showLabel && (
        <span className="wishlist-button__label">
          {inWishlist ? 'En favoritos' : 'Agregar a favoritos'}
        </span>
      )}
    </button>
  );
}
