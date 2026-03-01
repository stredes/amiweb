import { useEffect, useMemo, useState } from 'react';
import { User } from '../../features/auth/types';
import { FiPlus, FiEdit2, FiTrash2, FiKey, FiPower, FiSearch, FiClock } from 'react-icons/fi';
import { toast } from '../ui/Toast';
import {
  userManagementApi,
  CreateUserRequest,
  UpdateUserRequest,
  UserAuditEntry
} from '../../features/auth/userManagementApi';

interface UserManagementProps {
  users: Array<Omit<User, 'password'>>;
  currentUser: User;
  onUsersChange?: () => void;
  createUserTrigger?: number;
}

const roleLabels = {
  'socio': { label: 'Socio/Cliente', color: '#2196F3', icon: '👥' },
  'admin': { label: 'Administrador/Jefe', color: '#9C27B0', icon: '👔' },
  'root': { label: 'Root', color: '#F44336', icon: '🔐' },
  'vendedor': { label: 'Vendedor', color: '#FF9800', icon: '💼' },
  'bodega': { label: 'Bodega', color: '#607D8B', icon: '📦' },
  'callcenter': { label: 'Call Center', color: '#00BCD4', icon: '📞' },
  'soporte': { label: 'Soporte/Ingeniero', color: '#4CAF50', icon: '🔧' }
};

