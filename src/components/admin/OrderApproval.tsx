import { useState } from 'react';
import { Order } from '../../features/auth/types';
import { authApi } from '../../features/auth/authApi';
import './OrderApproval.css';

interface OrderApprovalProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

export function OrderApproval({ orders, onOrderUpdate }: OrderApprovalProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

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

  const handleApprove = async (orderId: string) => {
    if (!confirm('¿Aprobar este pedido? Se enviará a bodega para preparación.')) {
      return;
    }

    setProcessingOrder(orderId);
    try {
      await authApi.approveOrderAsAdmin(orderId);
      onOrderUpdate();
      alert('Pedido aprobado y enviado a bodega');
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Error al aprobar el pedido');
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt('Motivo del rechazo:');
    if (!reason) return;

    setProcessingOrder(orderId);
    try {
      await authApi.rejectOrder(orderId, reason, 'admin');
      onOrderUpdate();
      alert('Pedido rechazado');
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('Error al rechazar el pedido');
    } finally {
      setProcessingOrder(null);
    }
  };

  // Filtrar solo pedidos pendientes de aprobación admin
  const pendingOrders = orders.filter(
    o => o.status === 'pendiente_admin' || o.status === 'aprobado_vendedor'
  );

  if (pendingOrders.length === 0) {
    return (
      <div className="order-approval__empty">
        <div className="empty-state">
          <span className="empty-state__icon">✅</span>
          <h3>No hay pedidos pendientes de aprobación</h3>
          <p>Todos los pedidos han sido revisados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-approval">
      <div className="order-approval__header">
        <h2>Pedidos Pendientes de Aprobación</h2>
        <p className="order-approval__count">
          {pendingOrders.length} pedido{pendingOrders.length !== 1 ? 's' : ''} pendiente{pendingOrders.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="order-approval__list">
        {pendingOrders.map(order => {
          const isExpanded = expandedOrder === order.id;
          const isProcessing = processingOrder === order.id;
          const orderItems = order.items || order.products || [];

          return (
            <div key={order.id} className={`order-card ${isExpanded ? 'order-card--expanded' : ''}`}>
              <div className="order-card__header" onClick={() => toggleOrderExpand(order.id)}>
                <div className="order-card__info">
                  <div className="order-card__number">
                    <strong>#{order.orderNumber}</strong>
                    <span className="status-badge status-badge--pending-admin">
                      🔍 Aprobado por Vendedor - Requiere Aprobación
                    </span>
                  </div>
                  <div className="order-card__customer">
                    <span className="label">Cliente:</span> {order.customerName} - {order.organization}
                  </div>
                  <div className="order-card__date">
                    <span className="label">Recibido:</span> {formatDate(order.date)}
                  </div>
                  {order.vendorApprovedAt && (
                    <div className="order-card__vendor-approval">
                      <span className="label">✅ Aprobado por vendedor:</span> {formatDate(order.vendorApprovedAt)}
                    </div>
                  )}
                </div>

                <div className="order-card__summary">
                  <div className="order-card__items">
                    {orderItems.length} producto{orderItems.length !== 1 ? 's' : ''}
                  </div>
                  <div className="order-card__total">
                    {formatCurrency(order.total)}
                  </div>
                  <button className="expand-btn" type="button">
                    {isExpanded ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="order-card__details">
                  {/* Historial de aprobaciones */}
                  {(order.vendorApprovedAt || order.vendorNotes) && (
                    <div className="detail-section">
                      <h4>📝 Revisión del Vendedor</h4>
                      <div className="approval-info">
                        {order.vendorApprovedAt && (
                          <div className="approval-info__item">
                            <span className="label">Fecha de Aprobación:</span>
                            <span>{formatDate(order.vendorApprovedAt)}</span>
                          </div>
                        )}
                        {order.vendorNotes && (
                          <div className="approval-info__item">
                            <span className="label">Notas del Vendedor:</span>
                            <p className="notes">{order.vendorNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información del cliente */}
                  <div className="detail-section">
                    <h4>👤 Información del Cliente</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Nombre:</span>
                        <span>{order.customerName}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Email:</span>
                        <span>{order.customerEmail}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Teléfono:</span>
                        <span>{order.customerPhone}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Organización:</span>
                        <span>{order.organization}</span>
                      </div>
                      {order.taxId && (
                        <div className="info-item">
                          <span className="label">RUT:</span>
                          <span>{order.taxId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Productos */}
                  <div className="detail-section">
                    <h4>📦 Productos del Pedido</h4>
                    <div className="product-list">
                      {orderItems.map((item) => {
                        const itemId = item.productId || item.id || '';
                        const itemName = item.name || item.productName || '';
                        const itemPrice = item.price || item.unitPrice || 0;
                        const itemSubtotal = item.subtotal || (item.quantity * itemPrice);

                        return (
                          <div key={itemId} className="product-item">
                            <div className="product-item__info">
                              <span className="product-name">{itemName}</span>
                              <span className="product-details">
                                Cantidad: {item.quantity} × {formatCurrency(itemPrice)}
                              </span>
                            </div>
                            <div className="product-item__subtotal">
                              {formatCurrency(itemSubtotal)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Totales */}
                  <div className="detail-section">
                    <h4>💰 Resumen Financiero</h4>
                    <div className="cost-summary">
                      <div className="cost-row">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="cost-row cost-row--discount">
                          <span>Descuento:</span>
                          <span>-{formatCurrency(order.discount)}</span>
                        </div>
                      )}
                      <div className="cost-row">
                        <span>Impuestos (IVA 19%):</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                      {order.shippingCost > 0 && (
                        <div className="cost-row">
                          <span>Costo de Envío:</span>
                          <span>{formatCurrency(order.shippingCost)}</span>
                        </div>
                      )}
                      <div className="cost-row cost-row--total">
                        <span><strong>Total a Facturar:</strong></span>
                        <span><strong>{formatCurrency(order.total)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Condiciones comerciales */}
                  <div className="detail-section">
                    <h4>📋 Condiciones Comerciales</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Método de Pago:</span>
                        <span className="payment-method">
                          {order.paymentMethod === 'transferencia' && '🏦 Transferencia Bancaria'}
                          {order.paymentMethod === 'credito_30' && '💳 Crédito 30 días'}
                          {order.paymentMethod === 'credito_60' && '💳 Crédito 60 días'}
                          {order.paymentMethod === 'credito_90' && '💳 Crédito 90 días'}
                          {order.paymentMethod === 'efectivo' && '💵 Efectivo'}
                          {order.paymentMethod === 'cheque' && '📝 Cheque'}
                          {order.paymentMethod === 'tarjeta' && '💳 Tarjeta'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="label">Dirección de Envío:</span>
                        <span>
                          {order.shippingAddress.address || order.shippingAddress.street}, 
                          {order.shippingAddress.city}, {order.shippingAddress.region || order.shippingAddress.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de aprobación */}
                  <div className="order-card__actions">
                    <button
                      className="btn btn--reject"
                      onClick={() => handleReject(order.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Procesando...' : '❌ Rechazar Pedido'}
                    </button>
                    <button
                      className="btn btn--approve"
                      onClick={() => handleApprove(order.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Procesando...' : '✅ Aprobar y Enviar a Bodega'}
                    </button>
                  </div>

                  {/* Advertencia de responsabilidad */}
                  <div className="approval-warning">
                    <strong>⚠️ Importante:</strong> Al aprobar este pedido, autoriza el procesamiento, 
                    preparación y envío. Verifica que la información comercial y financiera sea correcta.
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
