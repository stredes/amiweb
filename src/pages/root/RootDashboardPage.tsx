import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/authStore';
import { authApi } from '../../features/auth/authApi';
import { User } from '../../features/auth/types';
import Loader from '../../components/ui/Loader';
import { FadeIn } from '../../components/ui/FadeIn';
import { UserManagement } from '../../components/admin/UserManagement';
import '../../pages/admin/AdminDashboard.css';

type ManagedUser = Omit<User, 'password'>;

export function RootDashboardPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (!user) return null;
  if (user.role !== 'root') {
    return <Navigate to="/portal-socios" replace />;
  }

  return (
    <div className="admin-dashboard">
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
          <div className="admin-content">
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
            <UserManagement users={users} currentUser={user} onUsersChange={loadUsers} />
          </div>
        </FadeIn>
      )}
    </div>
  );
}
