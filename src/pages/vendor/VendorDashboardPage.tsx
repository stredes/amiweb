import { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/authStore';
import { authApi } from '../../features/auth/authApi';
import { Order, User } from '../../features/auth/types';
import { SalesMetricCard } from '../../components/vendor/SalesMetricCard';
import { ClientCard } from '../../components/vendor/ClientCard';
import { VendorOrderList } from '../../components/vendor/VendorOrderList';
import Loader from '../../components/ui/Loader';
import { FadeIn } from '../../components/ui/FadeIn';
import { Navigate } from 'react-router-dom';
import './VendorDashboard.css';

export function VendorDashboardPage() {
  const { user, logout } = useAuth();
  const [clients, setClients] = useState<Array<Omit<User, 'password'>>>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'orders'>('overview');

  // Verificar permisos
  if (user && user.role !== 'vendedor') {
    if (user.role === 'admin' || user.role === 'root') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/portal-socios" replace />;
  }

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [clientsData, ordersData] = await Promise.all([
        authApi.getVendorClients(user.id),
        authApi.getVendorOrders(user.id)
      ]);
      setClients(clientsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading vendor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  // Calcular métricas
  const totalSales = orders.reduce((sum, order) => {
    if (order.status !== 'cancelado') return sum + order.total;
    return sum;
  }, 0);

  const activeOrders = orders.filter(o => 
    o.status !== 'entregado' && o.status !== 'cancelado'
  ).length;

  const completedOrders = orders.filter(o => o.status === 'entregado').length;
  
  // Calcular comisión estimada (5% de las ventas)
  const commission = totalSales * 0.05;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="vendor-dashboard">
      <FadeIn direction="up">
        <div className="vendor-header">
        <div className="vendor-header__info">
          <h1>Panel de Vendedor</h1>
          <p className="muted">
            Bienvenido, {user.name} 
            <span className="vendor-badge">💼 VENDEDOR</span>
          </p>
        </div>
        <button onClick={logout} className="btn btn-secondary">
          Cerrar Sesión
        </button>
        </div>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <div className="vendor-tabs">
        <button
          className={`vendor-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Resumen
        </button>
        <button
          className={`vendor-tab ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          👥 Mis Clientes ({clients.length})
        </button>
        <button
          className={`vendor-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Pedidos ({orders.length})
        </button>
        </div>
      </FadeIn>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="vendor-content">
          {activeTab === 'overview' && (
            <div className="vendor-overview">
              <div className="sales-metrics-grid">
                <SalesMetricCard
                  title="Ventas Totales"
                  value={formatCurrency(totalSales)}
                  icon="💰"
                  trend={{ value: '+15%', isUp: true }}
                  color="var(--color-primary)"
                />
                <SalesMetricCard
                  title="Comisión Estimada"
                  value={formatCurrency(commission)}
                  icon="💵"
                  trend={{ value: '+15%', isUp: true }}
                  color="#4CAF50"
                />
                <SalesMetricCard
                  title="Pedidos Activos"
                  value={activeOrders}
                  icon="📦"
                  trend={{ value: '+2', isUp: true }}
                  color="#2196F3"
                />
                <SalesMetricCard
                  title="Pedidos Completados"
                  value={completedOrders}
                  icon="✅"
                  trend={{ value: '+8', isUp: true }}
                  color="#9C27B0"
                />
              </div>

              <div className="vendor-overview-sections">
                <section className="vendor-section">
                  <h2>Mis Clientes Activos</h2>
                  <p className="muted">Tienes {clients.length} cliente(s) asignado(s)</p>
                  <div className="clients-preview-grid">
                    {clients.slice(0, 3).map(client => (
                      <ClientCard key={client.id} client={client} />
                    ))}
                  </div>
                  {clients.length > 3 && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setActiveTab('clients')}
                      style={{ marginTop: 'var(--spacing-lg)' }}
                    >
                      Ver Todos los Clientes
                    </button>
                  )}
                </section>

                <section className="vendor-section">
                  <h2>Rendimiento Mensual</h2>
                  <div className="performance-stats">
                    <div className="performance-item">
                      <div className="performance-label">Meta de Ventas</div>
                      <div className="performance-bar">
                        <div 
                          className="performance-bar-fill" 
                          style={{ width: '75%', backgroundColor: 'var(--color-primary)' }}
                        ></div>
                      </div>
                      <div className="performance-value">75% Completado</div>
                    </div>
                    <div className="performance-item">
                      <div className="performance-label">Satisfacción Cliente</div>
                      <div className="performance-bar">
                        <div 
                          className="performance-bar-fill" 
                          style={{ width: '95%', backgroundColor: '#4CAF50' }}
                        ></div>
                      </div>
                      <div className="performance-value">95% Positivo</div>
                    </div>
                  </div>
                </section>

                <section className="vendor-section">
                  <h2>Actividad Reciente</h2>
                  <div className="activity-timeline">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <strong>{order.orderNumber}</strong>
                          <span className="muted">
                            {new Date(order.date).toLocaleDateString('es-CL')} - {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="vendor-clients">
              <div className="vendor-section">
                <div className="section-header">
                  <h2>Mi Cartera de Clientes</h2>
                  <button className="btn btn-primary">
                    + Solicitar Nuevo Cliente
                  </button>
                </div>
                <div className="clients-grid">
                  {clients.map(client => (
                    <ClientCard key={client.id} client={client} />
                  ))}
                </div>
                {clients.length === 0 && (
                  <div className="empty-state">
                    <p>No tienes clientes asignados aún</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="vendor-orders">
              <div className="vendor-section">
                <VendorOrderList orders={orders} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
