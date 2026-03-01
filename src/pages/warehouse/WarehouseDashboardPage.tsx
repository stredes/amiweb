import { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/authStore';
import { Order } from '../../features/auth/types';
import { authApi } from '../../features/auth/authApi';
import Loader from '../../components/ui/Loader';
import { OrderPreparation, ShippingManagement, WarehouseStock } from '../../components/warehouse';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import './WarehouseDashboardPage.css';

export function WarehouseDashboardPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'preparation' | 'shipping' | 'stock'>('preparation');
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    readyToShip: 0,
    shipped: 0
  });

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await authApi.getOrders();
      // Filtrar solo pedidos confirmados en adelante (bodega no debe ver cotizaciones ni pendientes de aprobación)
      const warehouseOrders = data.filter((o: Order) => 
        ['confirmado', 'procesando', 'enviado', 'entregado'].includes(o.status)
      );
      setOrders(warehouseOrders);
      
      // Calcular estadísticas solo de pedidos que le corresponden a bodega
      const stats = {
        pending: warehouseOrders.filter((o: Order) => o.status === 'confirmado').length,
        processing: warehouseOrders.filter((o: Order) => o.status === 'procesando').length,
        readyToShip: warehouseOrders.filter((o: Order) => o.status === 'procesando' && o.shippingAddress).length,
        shipped: warehouseOrders.filter((o: Order) => o.status === 'enviado').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'bodega') {
      setIsLoading(false);
      return;
    }
    loadOrders();
  }, [user]);

  if (isLoading) {
    return (
      <div className="warehouse-dashboard__loading">
        <Loader />
      </div>
    );
  }
  if (!user) return null;
  if (user.role !== 'bodega') {
    if (user.role === 'root') {
      return <Navigate to={ROUTES.rootDashboard} replace />;
    }
    if (user.role === 'admin') {
      return <Navigate to={ROUTES.adminDashboard} replace />;
    }
    if (user.role === 'vendedor') {
      return <Navigate to={ROUTES.vendorDashboard} replace />;
    }
    return <Navigate to={ROUTES.partnerPortal} replace />;
  }

  // Filtrar pedidos según la pestaña activa
  const preparationOrders = orders.filter(
    (o: Order) => o.status === 'confirmado' || o.status === 'procesando'
  );
  
  const shippingOrders = orders.filter(
    (o: Order) => o.status === 'procesando' || o.status === 'enviado'
  );

  return (
    <div className="warehouse-dashboard" style={{ backgroundColor: '#F5F5DC', minHeight: '100vh', padding: '2rem' }}>
      <div className="warehouse-dashboard__header">
        <div className="warehouse-dashboard__welcome">
          <h1 style={{ color: '#2D1619', fontSize: '2rem' }}>Dashboard de Bodega</h1>
          <p style={{ color: '#5A3940', fontSize: '1.1rem' }}>Bienvenido, {user?.name || 'Usuario'}</p>
        </div>
        <button onClick={logout} className="btn btn-secondary">
          Cerrar Sesión
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="warehouse-dashboard__stats">
        <div className="stat-card stat-card--pending" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <div className="stat-card__icon">📦</div>
          <div className="stat-card__info">
            <h3 style={{ color: '#2D1619' }}>{stats.pending}</h3>
            <p>Por Preparar</p>
          </div>
        </div>
        <div className="stat-card stat-card--processing" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <div className="stat-card__icon">⚙️</div>
          <div className="stat-card__info">
            <h3 style={{ color: '#2D1619' }}>{stats.processing}</h3>
            <p>En Preparación</p>
          </div>
        </div>
        <div className="stat-card stat-card--ready" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <div className="stat-card__icon">✅</div>
          <div className="stat-card__info">
            <h3 style={{ color: '#2D1619' }}>{stats.readyToShip}</h3>
            <p>Listos para Despacho</p>
          </div>
        </div>
        <div className="stat-card stat-card--shipped" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <div className="stat-card__icon">🚚</div>
          <div className="stat-card__info">
            <h3 style={{ color: '#2D1619' }}>{stats.shipped}</h3>
            <p>Despachados</p>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="warehouse-dashboard__tabs">
        <button
          className={`tab ${activeTab === 'preparation' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('preparation')}
        >
          <span className="tab__icon">📋</span>
          Preparación de Pedidos
          {stats.pending + stats.processing > 0 && (
            <span className="tab__badge">{stats.pending + stats.processing}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'shipping' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('shipping')}
        >
          <span className="tab__icon">🚚</span>
          Gestión de Despachos
          {stats.readyToShip > 0 && (
            <span className="tab__badge">{stats.readyToShip}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'stock' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          <span className="tab__icon">📦</span>
          Stock físico
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="warehouse-dashboard__content">
        {activeTab === 'preparation' && (
          <OrderPreparation orders={preparationOrders} onOrderUpdate={loadOrders} />
        )}
        {activeTab === 'shipping' && (
          <ShippingManagement orders={shippingOrders} onOrderUpdate={loadOrders} />
        )}
        {activeTab === 'stock' && <WarehouseStock />}
      </div>
    </div>
  );
}

export default WarehouseDashboardPage;
