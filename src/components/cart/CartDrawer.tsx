import { useState } from 'react';
import { useCart } from '../../features/cart/cartContext';
import { FiX, FiShoppingCart, FiTrash2, FiSend, FiDownload } from 'react-icons/fi';
import { toast } from '../ui/Toast';
import { syncQuote } from '../../lib/serviceWorker';
import './CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, updateNotes, clearCart } = useCart();
  const [isSending, setIsSending] = useState(false);

  const handleSendQuote = async () => {
    setIsSending(true);
    try {
      const quoteData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          brand: item.brand,
          quantity: item.quantity,
          notes: item.notes,
        })),
        timestamp: Date.now(),
      };

      // Try to send immediately
      if (navigator.onLine) {
        // Simular envío - aquí iría la llamada al backend
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Cotización enviada:', quoteData);
        toast.success('Cotización enviada al vendedor');
      } else {
        // Offline: use background sync
        const synced = await syncQuote(quoteData);
        if (synced) {
          toast.success('Cotización guardada. Se enviará cuando haya conexión');
        } else {
          toast.error('Error al guardar cotización para envío posterior');
        }
      }
      
      clearCart();
      onClose();
    } catch (error) {
      toast.error('Error al enviar cotización');
    } finally {
      setIsSending(false);
    }
  };

  const handleExport = () => {
    const content = items.map(item => 
      `${item.name};${item.brand};${item.quantity};${item.notes || ''}`
    ).join('\n');
    
    const blob = new Blob([`Producto;Marca;Cantidad;Notas\n${content}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotizacion_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Cotización exportada');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            <FiShoppingCart size={24} />
            <h2>Carrito de Cotización</h2>
            <span className="cart-drawer__count">{items.length}</span>
          </div>
          <button className="cart-drawer__close" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer__content">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <FiShoppingCart size={64} />
              <p>Tu carrito está vacío</p>
              <p className="muted">Agrega productos para solicitar una cotización</p>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__info">
                    <h4>{item.name}</h4>
                    <p className="muted">{item.brand}</p>
                    {item.familia && (
                      <span className="cart-item__tag">{item.familia}</span>
                    )}
                  </div>
                  
                  <div className="cart-item__quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="cart-item__qty-btn"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="cart-item__qty-input"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cart-item__qty-btn"
                    >
                      +
                    </button>
                  </div>

                  <textarea
                    placeholder="Notas adicionales..."
                    value={item.notes || ''}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    className="cart-item__notes"
                    rows={2}
                  />

                  <button
                    onClick={() => removeItem(item.id)}
                    className="cart-item__remove"
                    title="Eliminar"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__actions">
              <button
                className="cart-drawer__action-btn"
                onClick={handleExport}
              >
                <FiDownload size={18} />
                Exportar
              </button>
              <button
                className="cart-drawer__action-btn cart-drawer__action-btn--danger"
                onClick={clearCart}
              >
                <FiTrash2 size={18} />
                Vaciar
              </button>
            </div>
            <button
              className="cart-drawer__send-btn"
              onClick={handleSendQuote}
              disabled={isSending}
            >
              <FiSend size={18} />
              {isSending ? 'Enviando...' : 'Solicitar Cotización'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
