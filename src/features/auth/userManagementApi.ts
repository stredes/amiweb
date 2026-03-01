import { httpRequest } from '../../lib/httpClient';
import { User } from './types';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  vendorId?: string;
  company?: string;
  phone?: string;
  department?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: User['role'];
  vendorId?: string;
  company?: string;
  phone?: string;
  department?: string;
  isActive?: boolean;
}

export interface UserAuditEntry {
  id: string;
  action: string;
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  createdAt?: unknown;
  metadata?: Record<string, unknown>;
}

type UserListPayload = {
  users?: Array<Omit<User, 'password'>>;
  items?: Array<Omit<User, 'password'>>;
};

function extractUsers(payload: UserListPayload): Array<Omit<User, 'password'>> {
  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  return payload.users || [];
}

export const userManagementApi = {
  /**
   * Obtener todos los usuarios (solo root)
   */
  async getAllUsers(): Promise<Array<Omit<User, 'password'>>> {
    const response = await httpRequest<UserListPayload>('/api/users', { method: 'GET' });
    return extractUsers(response);
  },

  /**
   * Crear un nuevo usuario (solo root)
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await httpRequest<{ user: User }>('/api/users', { 
      method: 'POST', 
      body: data 
    });
    return response.user;
  },

  /**
   * Actualizar un usuario existente (solo root)
   */
  async updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
    const response = await httpRequest<{ user: User }>(`/api/users/${userId}`, { 
      method: 'PUT', 
      body: data 
    });
    return response.user;
  },

  /**
   * Eliminar un usuario (solo root)
   */
  async deleteUser(userId: string): Promise<void> {
    await httpRequest<void>(`/api/users/${userId}`, { method: 'DELETE' });
  },

  /**
   * Activar/desactivar un usuario (solo root)
   */
  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    const response = await httpRequest<{ user: User }>(`/api/users/${userId}/status`, { 
      method: 'PATCH', 
      body: { isActive } 
    });
    return response.user;
  },

  /**
   * Obtener usuarios por rol
   */
  async getUsersByRole(role: User['role']): Promise<Array<Omit<User, 'password'>>> {
    const response = await httpRequest<UserListPayload>(`/api/users/role/${role}`, {
      method: 'GET' 
    });
    return extractUsers(response);
  },

  /**
   * Resetear contraseña de un usuario (solo root)
   */
  async resetPassword(userId: string, newPassword: string): Promise<void> {
    await httpRequest<void>(`/api/users/${userId}/reset-password`, { 
      method: 'POST', 
      body: { password: newPassword } 
    });
  },

  /**
   * Historial de auditoría por usuario
   */
  async getUserAudit(userId: string): Promise<UserAuditEntry[]> {
    const response = await httpRequest<{ items: UserAuditEntry[] }>(`/api/users/${userId}/audit`, {
      method: 'GET',
    });
    return response.items || [];
  }
};
