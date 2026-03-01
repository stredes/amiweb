import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/authStore';
import { authApi } from '../../features/auth/authApi';
import { User } from '../../features/auth/types';
import Loader from '../../components/ui/Loader';
import { FadeIn } from '../../components/ui/FadeIn';
import { UserManagement } from '../../components/admin/UserManagement';
import { toast } from '../../components/ui/Toast';
import { checkBackendConnection } from '../../lib/httpClient';
import { API_BASE_URL } from '../../config/env';
import '../../pages/admin/AdminDashboard.css';

type ManagedUser = Omit<User, 'password'>;
type RootSection = 'overview' | 'users' | 'diagnostics' | 'security';

export function RootDashboardPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<RootSection>('users');
  const [createUserTrigger, setCreateUserTrigger] = useState(0);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersData = await authApi.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading root users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'root') {
      setIsLoading(false);
      return;
    }
    loadUsers();
  }, [loadUsers, user]);

  const usersByRole = useMemo(() => {
    return users.reduce<Record<string, number>>((acc, currentUser) => {
      acc[currentUser.role] = (acc[currentUser.role] || 0) + 1;
      return acc;
    }, {});
  }, [users]);

  const inactiveUsers = useMemo(() => users.filter((currentUser) => currentUser.isActive === false).length, [users]);

  const handleRefreshUsers = async () => {
    await loadUsers();
    toast.success('Usuarios actualizados');
  };

  const handleExportUsers = () => {
    if (!users.length) {
      toast.error('No hay usuarios para exportar');
      return;
    }

    const rows = [
      ['id', 'name', 'email', 'role', 'isActive', 'company', 'phone', 'department'],
      ...users.map((currentUser) => [
        currentUser.id,
        currentUser.name,
        currentUser.email,
        currentUser.role,
        currentUser.isActive === false ? 'false' : 'true',
        currentUser.company || '',
        currentUser.phone || '',
        currentUser.department || '',
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `usuarios-root-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(downloadUrl);
    toast.success('Exportación CSV completada');
  };

  const handleBackendCheck = async () => {
    const isConnected = await checkBackendConnection();
    if (isConnected) {
      toast.success('Backend operativo');
    } else {
      toast.error('Backend no disponible en este momento');
    }
  };

  const handleOpenCreateUser = () => {
    setActiveSection('users');
    setCreateUserTrigger((previous) => previous + 1);
  };

  if (!user) return null;
  if (user.role !== 'root') {
    return <Navigate to="/portal-socios" replace />;
  }

  return (
    <div className="admin-dashboard root-dashboard">
      <FadeIn direction="up">
        <div className="admin-header">
          <div className="admin-header__info">
            <h1>Panel Root</h1>
            <p className="muted">
              Gestión total de usuarios y permisos
              <span className="admin-badge">🔐 ROOT</span>
            </p>
          </div>
          <button onClick={logout} className="btn btn-secondary">
            Cerrar Sesión
          </button>
        </div>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <div className="root-notice">
          <span className="root-notice__icon">⚠️</span>
          <div>
            <strong>Cuenta privilegiada</strong>
            <p>Desde este panel puedes crear, editar y eliminar usuarios de todos los roles.</p>
          </div>
        </div>
      </FadeIn>

      {isLoading ? (
        <Loader />
      ) : (
        <FadeIn direction="up" delay={0.2}>
          <div className="dashboard-shell">
            <aside className="dashboard-sidebar">
              <h3 className="dashboard-sidebar__title">Herramientas Root</h3>
              <button
                className={`dashboard-sidebar__item ${activeSection === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveSection('overview')}
              >
                <span>📊 Resumen</span>
              </button>
              <button
                className={`dashboard-sidebar__item ${activeSection === 'users' ? 'active' : ''}`}
                onClick={() => setActiveSection('users')}
              >
                <span>👥 CRUD Usuarios</span>
                <span className="dashboard-sidebar__counter">{users.length}</span>
              </button>
              <button
                className={`dashboard-sidebar__item ${activeSection === 'diagnostics' ? 'active' : ''}`}
                onClick={() => setActiveSection('diagnostics')}
              >
                <span>🩺 Diagnóstico</span>
              </button>
              <button
                className={`dashboard-sidebar__item ${activeSection === 'security' ? 'active' : ''}`}
                onClick={() => setActiveSection('security')}
              >
                <span>🔐 Seguridad</span>
              </button>

              <div className="dashboard-sidebar__group-title">Acciones rápidas</div>
              <button className="dashboard-sidebar__action" onClick={handleRefreshUsers}>
                🔄 Recargar usuarios
              </button>
              <button className="dashboard-sidebar__action" onClick={handleOpenCreateUser}>
                ➕ Crear nuevo usuario
              </button>
              <button className="dashboard-sidebar__action" onClick={handleExportUsers}>
                📥 Exportar CSV
              </button>
              <button className="dashboard-sidebar__action" onClick={handleBackendCheck}>
                🛰️ Verificar backend
              </button>
              <button className="dashboard-sidebar__action dashboard-sidebar__action--danger" onClick={logout}>
                ⏻ Cerrar sesión root
              </button>
            </aside>

            <div className="dashboard-main admin-content">
              {activeSection === 'overview' && (
                <div className="admin-overview">
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                      <div className="admin-stat-card__icon">👥</div>
                      <div className="admin-stat-card__content">
                        <h3 className="admin-stat-card__title">Total Usuarios</h3>
                        <div className="admin-stat-card__value">{users.length}</div>
                      </div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-card__icon">🤝</div>
                      <div className="admin-stat-card__content">
                        <h3 className="admin-stat-card__title">Socios</h3>
                        <div className="admin-stat-card__value">{usersByRole.socio || 0}</div>
                      </div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-card__icon">👑</div>
                      <div className="admin-stat-card__content">
                        <h3 className="admin-stat-card__title">Admin/Root</h3>
                        <div className="admin-stat-card__value">{(usersByRole.admin || 0) + (usersByRole.root || 0)}</div>
                      </div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-card__icon">🛠️</div>
                      <div className="admin-stat-card__content">
                        <h3 className="admin-stat-card__title">Operación</h3>
                        <div className="admin-stat-card__value">
                          {(usersByRole.vendedor || 0) + (usersByRole.bodega || 0) + (usersByRole.soporte || 0) + (usersByRole.callcenter || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeSection === 'users' && (
                <div className="admin-section admin-section--compact">
                  <h2>Gestión de Usuarios (CRUD)</h2>
                  <p className="muted">
                    Crea, edita, activa/desactiva, resetea claves y audita usuarios desde esta sección.
                  </p>
                </div>
              )}
              {activeSection === 'users' && (
                <UserManagement
                  users={users}
                  currentUser={user}
                  onUsersChange={loadUsers}
                  createUserTrigger={createUserTrigger}
                />
              )}
              {activeSection === 'diagnostics' && (
                <section className="admin-section root-tools-panel">
                  <h2>Diagnóstico de Integración</h2>
                  <div className="root-tools-grid">
                    <article className="root-tool-card">
                      <h3>Origen actual</h3>
                      <p>{window.location.origin}</p>
                    </article>
                    <article className="root-tool-card">
                      <h3>Backend configurado</h3>
                      <p>{API_BASE_URL || 'No configurado'}</p>
                    </article>
                    <article className="root-tool-card">
                      <h3>Usuarios inactivos</h3>
                      <p>{inactiveUsers}</p>
                    </article>
                    <article className="root-tool-card">
                      <h3>Cobertura de roles</h3>
                      <p>{Object.keys(usersByRole).length} roles activos</p>
                    </article>
                  </div>
                  <div className="root-tools-actions">
                    <button className="btn btn--secondary" onClick={handleBackendCheck}>
                      Revalidar backend
                    </button>
                    <button className="btn btn--primary" onClick={handleRefreshUsers}>
                      Refrescar datos
                    </button>
                  </div>
                </section>
              )}
              {activeSection === 'security' && (
                <section className="admin-section root-tools-panel">
                  <h2>Seguridad Root</h2>
                  <div className="root-tools-grid">
                    <article className="root-tool-card">
                      <h3>Política de acceso</h3>
                      <p>Solo root puede crear, eliminar y cambiar roles críticos.</p>
                    </article>
                    <article className="root-tool-card">
                      <h3>Auditoría</h3>
                      <p>Revisa historial por usuario desde el módulo CRUD (icono reloj).</p>
                    </article>
                    <article className="root-tool-card">
                      <h3>Cuenta actual</h3>
                      <p>{user.email}</p>
                    </article>
                    <article className="root-tool-card">
                      <h3>Estado de sesión</h3>
                      <p>Sesión activa con privilegios máximos.</p>
                    </article>
                  </div>
                  <div className="root-tools-actions">
                    <button className="btn btn--secondary" onClick={() => setActiveSection('users')}>
                      Ir a gestión de usuarios
                    </button>
                    <button className="btn btn--primary" onClick={logout}>
                      Cerrar sesión segura
                    </button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
