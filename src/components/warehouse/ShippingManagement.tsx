import { useState } from 'react';
import { Order } from '../../features/auth/types';
import { authApi } from '../../features/auth/authApi';
import './ShippingManagement.css';

interface ShippingManagementProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

export function ShippingManagement({ orders, onOrderUpdate }: ShippingManagementProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({});

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleTrackingChange = (orderId: string, value: string) => {
    setTrackingNumbers(prev => ({
      ...prev,
      [orderId]: value
    }));
  };

  const handleShipOrder = async (order: Order) => {
    const trackingNumber = trackingNumbers[order.id] || order.trackingNumber;
    
    if (!trackingNumber || trackingNumber.trim() === '') {
      alert('Debes ingresar un número de seguimiento');
      return;
    }

    setUpdatingOrder(order.id);
    try {
      // Actualizar con número de seguimiento
      await authApi.updateOrder(order.id, {
        status: 'enviado',
        trackingNumber: trackingNumber.trim()
      });
      
      setTrackingNumbers(prev => {
        const newTracking = { ...prev };
        delete newTracking[order.id];
        return newTracking;
      });
      
      onOrderUpdate();
      alert('Pedido marcado como enviado');
    } catch (error) {
      console.error('Error shipping order:', error);
      alert('Error al marcar el pedido como enviado');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      procesando: { label: 'Listo para Despacho', color: '#2196F3', icon: '📦' },
      enviado: { label: 'En Tránsito', color: '#9C27B0', icon: '🚚' },
      entregado: { label: 'Entregado', color: '#4CAF50', icon: '✅' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span className="status-badge" style={{ backgroundColor: config.color }}>
        <span>{config.icon}</span> {config.label}
      </span>
    );
  };

  const readyToShipOrders = orders.filter(o => o.status === 'procesando');
  const shippedOrders = orders.filter(o => o.status === 'enviado');

  return (
    <div className="shipping-management">
      {/* Listos para despacho */}
      {readyToShipOrders.length > 0 && (
        <div className="shipping-section">
          <div className="shipping-section__header">
            <h3>📦 Listos para Despacho</h3>
            <span className="badge">{readyToShipOrders.length}</span>
          </div>

          <div className="shipping-list">
            {readyToShipOrders.map(order => {
              const isExpanded = expandedOrder === order.id;
          const isUpdating = updatingOrder === order.id;
              const currentTracking = trackingNumbers[order.id] || order.trackingNumber || '';

              return (
                <div key={order.id} className={`shipping-card ${isExpanded ? 'shipping-card--expanded' : ''}`}>
                  <div
                    className="shipping-card__header"
                    onClick={() => toggleOrderExpand(order.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleOrderExpand(order.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={expandedOrder === order.id}
                  >
                    <div className="shipping-card__info">
                      <div className="shipping-card__number">
                        <strong>#{order.orderNumber}</strong>
                      </div>
                      <div className="shipping-card__customer">
                        <span className="label">Cliente:</span> {order.customerName}
                      </div>
                      <div className="shipping-card__date">
                        <span className="label">Fecha:</span> {formatDate(order.date)}
                      </div>
                    </div>

                    <div className="shipping-card__summary">
                      {getStatusBadge(order.status)}
                      <div className="shipping-card__items">
                        {(order.items || order.products || []).length} producto{(order.items || order.products || []).length !== 1 ? 's' : ''}
                      </div>
                      <button className="expand-btn" type="button">
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="shipping-card__details">
                      {/* Dirección de destino */}
                      <div className="detail-section">
                        <h4>📍 Dirección de Entrega</h4>
                        <div className="shipping-address">
                          <p><strong>{order.shippingAddress.fullName}</strong></p>
                          <p>{order.shippingAddress.address}</p>
                          {order.shippingAddress.apartment && (
                            <p>{order.shippingAddress.apartment}</p>
                          )}
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.region}
                          </p>
                          <p>Código Postal: {order.shippingAddress.postalCode}</p>
                          {order.shippingAddress.phone && (
                            <p><strong>Teléfono:</strong> {order.shippingAddress.phone}</p>
                          )}
                          {order.shippingAddress.instructions && (
                            <div className="instructions">
                              <strong>Instrucciones:</strong>
                              <p>{order.shippingAddress.instructions}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Productos */}
                      <div className="detail-section">
                        <h4>📋 Contenido del Pedido</h4>
                        <div className="product-list">
                          {(order.items || order.products || []).map(item => (
                            <div key={item.productId || item.id} className="product-item">
                              <div className="product-item__info">
                                <span className="product-name">{item.name || item.productName}</span>
                                <span className="product-sku">SKU: {item.sku || 'N/A'}</span>
                              </div>
                              <div className="product-item__quantity">
                                <span className="quantity">x{item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Número de seguimiento */}
                      <div className="detail-section">
                        <h4>🔢 Número de Seguimiento</h4>
                        <div className="tracking-input-group">
                          <label className="sr-only" htmlFor={`tracking-${order.id}`}>
                            Número de seguimiento
                          </label>
                          <input
                            id={`tracking-${order.id}`}
                            type="text"
                            className="tracking-input"
                            placeholder="Ingresa el número de seguimiento…"
                            value={currentTracking}
                            onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                            disabled={isUpdating}
                            name="trackingNumber"
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="shipping-card__actions">
                        <button
                          className="btn btn--primary btn--ship"
                          onClick={() => handleShipOrder(order)}
                          disabled={isUpdating || !currentTracking}
                        >
                          {isUpdating ? 'Procesando…' : '🚚 Marcar como Enviado'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* En tránsito */}
      {shippedOrders.length > 0 && (
        <div className="shipping-section">
          <div className="shipping-section__header">
            <h3>🚚 En Tránsito</h3>
            <span className="badge">{shippedOrders.length}</span>
          </div>

          <div className="shipping-list">
            {shippedOrders.map(order => {
              const isExpanded = expandedOrder === order.id;

              return (
                <div key={order.id} className={`shipping-card shipping-card--shipped ${isExpanded ? 'shipping-card--expanded' : ''}`}>
                  <div
                    className="shipping-card__header"
                    onClick={() => toggleOrderExpand(order.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleOrderExpand(order.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={expandedOrder === order.id}
                  >
                    <div className="shipping-card__info">
                      <div className="shipping-card__number">
                        <strong>#{order.orderNumber}</strong>
                      </div>
                      <div className="shipping-card__customer">
                        <span className="label">Cliente:</span> {order.customerName}
                      </div>
                      {order.trackingNumber && (
                        <div className="shipping-card__tracking">
                          <span className="label">Seguimiento:</span> {order.trackingNumber}
                        </div>
                      )}
                    </div>

                    <div className="shipping-card__summary">
                      {getStatusBadge(order.status)}
                      <button className="expand-btn" type="button">
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="shipping-card__details">
                      {/* Dirección */}
                      <div className="detail-section">
                        <h4>📍 Dirección de Entrega</h4>
                        <div className="shipping-address">
                          <p><strong>{order.shippingAddress.fullName}</strong></p>
                          <p>{order.shippingAddress.address}</p>
                          {order.shippingAddress.apartment && (
                            <p>{order.shippingAddress.apartment}</p>
                          )}
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.region}
                          </p>
                          {order.shippingAddress.phone && (
                            <p><strong>Tel:</strong> {order.shippingAddress.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Tracking */}
                      {order.trackingNumber && (
                        <div className="detail-section">
                          <h4>🔢 Número de Seguimiento</h4>
                          <div className="tracking-display">
                            <code>{order.trackingNumber}</code>
                          </div>
                        </div>
                      )}

                      {/* Productos */}
                      <div className="detail-section">
                        <h4>📋 Contenido</h4>
                        <div className="product-list">
                          {(order.items || order.products || []).map(item => (
                            <div key={item.productId} className="product-item">
                              <span className="product-name">{item.name}</span>
                              <span className="quantity">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="shipping-card__actions">
                        <span className="muted">Entrega pendiente de confirmación por el cliente.</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {readyToShipOrders.length === 0 && shippedOrders.length === 0 && (
        <div className="shipping-empty">
          <div className="empty-state">
            <span className="empty-state__icon">✅</span>
            <h3>No hay pedidos para despachar</h3>
            <p>Todos los pedidos están entregados o aún no están listos</p>
          </div>
        </div>
      )}
    </div>
  );
}
