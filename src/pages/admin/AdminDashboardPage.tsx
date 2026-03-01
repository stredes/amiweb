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
import { toast } from '../../components/ui/Toast';
import { Navigate } from 'react-router-dom';
import './AdminDashboard.css';

export function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Array<Omit<User, 'password'>>>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'orders' | 'users' | 'inventory' | 'executive' | 'clients' | 'operations'>('overview');
  const [createUserTrigger, setCreateUserTrigger] = useState(0);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'root')) {
      setIsLoading(false);
      return;
    }

    loadData();
    
    // Suscribirse a cambios en el inventario
    const unsubscribe = inventoryStore.subscribe((items) => {
      setStockItems(items);
    });
    
    // Cargar inventario inicial
    setStockItems(inventoryStore.getItems());
    
    return () => unsubscribe();
  }, [user]);

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
  if (user.role !== 'admin' && user.role !== 'root') {
    return <Navigate to="/portal-socios" replace />;
  }

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

  const validOrders = orders.filter((order) => order.status !== 'cancelado');
  const cancelledOrders = orders.filter((order) => order.status === 'cancelado').length;
  const averageTicket = validOrders.length ? totalRevenue / validOrders.length : 0;
  const completionRateBase = completedOrders + cancelledOrders;
  const completionRate = completionRateBase > 0 ? (completedOrders / completionRateBase) * 100 : 0;
  const pendingOperationalOrders = orders.filter(
    (order) => order.status === 'pendiente' || order.status === 'confirmado' || order.status === 'procesando'
  ).length;
  const shippedOrders = orders.filter((order) => order.status === 'enviado').length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthOrders = validOrders.filter((order) => {
    const date = new Date(order.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  const monthRevenue = validOrders
    .filter((order) => {
      const date = new Date(order.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, order) => sum + order.total, 0);

  const topClients = Object.values(
    validOrders.reduce<Record<string, { email: string; name: string; total: number; orders: number }>>((acc, order) => {
      const key = order.customerEmail || order.customerName || order.id;
      if (!acc[key]) {
        acc[key] = {
          email: order.customerEmail || 'sin-email',
          name: order.customerName || 'Cliente sin nombre',
          total: 0,
          orders: 0,
        };
      }
      acc[key].total += order.total;
      acc[key].orders += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const inactiveUsers = users.filter((currentUser) => currentUser.isActive === false).length;

  const handleRefreshDashboard = async () => {
    await loadData();
    toast.success('Dashboard actualizado');
  };

  const handleExportOrders = () => {
    if (!orders.length) {
      toast.error('No hay pedidos para exportar');
      return;
    }

    const rows = [
      ['id', 'orderNumber', 'customerName', 'customerEmail', 'status', 'total', 'date'],
      ...orders.map((order) => [
        order.id,
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.status,
        order.total,
        order.date,
      ]),
    ];

    const csvContent = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `pedidos-admin-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(downloadUrl);
    toast.success('Exportación de pedidos completada');
  };

  const handleExportClientPortfolio = () => {
    if (!topClients.length) {
      toast.error('No hay cartera de clientes para exportar');
      return;
    }

    const rows = [
      ['name', 'email', 'orders', 'total', 'ticketPromedio'],
      ...topClients.map((client) => [
        client.name,
        client.email,
        client.orders,
        client.total,
        client.orders > 0 ? Math.round(client.total / client.orders) : 0,
      ]),
    ];

    const csvContent = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `cartera-clientes-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(downloadUrl);
    toast.success('Cartera de clientes exportada');
  };

  const handleExportExecutiveReport = () => {
    const report = [
      ['metric', 'value'],
      ['Ingresos totales', totalRevenue],
      ['Pedidos activos', activeOrders],
      ['Pedidos completados', completedOrders],
      ['Pedidos cancelados', cancelledOrders],
      ['Ticket promedio', Math.round(averageTicket)],
      ['Ventas del mes', monthRevenue],
      ['Pedidos del mes', monthOrders],
      ['Tasa de cumplimiento (%)', completionRate.toFixed(2)],
      ['Pendientes operativos', pendingOperationalOrders],
      ['Enviados sin cierre', shippedOrders],
    ];

    const csvContent = report.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `reporte-ejecutivo-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(downloadUrl);
    toast.success('Reporte ejecutivo exportado');
  };

  const handleOpenCreateUser = () => {
    if (user.role !== 'root') {
      toast.error('Solo root puede crear usuarios');
      setActiveTab('users');
      return;
    }

    setActiveTab('users');
    setCreateUserTrigger((previous) => previous + 1);
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

      {isLoading ? (
        <Loader />
      ) : (
        <div className="dashboard-shell">
          <aside className="dashboard-sidebar">
            <h3 className="dashboard-sidebar__title">
              {user.role === 'root' ? 'Herramientas Root' : 'Herramientas Admin'}
            </h3>
            <button
              className={`dashboard-sidebar__item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Resumen
            </button>
            <button
              className={`dashboard-sidebar__item ${activeTab === 'approvals' ? 'active' : ''}`}
              onClick={() => setActiveTab('approvals')}
            >
              ✅ Aprobaciones {pendingApprovals > 0 && <span className="badge">{pendingApprovals}</span>}
            </button>
            <button
              className={`dashboard-sidebar__item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Pedidos ({orders.length})
            </button>
            <button
              className={`dashboard-sidebar__item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Usuarios ({users.length})
            </button>
            <button
              className={`dashboard-sidebar__item ${activeTab === 'executive' ? 'active' : ''}`}
              onClick={() => setActiveTab('executive')}
            >
              💼 Ejecutivo
            </button>
            <button
              className={`dashboard-sidebar__item ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              🤝 Clientes
            </button>
            <button
              className={`dashboard-sidebar__item ${activeTab === 'operations' ? 'active' : ''}`}
              onClick={() => setActiveTab('operations')}
            >
              🏢 Operaciones
            </button>
            {user.role === 'root' && (
              <button
                className={`dashboard-sidebar__item ${activeTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setActiveTab('inventory')}
              >
                🏭 Inventario ({stockItems.length})
              </button>
            )}

            <div className="dashboard-sidebar__group-title">Acciones rápidas</div>
            <button className="dashboard-sidebar__action" onClick={handleRefreshDashboard}>
              🔄 Refrescar panel
            </button>
            <button className="dashboard-sidebar__action" onClick={() => setActiveTab('approvals')}>
              ✅ Ir a aprobaciones
            </button>
            <button className="dashboard-sidebar__action" onClick={handleExportExecutiveReport}>
              📊 Exportar reporte ejecutivo
            </button>
            <button className="dashboard-sidebar__action" onClick={handleExportOrders}>
              📥 Exportar pedidos
            </button>
            <button className="dashboard-sidebar__action" onClick={handleExportClientPortfolio}>
              🤝 Exportar cartera clientes
            </button>
            <button className="dashboard-sidebar__action" onClick={handleOpenCreateUser}>
              ➕ Crear usuario
            </button>
            <button className="dashboard-sidebar__action dashboard-sidebar__action--danger" onClick={logout}>
              ⏻ Cerrar sesión
            </button>
          </aside>

          <div className="dashboard-main admin-content">
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
            <UserManagement
              users={users}
              currentUser={user}
              onUsersChange={loadData}
              createUserTrigger={createUserTrigger}
            />
          )}

          {activeTab === 'inventory' && user.role === 'root' && (
            <div className="inventory-section">
              <StockUploader onUploadComplete={(items) => setStockItems(items)} />
              {stockItems.length > 0 && (
                <InventoryManagement items={stockItems} />
              )}
            </div>
          )}

          {activeTab === 'executive' && (
            <section className="admin-section root-tools-panel">
              <h2>Resumen Ejecutivo</h2>
              <div className="root-tools-grid">
                <article className="root-tool-card">
                  <h3>Ingresos del mes</h3>
                  <p>{formatCurrency(monthRevenue)}</p>
                </article>
                <article className="root-tool-card">
                  <h3>Pedidos del mes</h3>
                  <p>{monthOrders}</p>
                </article>
                <article className="root-tool-card">
                  <h3>Ticket promedio</h3>
                  <p>{formatCurrency(averageTicket)}</p>
                </article>
                <article className="root-tool-card">
                  <h3>Tasa de cumplimiento</h3>
                  <p>{completionRate.toFixed(1)}%</p>
                </article>
              </div>
              <div className="root-tools-actions">
                <button className="btn btn--secondary" onClick={handleExportExecutiveReport}>
                  Exportar reporte
                </button>
                <button className="btn btn--primary" onClick={handleRefreshDashboard}>
                  Refrescar datos
                </button>
              </div>
            </section>
          )}

          {activeTab === 'clients' && (
            <section className="admin-section root-tools-panel">
              <h2>Cartera de Clientes</h2>
              <div className="root-tools-grid">
                {topClients.length === 0 && (
                  <article className="root-tool-card">
                    <h3>Sin datos de clientes</h3>
                    <p>No hay ventas activas para calcular cartera.</p>
                  </article>
                )}
                {topClients.map((client) => (
                  <article key={client.email} className="root-tool-card">
                    <h3>{client.name}</h3>
                    <p>{client.email}</p>
                    <p>{client.orders} pedidos · {formatCurrency(client.total)}</p>
                  </article>
                ))}
              </div>
              <div className="root-tools-actions">
                <button className="btn btn--secondary" onClick={handleExportClientPortfolio}>
                  Exportar cartera
                </button>
                <button className="btn btn--primary" onClick={() => setActiveTab('orders')}>
                  Ir a pedidos
                </button>
              </div>
            </section>
          )}

          {activeTab === 'operations' && (
            <section className="admin-section root-tools-panel">
              <h2>Control Operativo</h2>
              <div className="root-tools-grid">
                <article className="root-tool-card">
                  <h3>Pendientes operativos</h3>
                  <p>{pendingOperationalOrders}</p>
                </article>
                <article className="root-tool-card">
                  <h3>En revisión de aprobación</h3>
                  <p>{pendingApprovals}</p>
                </article>
                <article className="root-tool-card">
                  <h3>En tránsito</h3>
                  <p>{shippedOrders}</p>
                </article>
                <article className="root-tool-card">
                  <h3>Usuarios inactivos</h3>
                  <p>{inactiveUsers}</p>
                </article>
              </div>
              <div className="root-tools-actions">
                <button className="btn btn--secondary" onClick={() => setActiveTab('approvals')}>
                  Gestionar aprobaciones
                </button>
                <button className="btn btn--primary" onClick={handleRefreshDashboard}>
                  Actualizar operación
                </button>
              </div>
            </section>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
