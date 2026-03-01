import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../features/auth/authStore';
import { authApi } from '../../features/auth/authApi';
import { Order, User } from '../../features/auth/types';
import { SalesMetricCard } from '../../components/vendor/SalesMetricCard';
import { ClientCard } from '../../components/vendor/ClientCard';
import { VendorOrderList } from '../../components/vendor/VendorOrderList';
import { QuotationApproval } from '../../components/vendor/QuotationApproval';
import Loader from '../../components/ui/Loader';
import { FadeIn } from '../../components/ui/FadeIn';
import { toast } from '../../components/ui/Toast';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import './VendorDashboard.css';

export function VendorDashboardPage() {
  const { user, logout } = useAuth();
  const [clients, setClients] = useState<Array<Omit<User, 'password'>>>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'quotations' | 'clients' | 'orders' | 'pipeline' | 'agenda'>('overview');

  const loadData = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'vendedor') {
      setIsLoading(false);
      return;
    }
    loadData();
  }, [loadData, user]);

  if (!user) return null;
  if (user.role !== 'vendedor') {
    if (user.role === 'root') {
      return <Navigate to={ROUTES.rootDashboard} replace />;
    }
    if (user.role === 'admin') {
      return <Navigate to={ROUTES.adminDashboard} replace />;
    }
    return <Navigate to={ROUTES.partnerPortal} replace />;
  }

  // Calcular métricas
  const totalSales = orders.reduce((sum, order) => {
    if (order.status !== 'cancelado') return sum + order.total;
    return sum;
  }, 0);

  const activeOrders = orders.filter(o => 
    o.status !== 'entregado' && o.status !== 'cancelado'
  ).length;

  const completedOrders = orders.filter(o => o.status === 'entregado').length;
  
  // Calcular cotizaciones pendientes
  const pendingQuotations = orders.filter(
    o => o.status === 'cotizacion' || o.status === 'pendiente_vendedor'
  ).length;
  
  // Calcular comisión estimada (5% de las ventas)
  const commission = totalSales * 0.05;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const quotationReview = orders.filter((order) => order.status === 'aprobado_vendedor').length;
  const quotedOrders = orders.filter((order) => order.status === 'cotizacion' || order.status === 'pendiente_vendedor').length;
  const inNegotiation = orders.filter((order) => order.status === 'pendiente_admin' || order.status === 'aprobado_vendedor').length;
  const shippingOrders = orders.filter((order) => order.status === 'enviado').length;
  const atRiskOrders = orders.filter((order) => order.status === 'cancelado').length;
  const bestClient = clients[0];

  const handleRefreshDashboard = async () => {
    await loadData();
    toast.success('Panel de vendedor actualizado');
  };

  const exportRowsToCsv = (rows: Array<Array<string | number>>, fileName: string) => {
    const csvContent = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(downloadUrl);
  };

  const handleExportOrders = () => {
    if (!orders.length) {
      toast.error('No hay pedidos para exportar');
      return;
    }

    exportRowsToCsv(
      [
        ['orderNumber', 'customer', 'email', 'status', 'total', 'date'],
        ...orders.map((order) => [
          order.orderNumber,
          order.customerName,
          order.customerEmail,
          order.status,
          order.total,
          order.date,
        ]),
      ],
      `pedidos-vendedor-${new Date().toISOString().slice(0, 10)}.csv`
    );
    toast.success('Pedidos exportados');
  };

  const handleExportClients = () => {
    if (!clients.length) {
      toast.error('No hay clientes para exportar');
      return;
    }

    exportRowsToCsv(
      [
        ['name', 'email', 'company', 'phone', 'isActive'],
        ...clients.map((client) => [
          client.name,
          client.email,
          client.company || '',
          client.phone || '',
          client.isActive === false ? 'false' : 'true',
        ]),
      ],
      `clientes-vendedor-${new Date().toISOString().slice(0, 10)}.csv`
    );
    toast.success('Clientes exportados');
  };

  const handleNextAction = () => {
    if (!bestClient) {
      toast.error('No tienes clientes asignados');
      return;
    }
    toast.info(`Siguiente acción sugerida: contactar a ${bestClient.name}`);
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

      {isLoading ? (
        <Loader />
      ) : (
        <div className="vendor-shell">
          <aside className="vendor-sidebar">
            <h3 className="vendor-sidebar__title">Herramientas Vendedor</h3>
            <button className={`vendor-sidebar__item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              📊 Resumen
            </button>
            <button className={`vendor-sidebar__item ${activeTab === 'quotations' ? 'active' : ''}`} onClick={() => setActiveTab('quotations')}>
              <span>📋 Cotizaciones</span>
              {pendingQuotations > 0 && <span className="vendor-sidebar__counter">{pendingQuotations}</span>}
            </button>
            <button className={`vendor-sidebar__item ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>
              <span>👥 Mis Clientes</span>
              <span className="vendor-sidebar__counter">{clients.length}</span>
            </button>
            <button className={`vendor-sidebar__item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <span>📦 Pedidos</span>
              <span className="vendor-sidebar__counter">{orders.length}</span>
            </button>
            <button className={`vendor-sidebar__item ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveTab('pipeline')}>
              💼 Pipeline
            </button>
            <button className={`vendor-sidebar__item ${activeTab === 'agenda' ? 'active' : ''}`} onClick={() => setActiveTab('agenda')}>
              🗓️ Agenda
            </button>

            <div className="vendor-sidebar__group-title">Acciones rápidas</div>
            <button className="vendor-sidebar__action" onClick={handleRefreshDashboard}>🔄 Refrescar panel</button>
            <button className="vendor-sidebar__action" onClick={handleExportOrders}>📥 Exportar pedidos</button>
            <button className="vendor-sidebar__action" onClick={handleExportClients}>📥 Exportar clientes</button>
            <button className="vendor-sidebar__action" onClick={() => setActiveTab('quotations')}>✅ Revisar cotizaciones</button>
            <button className="vendor-sidebar__action" onClick={handleNextAction}>📞 Siguiente acción</button>
          </aside>

          <div className="vendor-main vendor-content">
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

          {activeTab === 'quotations' && (
            <div className="vendor-quotations">
              <div className="vendor-section">
                <QuotationApproval orders={orders} onOrderUpdate={loadData} />
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="vendor-clients">
              <div className="vendor-section">
                <div className="section-header">
                  <h2>Mi Cartera de Clientes</h2>
                  <button className="btn btn-primary" onClick={handleNextAction}>
                    + Acción Comercial
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

          {activeTab === 'pipeline' && (
            <div className="vendor-pipeline">
              <section className="vendor-section">
                <h2>Pipeline Comercial</h2>
                <div className="vendor-tools-grid">
                  <article className="vendor-tool-card">
                    <h3>Nuevas cotizaciones</h3>
                    <p>{quotedOrders}</p>
                  </article>
                  <article className="vendor-tool-card">
                    <h3>En negociación</h3>
                    <p>{inNegotiation}</p>
                  </article>
                  <article className="vendor-tool-card">
                    <h3>En aprobación interna</h3>
                    <p>{quotationReview}</p>
                  </article>
                  <article className="vendor-tool-card">
                    <h3>Riesgo de pérdida</h3>
                    <p>{atRiskOrders}</p>
                  </article>
                </div>
                <div className="vendor-tools-actions">
                  <button className="btn btn-secondary" onClick={() => setActiveTab('quotations')}>
                    Gestionar cotizaciones
                  </button>
                  <button className="btn btn-primary" onClick={handleExportOrders}>
                    Exportar pipeline
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'agenda' && (
            <div className="vendor-agenda">
              <section className="vendor-section">
                <h2>Agenda Comercial</h2>
                <div className="vendor-tools-grid">
                  <article className="vendor-tool-card">
                    <h3>Seguimientos hoy</h3>
                    <p>{Math.max(1, Math.min(5, pendingQuotations))}</p>
                  </article>
                  <article className="vendor-tool-card">
                    <h3>Pedidos en tránsito</h3>
                    <p>{shippingOrders}</p>
                  </article>
                  <article className="vendor-tool-card">
                    <h3>Clientes activos</h3>
                    <p>{clients.filter((client) => client.isActive !== false).length}</p>
                  </article>
                  <article className="vendor-tool-card">
                    <h3>Meta mensual</h3>
                    <p>{totalSales > 0 ? 'En progreso' : 'Sin iniciar'}</p>
                  </article>
                </div>
                <div className="vendor-tools-actions">
                  <button className="btn btn-secondary" onClick={handleNextAction}>
                    Marcar próximo contacto
                  </button>
                  <button className="btn btn-primary" onClick={() => setActiveTab('clients')}>
                    Ir a clientes
                  </button>
                </div>
              </section>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
