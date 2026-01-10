import { httpRequest } from '../../lib/httpClient';
import { User } from './types';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  company?: string;
  phone?: string;
  department?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: User['role'];
  company?: string;
  phone?: string;
  department?: string;
  isActive?: boolean;
}

export const userManagementApi = {
  /**
   * Obtener todos los usuarios (solo root)
   */
  async getAllUsers(): Promise<Array<Omit<User, 'password'>>> {
    const response = await httpRequest<{ users: Array<Omit<User, 'password'>> }>('/api/users', { method: 'GET' });
    return response.users;
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
    const response = await httpRequest<{ users: Array<Omit<User, 'password'>> }>(`/api/users/role/${role}`, { 
      method: 'GET' 
    });
    return response.users;
  },

  /**
   * Resetear contraseña de un usuario (solo root)
   */
  async resetPassword(userId: string, newPassword: string): Promise<void> {
    await httpRequest<void>(`/api/users/${userId}/reset-password`, { 
      method: 'POST', 
      body: { password: newPassword } 
    });
  }
};
