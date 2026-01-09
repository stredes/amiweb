import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../features/auth/types';
import { FiDownload, FiX, FiMessageCircle, FiAlertCircle, FiEye } from 'react-icons/fi';
import { orderService } from '../../features/cart/services/orderService';
import { toast } from '../ui/Toast';

interface OrderCardProps {
  order: Order;
  onOrderUpdated?: () => void;
}

const statusConfig = {
  'pendiente': { label: 'Pendiente', color: '#FFA500', icon: '⏳' },
  'confirmado': { label: 'Confirmado', color: '#00BCD4', icon: '✓' },
  'procesando': { label: 'Procesando', color: '#2196F3', icon: '📦' },
  'enviado': { label: 'Enviado', color: '#9C27B0', icon: '🚚' },
  'entregado': { label: 'Entregado', color: '#4CAF50', icon: '✅' },
  'cancelado': { label: 'Cancelado', color: '#F44336', icon: '❌' }
};

export function OrderCard({ order, onOrderUpdated }: OrderCardProps) {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const status = statusConfig[order.status as keyof typeof statusConfig];
  const total = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(order.total);

  const canCancel = ['pendiente', 'confirmado'].includes(order.status);

  const handleDownloadInvoice = () => {
    // Generar CSV con información de la orden
    const content = [
      'Factura / Invoice',
      `Número de Orden: ${order.orderNumber}`,
      `Fecha: ${new Date(order.date).toLocaleDateString('es-CL')}`,
      `Estado: ${status.label}`,
      '',
      'Productos:',
      ...(order.products || []).map(p => `${p.name} - Cantidad: ${p.quantity} - Precio: $${(p.price || 0).toLocaleString('es-CL')}`),
      '',
      `Total: ${total}`,
      '',
      order.trackingNumber ? `Seguimiento: ${order.trackingNumber}` : '',
      order.estimatedDelivery ? `Entrega Estimada: ${new Date(order.estimatedDelivery).toLocaleDateString('es-CL')}` : ''
    ].filter(Boolean).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura_${order.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Factura descargada');
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Por favor indica un motivo de cancelación');
      return;
    }

    setIsCancelling(true);
    try {
      await orderService.cancelOrder(order.id);
      toast.success('Pedido cancelado exitosamente');
      setShowCancelModal(false);
      onOrderUpdated?.();
    } catch (error: any) {
      toast.error(error.message || 'Error al cancelar el pedido');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleContactSupport = () => {
    // Abrir chat o email con contexto del pedido
    const subject = `Consulta sobre pedido ${order.orderNumber}`;
    const body = `Hola, tengo una consulta sobre mi pedido ${order.orderNumber}.`;
    window.location.href = `mailto:soporte@amilab.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="order-card">
      <div className="order-card__header">
        <div>
          <h3>{order.orderNumber}</h3>
          <p className="muted">Fecha: {new Date(order.date).toLocaleDateString('es-CL')}</p>
        </div>
        <div className="order-status" style={{ '--status-color': status.color } as any}>
          <span className="order-status__icon">{status.icon}</span>
          <span className="order-status__label">{status.label}</span>
        </div>
      </div>

      <div className="order-card__products">
        <h4>Productos:</h4>
        <ul>
          {(order.products || []).map(product => (
            <li key={product.id}>
              <span>{product.name}</span>
              <span className="muted">x{product.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-card__footer">
        <div className="order-card__info">
          {order.trackingNumber && (
            <p className="order-tracking">
              <strong>Seguimiento:</strong> {order.trackingNumber}
            </p>
          )}
          {order.estimatedDelivery && order.status !== 'entregado' && (
            <p className="order-delivery">
              <strong>Entrega estimada:</strong> {new Date(order.estimatedDelivery).toLocaleDateString('es-CL')}
            </p>
          )}
        </div>
        <div className="order-card__total">
          <strong>Total: {total}</strong>
        </div>
      </div>

      <div className="order-card__actions">
        <button 
          className="order-action-btn order-action-btn--primary"
          onClick={() => navigate(`/portal/orders/${order.id}`)}
          title="Ver detalles"
        >
          <FiEye size={18} />
          Ver Detalles
        </button>
        
        <button 
          className="order-action-btn order-action-btn--secondary"
          onClick={handleDownloadInvoice}
          title="Descargar factura"
        >
          <FiDownload size={18} />
          Factura
        </button>
        
        <button 
          className="order-action-btn order-action-btn--secondary"
          onClick={handleContactSupport}
          title="Contactar soporte"
        >
          <FiMessageCircle size={18} />
          Soporte
        </button>
        
        {canCancel && (
          <button 
            className="order-action-btn order-action-btn--danger"
            onClick={() => setShowCancelModal(true)}
            title="Cancelar pedido"
          >
            <FiX size={18} />
            Cancelar
          </button>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowCancelModal(false)} />
          <div className="cancel-modal">
            <div className="cancel-modal__header">
              <FiAlertCircle size={24} color="#dc3545" />
              <h3>¿Cancelar pedido?</h3>
            </div>
            <p className="cancel-modal__text">
              Estás a punto de cancelar el pedido <strong>{order.orderNumber}</strong>. 
              Esta acción no se puede deshacer.
            </p>
            <textarea
              className="cancel-modal__input"
              placeholder="Motivo de cancelación (requerido)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
            <div className="cancel-modal__actions">
              <button 
                className="btn btn--secondary"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
              >
                Volver
              </button>
              <button 
                className="btn btn--danger"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
