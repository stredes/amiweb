import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../features/cart/services/orderService';
import { Order } from '../../features/auth/types';
import { FiArrowLeft, FiPackage, FiTruck, FiCheck, FiDownload, FiMessageCircle } from 'react-icons/fi';
import Loader from '../../components/ui/Loader';
import { FadeIn } from '../../components/ui/FadeIn';
import { toast } from '../../components/ui/Toast';
import './OrderDetailPage.css';

const statusConfig = {
  'pendiente': { label: 'Pendiente', color: '#FFA500', icon: '⏳' },
  'confirmado': { label: 'Confirmado', color: '#00BCD4', icon: '✓' },
  'procesando': { label: 'Procesando', color: '#2196F3', icon: '📦' },
  'enviado': { label: 'Enviado', color: '#9C27B0', icon: '🚚' },
  'entregado': { label: 'Entregado', color: '#4CAF50', icon: '✅' },
  'cancelado': { label: 'Cancelado', color: '#F44336', icon: '❌' }
};

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const orderData = await orderService.getOrderById(orderId);
      if (!orderData) {
        setError('Pedido no encontrado');
      } else {
        setOrder(orderData);
      }
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Error al cargar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!order) return;
    if (!confirm('¿Confirmas que recibiste el pedido?')) return;

    setIsConfirming(true);
    try {
      await orderService.confirmDelivery(order.id);
      toast.success('Entrega confirmada. ¡Gracias!');
      await loadOrder();
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo confirmar la entrega');
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="order-detail-loading">
        <Loader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-error">
        <h2>❌ {error || 'Pedido no encontrado'}</h2>
        <button className="btn btn--primary" onClick={() => navigate('/portal')}>
          Volver al Portal
        </button>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const total = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(order.total);

  const getStatusTimeline = () => {
    const allStatuses: Array<keyof typeof statusConfig> = [
      'pendiente',
      'confirmado',
      'procesando',
      'enviado',
      'entregado'
    ];

    if (order.status === 'cancelado') {
      return ['cancelado'];
    }

    return allStatuses;
  };

  const isStatusCompleted = (checkStatus: keyof typeof statusConfig) => {
    const allStatuses: Array<keyof typeof statusConfig> = [
      'pendiente',
      'confirmado',
      'procesando',
      'enviado',
      'entregado'
    ];

    if (order.status === 'cancelado') {
      return checkStatus === 'cancelado';
    }

    const currentIndex = allStatuses.indexOf(order.status);
    const checkIndex = allStatuses.indexOf(checkStatus);
    return checkIndex <= currentIndex;
  };

  return (
    <div className="order-detail-page">
      <FadeIn direction="up">
        <div className="order-detail-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
            Volver
          </button>
          <div className="order-detail-header__info">
            <h1>Pedido {order.orderNumber}</h1>
            <p className="muted">Realizado el {new Date(order.date).toLocaleDateString('es-CL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
          <div 
            className="order-status-badge"
            style={{ backgroundColor: status.color }}
          >
            <span className="order-status-badge__icon">{status.icon}</span>
            <span className="order-status-badge__label">{status.label}</span>
          </div>
        </div>
      </FadeIn>

      <div className="order-detail-content">
        {/* Timeline */}
        <FadeIn direction="up" delay={0.1}>
          <div className="order-timeline-card">
            <h2>Estado del Pedido</h2>
            <div className="order-timeline">
              {getStatusTimeline().map((timelineStatus, index) => {
                const statusInfo = statusConfig[timelineStatus as keyof typeof statusConfig];
                const isCompleted = isStatusCompleted(timelineStatus as keyof typeof statusConfig);
                const isCurrent = order.status === timelineStatus;

                return (
                  <div 
                    key={timelineStatus}
                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="timeline-step__icon">
                      {isCompleted ? <FiCheck /> : statusInfo.icon}
                    </div>
                    <div className="timeline-step__content">
                      <h3>{statusInfo.label}</h3>
                      {isCurrent && (
                        <p className="muted">Estado actual</p>
                      )}
                    </div>
                    {index < getStatusTimeline().length - 1 && (
                      <div className={`timeline-step__line ${isCompleted ? 'completed' : ''}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        <div className="order-detail-grid">
          {/* Productos */}
          <FadeIn direction="up" delay={0.2}>
            <div className="order-products-card">
              <h2>Productos ({order.products?.length || 0})</h2>
              <div className="order-products-list">
                {order.products?.map((product, index) => (
                  <div key={index} className="order-product-item">
                    <div className="order-product-item__info">
                      <h3>{product.name}</h3>
                      <p className="muted">Cantidad: {product.quantity}</p>
                    </div>
                    <div className="order-product-item__price">
                      ${((product.price || 0) * product.quantity).toLocaleString('es-CL')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-products-total">
                <span>Total:</span>
                <strong>{total}</strong>
              </div>
            </div>
          </FadeIn>

          {/* Información de Envío */}
          <FadeIn direction="up" delay={0.3}>
            <div className="order-info-card">
              <h2>Información de Envío</h2>
              <div className="order-info-item">
                <FiPackage className="order-info-icon" />
                <div>
                  <strong>Dirección de Entrega</strong>
                  <p className="muted">
                    {order.trackingNumber ? order.trackingNumber : 'Por confirmar'}
                  </p>
                </div>
              </div>
              {order.estimatedDelivery && (
                <div className="order-info-item">
                  <FiTruck className="order-info-icon" />
                  <div>
                    <strong>Entrega Estimada</strong>
                    <p className="muted">
                      {new Date(order.estimatedDelivery).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
              {order.trackingNumber && (
                <div className="order-info-item">
                  <strong>Número de Seguimiento</strong>
                  <p className="tracking-number">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </FadeIn>
        </div>

        {/* Acciones */}
        <FadeIn direction="up" delay={0.4}>
          <div className="order-actions-card">
            <button className="btn btn--secondary">
              <FiDownload />
              Descargar Factura
            </button>
            <button className="btn btn--secondary">
              <FiMessageCircle />
              Contactar Soporte
            </button>
            {order.status === 'enviado' && (
              <button className="btn btn--primary" onClick={handleConfirmDelivery} disabled={isConfirming}>
                {isConfirming ? 'Confirmando...' : 'Confirmar Entrega'}
              </button>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
