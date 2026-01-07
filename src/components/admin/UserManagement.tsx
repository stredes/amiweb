import { User } from '../../features/auth/types';

interface UserManagementProps {
  users: Array<Omit<User, 'password'>>;
}

const roleLabels = {
  'socio': { label: 'Socio', color: '#2196F3' },
  'admin': { label: 'Administrador', color: '#9C27B0' },
  'root': { label: 'Root', color: '#F44336' },
  'vendedor': { label: 'Vendedor', color: '#FF9800' }
};

export function UserManagement({ users }: UserManagementProps) {
  return (
    <div className="user-management">
      <h2>Gestión de Usuarios</h2>
      <div className="user-management__stats">
        <div className="user-stat">
          <span className="user-stat__label">Total Usuarios:</span>
          <span className="user-stat__value">{users.length}</span>
        </div>
        <div className="user-stat">
          <span className="user-stat__label">Socios:</span>
          <span className="user-stat__value">{users.filter(u => u.role === 'socio').length}</span>
        </div>
        <div className="user-stat">
          <span className="user-stat__label">Administradores:</span>
          <span className="user-stat__value">{users.filter(u => u.role === 'admin').length}</span>
        </div>
      </div>

      <div className="user-grid">
        {users.map(user => {
          const roleInfo = roleLabels[user.role];
          return (
            <div key={user.id} className="user-card-admin">
              <div className="user-card-admin__header">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p className="muted">{user.email}</p>
                </div>
              </div>
              <div className="user-card-admin__body">
                <div className="user-detail">
                  <span className="user-detail__label">Rol:</span>
                  <span 
                    className="role-badge" 
                    style={{ backgroundColor: roleInfo.color }}
                  >
                    {roleInfo.label}
                  </span>
                </div>
                {user.company && (
                  <div className="user-detail">
                    <span className="user-detail__label">Empresa:</span>
                    <span>{user.company}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="user-detail">
                    <span className="user-detail__label">Teléfono:</span>
                    <a href={`tel:${user.phone}`}>{user.phone}</a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
