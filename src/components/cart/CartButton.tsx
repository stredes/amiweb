import { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../features/cart/cartContext';
import { CartDrawer } from './CartDrawer';
import './CartButton.css';

export function CartButton() {
  const { itemCount } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <button
        className="cart-button"
        data-tour="cart-button"
        onClick={() => setIsDrawerOpen(true)}
        title="Ver carrito de cotización"
      >
        <FiShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="cart-button__badge">{itemCount}</span>
        )}
      </button>
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