export function UserManagement({ users, currentUser, onUsersChange, createUserTrigger = 0 }: UserManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [selectedAuditUser, setSelectedAuditUser] = useState<Omit<User, 'password'> | null>(null);
  const [auditEntries, setAuditEntries] = useState<UserAuditEntry[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'socio' as User['role'],
    company: '',
    phone: '',
    department: ''
  });

  const isRoot = currentUser.role === 'root';
  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      if (roleFilter !== 'all' && user.role !== roleFilter) {
        return false;
      }

      if (statusFilter === 'active' && user.isActive === false) {
        return false;
      }

      if (statusFilter === 'inactive' && user.isActive !== false) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return `${user.name} ${user.email}`.toLowerCase().includes(normalizedSearch);
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'socio',
      company: '',
      phone: '',
      department: ''
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (createUserTrigger > 0) {
      handleCreateUser();
    }
  }, [createUserTrigger]);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      company: user.company || '',
      phone: user.phone || '',
      department: user.department || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isRoot) {
      toast.error('Solo el usuario root puede gestionar usuarios');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingUser) {
        // Actualizar usuario existente
        const updateData: UpdateUserRequest = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          company: formData.company || undefined,
          phone: formData.phone || undefined,
          department: formData.department || undefined
        };
        
        // Solo incluir password si se proporcionó uno nuevo
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await userManagementApi.updateUser(editingUser.id, updateData);
        toast.success('Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        const createData: CreateUserRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          company: formData.company || undefined,
          phone: formData.phone || undefined,
          department: formData.department || undefined
        };
        
        await userManagementApi.createUser(createData);
        toast.success('Usuario creado exitosamente');
      }
      
      setShowModal(false);
      onUsersChange?.();
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!isRoot) {
      toast.error('Solo el usuario root puede eliminar usuarios');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar al usuario ${userName}?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await userManagementApi.deleteUser(userId);
      toast.success('Usuario eliminado exitosamente');
      onUsersChange?.();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar usuario');
    }
  };

  const handleToggleUserStatus = async (userToUpdate: Omit<User, 'password'>) => {
    if (!isRoot) {
      toast.error('Solo el usuario root puede cambiar estado de usuarios');
      return;
    }

    if (!confirm(`¿Deseas ${userToUpdate.isActive === false ? 'activar' : 'desactivar'} a ${userToUpdate.name}?`)) {
      return;
    }

    setProcessingUserId(userToUpdate.id);
    try {
      await userManagementApi.toggleUserStatus(userToUpdate.id, userToUpdate.isActive === false);
      toast.success(`Usuario ${userToUpdate.isActive === false ? 'activado' : 'desactivado'} exitosamente`);
      onUsersChange?.();
    } catch (error: any) {
      toast.error(error.message || 'Error al cambiar estado del usuario');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleResetPassword = async (userToUpdate: Omit<User, 'password'>) => {
    if (!isRoot) {
      toast.error('Solo el usuario root puede resetear contraseñas');
      return;
    }

    const newPassword = prompt(`Ingresa nueva contraseña temporal para ${userToUpdate.name} (mínimo 8 caracteres):`);
    if (!newPassword) return;

    if (newPassword.length < 8) {
      toast.error('La contraseña temporal debe tener al menos 8 caracteres');
      return;
    }

    if (!confirm('¿Confirmas resetear la contraseña de este usuario?')) {
      return;
    }

    setProcessingUserId(userToUpdate.id);
    try {
      await userManagementApi.resetPassword(userToUpdate.id, newPassword);
      toast.success('Contraseña reseteada exitosamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al resetear contraseña');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleShowAudit = async (userToInspect: Omit<User, 'password'>) => {
    setSelectedAuditUser(userToInspect);
    setShowAuditModal(true);
    setAuditLoading(true);
    try {
      const items = await userManagementApi.getUserAudit(userToInspect.id);
      setAuditEntries(items);
    } catch (error: any) {
      toast.error(error.message || 'No se pudo cargar la auditoría del usuario');
      setAuditEntries([]);
    } finally {
      setAuditLoading(false);
    }
  };

  const formatAuditDate = (value: unknown): string => {
    if (!value) return 'Sin fecha';
    if (typeof value === 'string') return new Date(value).toLocaleString('es-CL');
    if (typeof value === 'number') return new Date(value).toLocaleString('es-CL');
    if (typeof value === 'object' && value !== null) {
      const raw = value as Record<string, unknown>;
      if (typeof raw.seconds === 'number') {
        return new Date(raw.seconds * 1000).toLocaleString('es-CL');
      }
      if (typeof raw._seconds === 'number') {
        return new Date(raw._seconds * 1000).toLocaleString('es-CL');
      }
    }
    return 'Fecha no disponible';
  };

  return (
    <div className="user-management">
      <div className="user-management__header">
        <h2>Gestión de Usuarios</h2>
        {isRoot && (
          <button className="btn btn--primary" onClick={handleCreateUser}>
            <FiPlus /> Crear Usuario
          </button>
        )}
      </div>

      <div className="admin-section admin-section--compact">
        <div className="user-filters">
          <label className="user-filters__search">
            <FiSearch />
            <input
              type="text"
              placeholder="Buscar por nombre o email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as 'all' | User['role'])}>
            <option value="all">Todos los roles</option>
            {Object.entries(roleLabels).map(([role, info]) => (
              <option key={role} value={role}>
                {info.label}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | 'active' | 'inactive')}>
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      <div className="user-management__stats">
        {Object.entries(roleLabels).map(([role, info]) => (
          <div key={role} className="user-stat" style={{ borderColor: info.color }}>
            <span className="user-stat__icon">{info.icon}</span>
            <div>
              <span className="user-stat__label">{info.label}:</span>
              <span className="user-stat__value">{users.filter(u => u.role === role).length}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="user-grid">
        {filteredUsers.map(user => {
          const roleInfo = roleLabels[user.role] || { label: user.role, color: '#757575', icon: '👤' };
          const canManage = isRoot && user.id !== currentUser.id;
          const isProcessing = processingUserId === user.id;
          
          return (
            <div key={user.id} className="user-card-admin">
              <div className="user-card-admin__header">
                <div className="user-avatar" style={{ backgroundColor: roleInfo.color }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p className="muted">{user.email}</p>
                </div>
                {canManage && (
                  <div className="user-actions">
                    <button 
                      className="btn-icon" 
                      onClick={() => handleEditUser(user)}
                      title="Editar usuario"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleShowAudit(user)}
                      title="Ver historial de auditoría"
                      disabled={isProcessing}
                    >
                      <FiClock />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleToggleUserStatus(user)}
                      title={user.isActive === false ? 'Activar usuario' : 'Desactivar usuario'}
                      disabled={isProcessing}
                    >
                      <FiPower />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleResetPassword(user)}
                      title="Resetear contraseña"
                      disabled={isProcessing}
                    >
                      <FiKey />
                    </button>
                    <button 
                      className="btn-icon btn-icon--danger" 
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      title="Eliminar usuario"
                      disabled={isProcessing}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="user-card-admin__body">
                <div className="user-detail">
                  <span className="user-detail__label">Rol:</span>
                  <span 
                    className="role-badge" 
                    style={{ backgroundColor: roleInfo.color }}
                  >
                    {roleInfo.icon} {roleInfo.label}
                  </span>
                </div>

                <div className="user-detail">
                  <span className="user-detail__label">Estado:</span>
                  <span className={`badge ${user.isActive === false ? '' : 'badge--success'}`}>
                    {user.isActive === false ? 'Inactivo' : 'Activo'}
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

                {user.department && (
                  <div className="user-detail">
                    <span className="user-detail__label">Departamento:</span>
                    <span>{user.department}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="admin-section">
          <p className="muted">No se encontraron usuarios con los filtros aplicados.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal__body">
              <div className="form-group">
                <label htmlFor="name">Nombre Completo *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  {editingUser ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  minLength={8}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Tipo de Usuario *</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  required
                >
                  <option value="socio">{roleLabels.socio.icon} Socio/Cliente - Pueden crear pedidos y cotizaciones</option>
                  <option value="vendedor">{roleLabels.vendedor.icon} Vendedor - Gestionan pedidos de clientes</option>
                  <option value="callcenter">{roleLabels.callcenter.icon} Call Center - Atención y gestión telefónica</option>
                  <option value="soporte">{roleLabels.soporte.icon} Soporte/Ingeniero - Asistencia técnica</option>
                  <option value="bodega">{roleLabels.bodega.icon} Bodega - Control de inventario</option>
                  <option value="admin">{roleLabels.admin.icon} Administrador/Jefe - Gestión completa del sistema</option>
                  {isRoot && <option value="root">{roleLabels.root.icon} Root - Control total del sistema</option>}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Empresa/Organización</label>
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Departamento/Área</label>
                <input
                  id="department"
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Ventas, Soporte, Logística, etc."
                />
              </div>

              <div className="modal__footer">
                <button 
                  type="button" 
                  className="btn btn--secondary" 
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn--primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAuditModal && selectedAuditUser && (
        <div className="modal-overlay" onClick={() => setShowAuditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Auditoría de {selectedAuditUser.name}</h3>
              <button className="btn-close" onClick={() => setShowAuditModal(false)}>×</button>
            </div>
            <div className="modal__body">
              {auditLoading ? (
                <p className="muted">Cargando historial...</p>
              ) : auditEntries.length === 0 ? (
                <p className="muted">No hay eventos de auditoría para este usuario.</p>
              ) : (
                <div className="activity-list">
                  {auditEntries.map((entry) => (
                    <div key={entry.id} className="activity-item">
                      <div className="activity-item__icon">🧾</div>
                      <div className="activity-item__content">
                        <strong>{entry.action}</strong>
                        <span className="muted">
                          {entry.actorEmail || 'Sistema'} · {formatAuditDate(entry.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal__footer">
              <button type="button" className="btn btn--secondary" onClick={() => setShowAuditModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
