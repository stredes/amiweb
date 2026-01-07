import { Order } from '../../features/auth/types';

interface OrderCardProps {
  order: Order;
}

const statusConfig = {
  'pendiente': { label: 'Pendiente', color: '#FFA500', icon: '⏳' },
  'en-preparacion': { label: 'En Preparación', color: '#2196F3', icon: '📦' },
  'en-transito': { label: 'En Tránsito', color: '#9C27B0', icon: '🚚' },
  'entregado': { label: 'Entregado', color: '#4CAF50', icon: '✅' },
  'cancelado': { label: 'Cancelado', color: '#F44336', icon: '❌' }
};

export function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status];
  const total = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(order.total);

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
          {order.products.map(product => (
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
    </div>
  );
}
