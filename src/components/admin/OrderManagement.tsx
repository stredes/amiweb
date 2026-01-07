import { useState } from 'react';
import { Order } from '../../features/auth/types';
import { authApi } from '../../features/auth/authApi';

interface OrderManagementProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

const statusOptions: Array<{ value: Order['status']; label: string; color: string }> = [
  { value: 'pendiente', label: 'Pendiente', color: '#FFA500' },
  { value: 'en-preparacion', label: 'En Preparación', color: '#2196F3' },
  { value: 'en-transito', label: 'En Tránsito', color: '#9C27B0' },
  { value: 'entregado', label: 'Entregado', color: '#4CAF50' },
  { value: 'cancelado', label: 'Cancelado', color: '#F44336' }
];

export function OrderManagement({ orders, onOrderUpdate }: OrderManagementProps) {
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrder(orderId);
    try {
      await authApi.updateOrderStatus(orderId, newStatus);
      onOrderUpdate();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar el pedido');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <div className="order-management">
      <h2>Gestión de Pedidos</h2>
      <div className="order-management__table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Seguimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const currentStatus = statusOptions.find(s => s.value === order.status);
              return (
                <tr key={order.id}>
                  <td>
                    <strong>{order.orderNumber}</strong>
                  </td>
                  <td>{new Date(order.date).toLocaleDateString('es-CL')}</td>
                  <td>
                    <div className="order-products-list">
                      {order.products.length} producto(s)
                    </div>
                  </td>
                  <td>
                    <strong>{formatCurrency(order.total)}</strong>
                  </td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: currentStatus?.color }}
                    >
                      {currentStatus?.label}
                    </span>
                  </td>
                  <td>
                    <span className="muted">{order.trackingNumber || '-'}</span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      disabled={updatingOrder === order.id}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
