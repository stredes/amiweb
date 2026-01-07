export interface User {
  id: string;
  email: string;
  name: string;
  role: 'socio' | 'admin' | 'root' | 'vendedor';
  company?: string;
  vendorId?: string;
  phone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pendiente' | 'en-preparacion' | 'en-transito' | 'entregado' | 'cancelado';
  products: OrderProduct[];
  total: number;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface SupportContact {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  available: boolean;
}
