import { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/authStore';
import { authApi } from '../../features/auth/authApi';
import { Order, User } from '../../features/auth/types';
import { StockItem } from '../../features/inventory/types';
import { inventoryStore } from '../../features/inventory/inventoryStore';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { OrderManagement } from '../../components/admin/OrderManagement';
import { UserManagement } from '../../components/admin/UserManagement';
import { StockUploader } from '../../components/admin/StockUploader';
import { InventoryManagement } from '../../components/admin/InventoryManagement';
import Loader from '../../components/ui/Loader';
import { Navigate } from 'react-router-dom';

export function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Array<Omit<User, 'password'>>>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'inventory'>('overview');

  // Verificar permisos
  if (user && user.role !== 'admin' && user.role !== 'root') {
    return <Navigate to="/portal-socios" replace />;
  }

  useEffect(() => {
    loadData();
    
    // Suscribirse a cambios en el inventario
    const unsubscribe = inventoryStore.subscribe((items) => {
      setStockItems(items);
    });
    
    // Cargar inventario inicial
    setStockItems(inventoryStore.getItems());
    
    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, usersData] = await Promise.all([
        authApi.getOrders(),
        authApi.getAllUsers()
      ]);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  // Calcular estadísticas
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status !== 'cancelado') return sum + order.total;
    return sum;
  }, 0);

  const activeOrders = orders.filter(o => 
    o.status !== 'entregado' && o.status !== 'cancelado'
  ).length;

  const completedOrders = orders.filter(o => o.status === 'entregado').length;
  const totalPartners = users.filter(u => u.role === 'socio').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header__info">
          <h1>Panel de Administración</h1>
          <p className="muted">
            Bienvenido, {user.name} 
            <span className="admin-badge">{user.role === 'root' ? '🔧 ROOT' : '👑 ADMIN'}</span>
          </p>
        </div>
        <button onClick={logout} className="btn btn-secondary">
          Cerrar Sesión
        </button>
      </div>

      {user.role === 'root' && (
        <div className="root-notice">
          <span className="root-notice__icon">⚠️</span>
          <div>
            <strong>Acceso Root</strong>
            <p>Tienes acceso completo al sistema como desarrollador</p>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Resumen
        </button>
        <button
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Pedidos ({orders.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios ({users.length})
        </button>
        {user.role === 'root' && (
          <button
            className={`admin-tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            🏭 Inventario ({stockItems.length})
          </button>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="admin-overview">
              <div className="admin-stats-grid">
                <AdminStatCard
                  title="Ingresos Totales"
                  value={formatCurrency(totalRevenue)}
                  icon="💰"
                  change={{ value: '+12.5%', isPositive: true }}
                  color="var(--color-primary)"
                />
                <AdminStatCard
                  title="Pedidos Activos"
                  value={activeOrders}
                  icon="📦"
                  change={{ value: '+3', isPositive: true }}
                  color="#2196F3"
                />
                <AdminStatCard
                  title="Pedidos Completados"
                  value={completedOrders}
                  icon="✅"
                  change={{ value: '+8', isPositive: true }}
                  color="#4CAF50"
                />
                <AdminStatCard
                  title="Socios Activos"
                  value={totalPartners}
                  icon="🤝"
                  color="#9C27B0"
                />
              </div>

              <div className="admin-overview-sections">
                <section className="admin-section">
                  <h2>Resumen de Pedidos por Estado</h2>
                  <div className="status-summary-grid">
                    {[
                      { status: 'pendiente', label: 'Pendientes', color: '#FFA500', icon: '⏳' },
                      { status: 'en-preparacion', label: 'En Preparación', color: '#2196F3', icon: '📦' },
                      { status: 'en-transito', label: 'En Tránsito', color: '#9C27B0', icon: '🚚' },
                      { status: 'entregado', label: 'Entregados', color: '#4CAF50', icon: '✅' },
                      { status: 'cancelado', label: 'Cancelados', color: '#F44336', icon: '❌' }
                    ].map(({ status, label, color, icon }) => {
                      const count = orders.filter(o => o.status === status).length;
                      return (
                        <div key={status} className="status-summary-card">
                          <div className="status-summary-card__icon" style={{ backgroundColor: color }}>
                            {icon}
                          </div>
                          <div className="status-summary-card__content">
                            <div className="status-summary-card__value">{count}</div>
                            <div className="status-summary-card__label">{label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="admin-section">
                  <h2>Actividad Reciente</h2>
                  <div className="activity-list">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="activity-item">
                        <div className="activity-item__icon">📦</div>
                        <div className="activity-item__content">
                          <strong>{order.orderNumber}</strong>
                          <span className="muted">
                            {new Date(order.date).toLocaleDateString('es-CL')} - {formatCurrency(order.total)}
                          </span>
                        </div>
                        <span className="activity-item__status">{order.status}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <OrderManagement orders={orders} onOrderUpdate={loadData} />
          )}

          {activeTab === 'users' && (
            <UserManagement users={users} />
          )}

          {activeTab === 'inventory' && user.role === 'root' && (
            <div className="inventory-section">
              <StockUploader onUploadComplete={(items) => setStockItems(items)} />
              {stockItems.length > 0 && (
                <InventoryManagement items={stockItems} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
