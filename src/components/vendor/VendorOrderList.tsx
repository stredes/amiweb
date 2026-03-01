import { Order } from '../../features/auth/types';

interface VendorOrderListProps {
  orders: Order[];
}

const statusConfig = {
  'cotizacion': { label: 'Cotización', color: '#8B5CF6', icon: '📋' },
  'pendiente_vendedor': { label: 'Pendiente Vendedor', color: '#F59E0B', icon: '⏳' },
  'aprobado_vendedor': { label: 'Aprobado Vendedor', color: '#3B82F6', icon: '✅' },
  'pendiente_admin': { label: 'Pendiente Admin', color: '#F97316', icon: '🧾' },
  'aprobado_admin': { label: 'Aprobado Admin', color: '#0EA5E9', icon: '✔️' },
  'rechazado': { label: 'Rechazado', color: '#EF4444', icon: '❌' },
  'pendiente': { label: 'Pendiente', color: '#FFA500', icon: '⏳' },
  'confirmado': { label: 'Confirmado', color: '#00BCD4', icon: '✓' },
  'procesando': { label: 'Procesando', color: '#2196F3', icon: '📦' },
  'enviado': { label: 'Enviado', color: '#9C27B0', icon: '🚚' },
  'entregado': { label: 'Entregado', color: '#4CAF50', icon: '✅' },
  'cancelado': { label: 'Cancelado', color: '#F44336', icon: '❌' }
};

export function VendorOrderList({ orders }: VendorOrderListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="vendor-order-list">
      <h2>Pedidos de Mis Clientes</h2>
      <div className="order-list-table">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Entrega</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const status = statusConfig[order.status] || { label: order.status, color: '#6B7280', icon: 'ℹ️' };
              return (
                <tr key={order.id}>
                  <td>
                    <strong>{order.orderNumber}</strong>
                  </td>
                  <td>{new Date(order.date).toLocaleDateString('es-CL')}</td>
                  <td>
                    <span className="muted">{(order.products || []).length} item(s)</span>
                  </td>
                  <td>
                    <strong className="amount">{formatCurrency(order.total)}</strong>
                  </td>
                  <td>
                    <span 
                      className="order-status-badge" 
                      style={{ backgroundColor: status.color }}
                    >
                      {status.icon} {status.label}
                    </span>
                  </td>
                  <td>
                    {order.estimatedDelivery ? (
                      <span className="muted">
                        {new Date(order.estimatedDelivery).toLocaleDateString('es-CL')}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
