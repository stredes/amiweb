import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../../features/auth/types';
import { FiDownload, FiX, FiMessageCircle, FiAlertCircle, FiEye } from 'react-icons/fi';
import { orderService } from '../../features/cart/services/orderService';
import { toast } from '../ui/Toast';

interface OrderCardProps {
  order: Order;
  onOrderUpdated?: () => void;
}

const statusConfig = {
  'cotizacion': { label: 'Cotización', color: '#9E9E9E', icon: '📝' },
  'pendiente': { label: 'Pendiente', color: '#FFA500', icon: '⏳' },
  'pendiente_vendedor': { label: 'Pendiente Vendedor', color: '#FF9800', icon: '⏰' },
  'aprobado_vendedor': { label: 'Aprobado Vendedor', color: '#03A9F4', icon: '👍' },
  'pendiente_admin': { label: 'Pendiente Admin', color: '#FF9800', icon: '⏰' },
  'aprobado_admin': { label: 'Aprobado Admin', color: '#00BCD4', icon: '✓✓' },
  'confirmado': { label: 'Confirmado', color: '#00BCD4', icon: '✓' },
  'procesando': { label: 'Procesando', color: '#2196F3', icon: '📦' },
  'enviado': { label: 'Enviado', color: '#9C27B0', icon: '🚚' },
  'entregado': { label: 'Entregado', color: '#4CAF50', icon: '✅' },
  'cancelado': { label: 'Cancelado', color: '#F44336', icon: '❌' },
  'rechazado': { label: 'Rechazado', color: '#E91E63', icon: '🚫' }
};

export function OrderCard({ order, onOrderUpdated }: OrderCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Defensive check for order and status
  if (!order || !order.status) {
    return null;
  }

  const status = statusConfig[order.status as keyof typeof statusConfig] || { 
    label: order.status || 'Desconocido', 
    color: '#757575', 
    icon: '📋' 
  };
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
    window.location.href = `mailto:soporte@spdental.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
        <Link
          className="order-action-btn order-action-btn--primary"
          to={`/portal/orders/${order.id}`}
          title="Ver detalles"
        >
          <FiEye size={18} aria-hidden="true" />
          Ver Detalles
        </Link>
        
        <button 
          className="order-action-btn order-action-btn--secondary"
          onClick={handleDownloadInvoice}
          title="Descargar factura"
        >
          <FiDownload size={18} aria-hidden="true" />
          Factura
        </button>
        
        <button 
          className="order-action-btn order-action-btn--secondary"
          onClick={handleContactSupport}
          title="Contactar soporte"
        >
          <FiMessageCircle size={18} aria-hidden="true" />
          Soporte
        </button>
        
        {canCancel && (
          <button 
            className="order-action-btn order-action-btn--danger"
            onClick={() => setShowCancelModal(true)}
            title="Cancelar pedido"
          >
            <FiX size={18} aria-hidden="true" />
            Cancelar
          </button>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <>
          <button
            type="button"
            className="modal-overlay"
            onClick={() => setShowCancelModal(false)}
            aria-label="Cerrar cancelación"
          />
          <div className="cancel-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title">
            <div className="cancel-modal__header">
              <FiAlertCircle size={24} color="#dc3545" aria-hidden="true" />
              <h3 id="cancel-modal-title">¿Cancelar pedido?</h3>
            </div>
            <p className="cancel-modal__text">
              Estás a punto de cancelar el pedido <strong>{order.orderNumber}</strong>. 
              Esta acción no se puede deshacer.
            </p>
            <label className="sr-only" htmlFor={`cancel-reason-${order.id}`}>
              Motivo de cancelación
            </label>
            <textarea
              id={`cancel-reason-${order.id}`}
              className="cancel-modal__input"
              placeholder="Motivo de cancelación (requerido)…"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              name="cancelReason"
              autoComplete="off"
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
                {isCancelling ? 'Cancelando…' : 'Confirmar Cancelación'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
