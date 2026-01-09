import { useState, FormEvent } from 'react';
import { Order } from '../../features/auth/types';
import { authApi } from '../../features/auth/authApi';
import './OrderPreparation.css';

interface OrderPreparationProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

export function OrderPreparation({ orders, onOrderUpdate }: OrderPreparationProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, Set<string>>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [draftFilters, setDraftFilters] = useState({
    status: 'all',
    from: '',
    to: ''
  });
  const [filters, setFilters] = useState(draftFilters);

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

  const toggleItemCheck = (orderId: string, itemId: string) => {
    setCheckedItems(prev => {
      const newChecked = { ...prev };
      const currentSet = new Set(newChecked[orderId] || []);
      
      if (currentSet.has(itemId)) {
        currentSet.delete(itemId);
      } else {
        currentSet.add(itemId);
      }
      
      newChecked[orderId] = currentSet;
      return newChecked;
    });
  };

  const handleStartPreparation = async (orderId: string) => {
    setUpdatingOrder(orderId);
    try {
      await authApi.updateOrderStatus(orderId, 'procesando');
      onOrderUpdate();
    } catch (error) {
      console.error('Error starting preparation:', error);
      alert('Error al iniciar la preparación');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleCompletePreparation = async (order: Order) => {
    const orderCheckedItems = checkedItems[order.id] || new Set();
    const orderItems = order.items || order.products || [];
    const allItemsChecked = orderItems.every(item => 
      orderCheckedItems.has(item.productId || item.id || '')
    );

    if (!allItemsChecked) {
      alert('Debes verificar todos los productos antes de completar la preparación');
      return;
    }

    setUpdatingOrder(order.id);
    try {
      // Cambiar estado a procesando (listo para despacho)
      await authApi.updateOrderStatus(order.id, 'procesando');
      setCheckedItems(prev => {
        const newChecked = { ...prev };
        delete newChecked[order.id];
        return newChecked;
      });
      onOrderUpdate();
      alert('Pedido preparado y listo para despacho');
    } catch (error) {
      console.error('Error completing preparation:', error);
      alert('Error al completar la preparación');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig: Partial<Record<Order['status'], { label: string; color: string; icon: string }>> = {
      confirmado: { label: 'Confirmado', color: '#00BCD4', icon: '✓' },
      procesando: { label: 'En Preparación', color: '#2196F3', icon: '⚙️' }
    };
    const config = statusConfig[status];
    if (!config) return null;

    return (
      <span className="status-badge" style={{ backgroundColor: config.color }}>
        <span>{config.icon}</span> {config.label}
      </span>
    );
  };

  const getPriorityBadge = (order: Order) => {
    const orderDate = new Date(order.date);
    const now = new Date();
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 48) {
      return <span className="priority-badge priority-badge--high">⚠️ Urgente</span>;
    } else if (hoursDiff > 24) {
      return <span className="priority-badge priority-badge--medium">⏰ Prioritario</span>;
    }
    return null;
  };

  const filteredOrders = orders.filter((order) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const orderDate = new Date(order.date);
    const fromDate = filters.from ? new Date(`${filters.from}T00:00:00`) : null;
    const toDate = filters.to ? new Date(`${filters.to}T23:59:59`) : null;
    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    const matchesFrom = !fromDate || orderDate >= fromDate;
    const matchesTo = !toDate || orderDate <= toDate;
    const matchesSearch = !normalizedSearch ||
      order.orderNumber.toLowerCase().includes(normalizedSearch) ||
      order.customerName.toLowerCase().includes(normalizedSearch) ||
      order.customerEmail.toLowerCase().includes(normalizedSearch) ||
      order.organization.toLowerCase().includes(normalizedSearch);

    return matchesStatus && matchesFrom && matchesTo && matchesSearch;
  });

  const handleApplyFilters = (event: FormEvent) => {
    event.preventDefault();
    setFilters(draftFilters);
  };

  const handleClearFilters = () => {
    const reset = { status: 'all', from: '', to: '' };
    setDraftFilters(reset);
    setFilters(reset);
    setSearchTerm('');
  };

  if (orders.length === 0) {
    return (
      <div className="order-preparation__empty">
        <div className="empty-state">
          <span className="empty-state__icon">✅</span>
          <h3>No hay pedidos pendientes</h3>
          <p>Todos los pedidos están preparados o despachados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-preparation">
      <div className="order-preparation__header">
        <div>
          <h2>Pedidos para Preparar</h2>
          <p className="order-preparation__count">
            {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} mostrado{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn btn--ghost" type="button" onClick={handleClearFilters}>
          Limpiar filtros
        </button>
      </div>

      <form className="order-preparation__filters" onSubmit={handleApplyFilters}>
        <div className="filter-group">
          <label>Estado</label>
          <select
            value={draftFilters.status}
            onChange={(event) => setDraftFilters(prev => ({ ...prev, status: event.target.value }))}
          >
            <option value="all">Todos</option>
            <option value="confirmado">Confirmado</option>
            <option value="procesando">En preparación</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Desde</label>
          <input
            type="date"
            value={draftFilters.from}
            onChange={(event) => setDraftFilters(prev => ({ ...prev, from: event.target.value }))}
          />
        </div>
        <div className="filter-group">
          <label>Hasta</label>
          <input
            type="date"
            value={draftFilters.to}
            onChange={(event) => setDraftFilters(prev => ({ ...prev, to: event.target.value }))}
          />
        </div>
        <button className="btn btn--primary" type="submit">
          Filtrar
        </button>
      </form>

      <div className="order-preparation__search">
        <input
          type="search"
          placeholder="Buscar por pedido, cliente u organización"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="order-preparation__table">
        <div className="order-preparation__table-head">
          <span>Documento</span>
          <span>Cliente</span>
          <span>Fecha Doc.</span>
          <span>Total</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        {filteredOrders.length === 0 && (
          <div className="order-preparation__empty-state">
            No hay pedidos con los filtros actuales.
          </div>
        )}

        {filteredOrders.map(order => {
          const isExpanded = expandedOrder === order.id;
          const orderCheckedItems = checkedItems[order.id] || new Set();
          const checkedCount = orderCheckedItems.size;
          const orderItems = order.items || order.products || [];
          const totalItems = orderItems.length;
          const isUpdating = updatingOrder === order.id;

          return (
            <div key={order.id} className="order-preparation__row-group">
              <div className={`order-preparation__row ${isExpanded ? 'is-expanded' : ''}`}>
                <div className="order-preparation__cell order-preparation__cell--doc">
                  <span className="doc-icon">📄</span>
                  <div>
                    <div className="doc-number">
                      #{order.orderNumber} {getPriorityBadge(order)}
                    </div>
                    <div className="doc-subtitle">{order.organization}</div>
                  </div>
                </div>
                <div className="order-preparation__cell">
                  <div className="client-name">{order.customerName}</div>
                  <div className="client-email">{order.customerEmail}</div>
                </div>
                <div className="order-preparation__cell">
                  {formatDate(order.date)}
                </div>
                <div className="order-preparation__cell total-cell">
                  {formatCurrency(order.total)}
                </div>
                <div className="order-preparation__cell">
                  {getStatusBadge(order.status)}
                  <div className="items-count">
                    {totalItems} producto{totalItems !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="order-preparation__cell order-preparation__cell--actions">
                  <button
                    className="row-link"
                    type="button"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    {isExpanded ? 'Ocultar' : 'Ver'}
                  </button>
                  {order.status === 'confirmado' ? (
                    <button
                      className="btn btn--primary btn--compact"
                      onClick={() => handleStartPreparation(order.id)}
                      disabled={isUpdating}
                      type="button"
                    >
                      {isUpdating ? 'Procesando...' : 'Iniciar'}
                    </button>
                  ) : (
                    <button
                      className="btn btn--success btn--compact"
                      onClick={() => handleCompletePreparation(order)}
                      disabled={isUpdating || checkedCount < totalItems}
                      type="button"
                    >
                      {isUpdating ? 'Procesando...' : 'Completar'}
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="order-card__details">
                  {/* Información del cliente */}
                  <div className="order-card__section">
                    <h4>Información del Cliente</h4>
                    <div className="info-grid">
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
                    </div>
                  </div>

                  {/* Dirección de envío */}
                  <div className="order-card__section">
                    <h4>Dirección de Envío</h4>
                    <div className="shipping-address">
                      <p><strong>{order.shippingAddress.fullName}</strong></p>
                      <p>{order.shippingAddress.address}</p>
                      {order.shippingAddress.apartment && (
                        <p>{order.shippingAddress.apartment}</p>
                      )}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.region}
                      </p>
                      <p>{order.shippingAddress.postalCode}</p>
                      {order.shippingAddress.phone && (
                        <p>Tel: {order.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Lista de productos a preparar */}
                  <div className="order-card__section">
                    <h4>Productos a Preparar</h4>
                    <div className="preparation-checklist">
                      {orderItems.map((item) => {
                        const itemId = item.productId || item.id || '';
                        const itemName = item.name || item.productName || '';
                        const itemSku = item.sku || '';
                        const isChecked = orderCheckedItems.has(itemId);
                        return (
                          <div 
                            key={itemId} 
                            className={`checklist-item ${isChecked ? 'checklist-item--checked' : ''}`}
                          >
                            <input
                              type="checkbox"
                              id={`${order.id}-${itemId}`}
                              checked={isChecked}
                              onChange={() => toggleItemCheck(order.id, itemId)}
                              disabled={isUpdating}
                            />
                            <label htmlFor={`${order.id}-${itemId}`}>
                              <div className="checklist-item__info">
                                <span className="checklist-item__name">
                                  {itemName}
                                </span>
                                <span className="checklist-item__sku">
                                  SKU: {itemSku}
                                </span>
                              </div>
                              <div className="checklist-item__quantity">
                                <span className="quantity-badge">
                                  x{item.quantity}
                                </span>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    
                    {checkedCount > 0 && (
                      <div className="preparation-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-bar__fill" 
                            style={{ width: `${(checkedCount / totalItems) * 100}%` }}
                          />
                        </div>
                        <p className="progress-text">
                          {checkedCount} de {totalItems} productos verificados
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="order-card__actions">
                    {order.status === 'confirmado' ? (
                      <button
                        className="btn btn--primary"
                        onClick={() => handleStartPreparation(order.id)}
                        disabled={isUpdating}
                        type="button"
                      >
                        {isUpdating ? 'Procesando...' : '▶️ Iniciar Preparación'}
                      </button>
                    ) : (
                      <button
                        className="btn btn--success"
                        onClick={() => handleCompletePreparation(order)}
                        disabled={isUpdating || checkedCount < totalItems}
                        type="button"
                      >
                        {isUpdating ? 'Procesando...' : '✅ Completar Preparación'}
                      </button>
                    )}
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
