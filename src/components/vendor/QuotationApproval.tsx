import { useState } from 'react';
import { Order } from '../../features/auth/types';
import { authApi } from '../../features/auth/authApi';
import './QuotationApproval.css';

interface QuotationApprovalProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

export function QuotationApproval({ orders, onOrderUpdate }: QuotationApprovalProps) {
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
    if (!confirm('¿Aprobar esta cotización? Se enviará a admin para aprobación final.')) {
      return;
    }

    setProcessingOrder(orderId);
    try {
      await authApi.approveQuotationAsVendor(orderId);
      onOrderUpdate();
      alert('Cotización aprobada y enviada a administración');
    } catch (error) {
      console.error('Error approving quotation:', error);
      alert('Error al aprobar la cotización');
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt('Motivo del rechazo:');
    if (!reason) return;

    setProcessingOrder(orderId);
    try {
      await authApi.rejectOrder(orderId, reason, 'vendedor');
      onOrderUpdate();
      alert('Cotización rechazada');
    } catch (error) {
      console.error('Error rejecting quotation:', error);
      alert('Error al rechazar la cotización');
    } finally {
      setProcessingOrder(null);
    }
  };

  // Filtrar solo cotizaciones y pedidos pendientes de vendedor
  const pendingQuotations = orders.filter(
    o => o.status === 'cotizacion' || o.status === 'pendiente_vendedor'
  );

  if (pendingQuotations.length === 0) {
    return (
      <div className="quotation-approval__empty">
        <div className="empty-state">
          <span className="empty-state__icon">✅</span>
          <h3>No hay cotizaciones pendientes</h3>
          <p>Todas las cotizaciones han sido revisadas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quotation-approval">
      <div className="quotation-approval__header">
        <h2>Cotizaciones Pendientes de Revisión</h2>
        <p className="quotation-approval__count">
          {pendingQuotations.length} cotización{pendingQuotations.length !== 1 ? 'es' : ''} pendiente{pendingQuotations.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="quotation-approval__list">
        {pendingQuotations.map(order => {
          const isExpanded = expandedOrder === order.id;
          const isProcessing = processingOrder === order.id;
          const orderItems = order.items || order.products || [];

          return (
            <div key={order.id} className={`quotation-card ${isExpanded ? 'quotation-card--expanded' : ''}`}>
              <div className="quotation-card__header" onClick={() => toggleOrderExpand(order.id)}>
                <div className="quotation-card__info">
                  <div className="quotation-card__number">
                    <strong>#{order.orderNumber}</strong>
                    <span className="status-badge status-badge--pending">
                      {order.status === 'cotizacion' ? '📋 Nueva' : '⏳ Pendiente'}
                    </span>
                  </div>
                  <div className="quotation-card__customer">
                    <span className="label">Cliente:</span> {order.customerName} - {order.organization}
                  </div>
                  <div className="quotation-card__date">
                    <span className="label">Fecha:</span> {formatDate(order.date)}
                  </div>
                </div>

                <div className="quotation-card__summary">
                  <div className="quotation-card__items">
                    {orderItems.length} producto{orderItems.length !== 1 ? 's' : ''}
                  </div>
                  <div className="quotation-card__total">
                    {formatCurrency(order.total)}
                  </div>
                  <button className="expand-btn" type="button">
                    {isExpanded ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="quotation-card__details">
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

                  {/* Productos solicitados */}
                  <div className="detail-section">
                    <h4>📦 Productos Solicitados</h4>
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
                    <h4>💰 Resumen de Costos</h4>
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
                        <span>Impuestos:</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                      {order.shippingCost > 0 && (
                        <div className="cost-row">
                          <span>Envío:</span>
                          <span>{formatCurrency(order.shippingCost)}</span>
                        </div>
                      )}
                      <div className="cost-row cost-row--total">
                        <span><strong>Total:</strong></span>
                        <span><strong>{formatCurrency(order.total)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Información de pago y envío */}
                  <div className="detail-section">
                    <h4>📋 Condiciones Comerciales</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Método de Pago:</span>
                        <span>
                          {order.paymentMethod === 'transferencia' && 'Transferencia Bancaria'}
                          {order.paymentMethod === 'credito_30' && 'Crédito 30 días'}
                          {order.paymentMethod === 'credito_60' && 'Crédito 60 días'}
                          {order.paymentMethod === 'credito_90' && 'Crédito 90 días'}
                          {order.paymentMethod === 'efectivo' && 'Efectivo'}
                          {order.paymentMethod === 'cheque' && 'Cheque'}
                          {order.paymentMethod === 'tarjeta' && 'Tarjeta'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="label">Dirección de Envío:</span>
                        <span>{order.shippingAddress.address || order.shippingAddress.street}, {order.shippingAddress.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="quotation-card__actions">
                    <button
                      className="btn btn--reject"
                      onClick={() => handleReject(order.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Procesando...' : '❌ Rechazar'}
                    </button>
                    <button
                      className="btn btn--approve"
                      onClick={() => handleApprove(order.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Procesando...' : '✅ Aprobar y Enviar a Admin'}
                    </button>
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
