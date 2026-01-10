export interface User {
  id: string;
  email: string;
  name: string;
  role: 'socio' | 'admin' | 'root' | 'vendedor' | 'bodega' | 'callcenter' | 'soporte';
  company?: string;
  vendorId?: string;
  phone?: string;
  department?: string;
  isActive?: boolean;
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
  userId?: string;
  
  // Cliente
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  organization: string;
  taxId?: string;
  
  // Items
  items: OrderProduct[];
  
  // Totales
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  
  // Estado
  status: 'cotizacion' | 'pendiente_vendedor' | 'aprobado_vendedor' | 'pendiente_admin' | 'aprobado_admin' | 'rechazado' | 'confirmado' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  paymentStatus: 'pendiente' | 'parcial' | 'pagado' | 'reembolsado';
  paymentMethod?: 'transferencia' | 'efectivo' | 'cheque' | 'tarjeta' | 'credito_30' | 'credito_60' | 'credito_90';
  
  // Aprobaciones
  vendorId?: string; // ID del vendedor asignado
  vendorApprovedAt?: string;
  vendorApprovedBy?: string;
  vendorNotes?: string;
  adminApprovedAt?: string;
  adminApprovedBy?: string;
  adminNotes?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  
  // Envío
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  
  // Timestamps
  date: string; // createdAt
  updatedAt?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  deliveryConfirmedAt?: string;
  cancelledAt?: string;
  
  // Compatibilidad con frontend anterior
  estimatedDelivery?: string;
  products?: OrderProduct[]; // alias de items
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  sku?: string;
  
  // Compatibilidad con frontend anterior
  id?: string; // alias de productId
  name?: string; // alias de productName
  price?: number; // alias de unitPrice
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  contactName: string;
  
  // Compatibilidad con frontend anterior
  region?: string; // alias de state
  postalCode?: string; // alias de zipCode
  fullName?: string; // alias de contactName
  address?: string; // alias de street
  apartment?: string;
  instructions?: string;
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
