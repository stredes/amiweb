import { useState } from 'react';
import { User } from '../../features/auth/types';
import { FiPlus, FiEdit2, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';
import { toast } from '../ui/Toast';
import { userManagementApi, CreateUserRequest, UpdateUserRequest } from '../../features/auth/userManagementApi';

interface UserManagementProps {
  users: Array<Omit<User, 'password'>>;
  currentUser: User;
  onUsersChange?: () => void;
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

export function UserManagement({ users, currentUser, onUsersChange }: UserManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleToggleActive = async (userId: string, userName: string, isActive: boolean) => {
    if (!isRoot) {
      toast.error('Solo el usuario root puede gestionar usuarios');
      return;
    }
    
    try {
      await userManagementApi.toggleUserStatus(userId, !isActive);
      toast.success(`Usuario ${userName} ${!isActive ? 'activado' : 'desactivado'}`);
      onUsersChange?.();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar usuario');
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
        {users.map(user => {
          const roleInfo = roleLabels[user.role] || { label: user.role, color: '#757575', icon: '👤' };
          const canManage = isRoot && user.id !== currentUser.id;
          
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
                      className="btn-icon btn-icon--danger" 
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      title="Eliminar usuario"
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
                  minLength={6}
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
    </div>
  );
}
