import { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/authStore';
import { authApi } from '../../features/auth/authApi';
import { Order, User } from '../../features/auth/types';
import { StockItem } from '../../features/inventory/types';
import { inventoryStore } from '../../features/inventory/inventoryStore';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { OrderManagement } from '../../components/admin/OrderManagement';
import { OrderApproval } from '../../components/admin/OrderApproval';
import { UserManagement } from '../../components/admin/UserManagement';
import { StockUploader } from '../../components/admin/StockUploader';
import { InventoryManagement } from '../../components/admin/InventoryManagement';
import { SalesChart } from '../../components/analytics/SalesChart';
import { PieChart } from '../../components/analytics/PieChart';
import Loader from '../../components/ui/Loader';
import { FadeIn } from '../../components/ui/FadeIn';
import { Navigate } from 'react-router-dom';
import './AdminDashboard.css';

export function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Array<Omit<User, 'password'>>>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'orders' | 'users' | 'inventory'>('overview');

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
  
  // Calcular pedidos pendientes de aprobación
  const pendingApprovals = orders.filter(
    o => o.status === 'pendiente_admin' || o.status === 'aprobado_vendedor'
  ).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="admin-dashboard">
      <FadeIn direction="up">
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
      </FadeIn>

      {user.role === 'root' && (
        <FadeIn direction="up" delay={0.1}>
          <div className="root-notice">
          <span className="root-notice__icon">⚠️</span>
          <div>
            <strong>Acceso Root</strong>
            <p>Tienes acceso completo al sistema como desarrollador</p>
          </div>
        </div>
        </FadeIn>
      )}

      <FadeIn direction="up" delay={0.2}>
        <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Resumen
        </button>
        <button
          className={`admin-tab ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >
          ✅ Aprobaciones {pendingApprovals > 0 && <span className="badge">{pendingApprovals}</span>}
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
      </FadeIn>

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
                      { status: 'confirmado', label: 'Confirmados', color: '#00BCD4', icon: '✓' },
                      { status: 'procesando', label: 'Procesando', color: '#2196F3', icon: '📦' },
                      { status: 'enviado', label: 'Enviados', color: '#9C27B0', icon: '🚚' },
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

                {/* Gráficos de Analytics */}
                <section className="admin-section admin-analytics">
                  <h2>Análisis de Ventas</h2>
                  <div className="analytics-grid">
                    <SalesChart
                      title="Ventas por Mes"
                      data={[
                        { label: 'Ene', value: Math.floor(totalRevenue * 0.15) },
                        { label: 'Feb', value: Math.floor(totalRevenue * 0.12) },
                        { label: 'Mar', value: Math.floor(totalRevenue * 0.18) },
                        { label: 'Abr', value: Math.floor(totalRevenue * 0.14) },
                        { label: 'May', value: Math.floor(totalRevenue * 0.20) },
                        { label: 'Jun', value: Math.floor(totalRevenue * 0.21) },
                      ]}
                      color="linear-gradient(135deg, var(--color-primary) 0%, #c2185b 100%)"
                    />
                    <PieChart
                      title="Pedidos por Estado"
                      data={[
                        {
                          label: 'Entregados',
                          value: orders.filter((o) => o.status === 'entregado').length,
                          color: '#4CAF50',
                        },
                        {
                          label: 'Enviados',
                          value: orders.filter((o) => o.status === 'enviado').length,
                          color: '#9C27B0',
                        },
                        {
                          label: 'Procesando',
                          value: orders.filter((o) => o.status === 'procesando').length,
                          color: '#2196F3',
                        },
                        {
                          label: 'Pendientes',
                          value: orders.filter((o) => o.status === 'pendiente').length,
                          color: '#FFA500',
                        },
                        {
                          label: 'Cancelados',
                          value: orders.filter((o) => o.status === 'cancelado').length,
                          color: '#F44336',
                        },
                      ]}
                    />
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

          {activeTab === 'approvals' && (
            <div className="admin-approvals">
              <div className="admin-section">
                <OrderApproval orders={orders} onOrderUpdate={loadData} />
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <OrderManagement orders={orders} onOrderUpdate={loadData} />
          )}

          {activeTab === 'users' && user && (
            <UserManagement users={users} currentUser={user} onUsersChange={loadData} />
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
