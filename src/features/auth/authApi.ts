import { auth } from '../../lib/firebase';
import { httpRequest } from '../../lib/httpClient';
import { backendApi } from '../api/backendApiService';
import { AuthResponse, LoginCredentials, Order, OrderProduct, ShippingAddress, SupportContact, User, Vendor } from './types';

type BackendOrder = {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  organization: string;
  taxId?: string;
  items?: OrderProduct[];
  subtotal?: number;
  discount?: number;
  tax?: number;
  shippingCost?: number;
  total?: number;
  status: string;
  paymentStatus?: string;
  paymentMethod?: Order['paymentMethod'];
  vendorId?: string;
  shippingAddress?: Partial<ShippingAddress>;
  trackingNumber?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  confirmedAt?: unknown;
  shippedAt?: unknown;
  deliveredAt?: unknown;
  deliveryConfirmedAt?: unknown;
  cancelledAt?: unknown;
};

type BackendQuote = {
  id: string;
  quoteNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  organization: string;
  taxId?: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice?: number;
    subtotal?: number;
  }>;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total?: number;
  status: string;
  assignedSalesRep?: string;
  assignedSalesRepName?: string;
  vendorNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  vendorApprovedAt?: unknown;
  adminApprovedAt?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

function toIsoDate(input: unknown): string {
  if (!input) return new Date().toISOString();
  if (typeof input === 'string') return input;
  if (typeof input === 'number') return new Date(input).toISOString();

  if (typeof input === 'object' && input !== null) {
    const value = input as Record<string, unknown>;

    if (typeof value.toDate === 'function') {
      return (value.toDate as () => Date)().toISOString();
    }

    if (typeof value.seconds === 'number') {
      return new Date(value.seconds * 1000).toISOString();
    }

    if (typeof value._seconds === 'number') {
      return new Date(value._seconds * 1000).toISOString();
    }
  }

  return new Date().toISOString();
}

function mapOrderStatus(status: string): Order['status'] {
  switch (status) {
    case 'cotizacion':
    case 'pendiente_vendedor':
    case 'aprobado_vendedor':
    case 'pendiente_admin':
    case 'aprobado_admin':
    case 'rechazado':
    case 'confirmado':
    case 'procesando':
    case 'enviado':
    case 'entregado':
    case 'cancelado':
      return status;
    case 'pendiente':
    default:
      return 'pendiente_vendedor';
  }
}

function mapQuoteStatusToOrderStatus(status: string): Order['status'] {
  switch (status) {
    case 'pendiente':
    case 'en_revision_vendedor':
      return 'pendiente_vendedor';
    case 'aprobado_vendedor':
    case 'en_revision_admin':
      return 'aprobado_vendedor';
    case 'aprobado':
      return 'aprobado_admin';
    case 'rechazado':
    case 'rechazado_vendedor':
      return 'rechazado';
    case 'convertida':
      return 'confirmado';
    default:
      return 'cotizacion';
  }
}

function normalizeShippingAddress(address?: Partial<ShippingAddress>): ShippingAddress {
  const street = address?.street || address?.address || '';
  const state = address?.state || address?.region || '';
  const zipCode = address?.zipCode || address?.postalCode || '';
  const contactName = address?.contactName || address?.fullName || '';

  return {
    street,
    city: address?.city || '',
    state,
    zipCode,
    country: address?.country || 'Chile',
    phone: address?.phone || '',
    contactName,
    region: state,
    postalCode: zipCode,
    fullName: contactName,
    address: street,
    apartment: address?.apartment,
    instructions: address?.instructions,
  };
}

function mapBackendOrder(order: BackendOrder): Order {
  const items = (order.items || []).map((item) => ({
    ...item,
    id: item.productId,
    name: item.productName,
    price: item.unitPrice,
  }));

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    userId: order.userId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    organization: order.organization,
    taxId: order.taxId,
    items,
    products: items,
    subtotal: order.subtotal || 0,
    discount: order.discount || 0,
    tax: order.tax || 0,
    shippingCost: order.shippingCost || 0,
    total: order.total || 0,
    status: mapOrderStatus(order.status),
    paymentStatus: (order.paymentStatus as Order['paymentStatus']) || 'pendiente',
    paymentMethod: order.paymentMethod,
    vendorId: order.vendorId,
    shippingAddress: normalizeShippingAddress(order.shippingAddress),
    trackingNumber: order.trackingNumber,
    date: toIsoDate(order.createdAt),
    updatedAt: order.updatedAt ? toIsoDate(order.updatedAt) : undefined,
    confirmedAt: order.confirmedAt ? toIsoDate(order.confirmedAt) : undefined,
    shippedAt: order.shippedAt ? toIsoDate(order.shippedAt) : undefined,
    deliveredAt: order.deliveredAt ? toIsoDate(order.deliveredAt) : undefined,
    deliveryConfirmedAt: order.deliveryConfirmedAt ? toIsoDate(order.deliveryConfirmedAt) : undefined,
    cancelledAt: order.cancelledAt ? toIsoDate(order.cancelledAt) : undefined,
  };
}

function mapQuoteToPseudoOrder(quote: BackendQuote): Order {
  const items: OrderProduct[] = quote.items.map((item) => {
    const unitPrice = item.unitPrice || 0;
    const subtotal = item.subtotal || unitPrice * item.quantity;
    return {
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice,
      subtotal,
      id: item.productId,
      name: item.productName,
      price: unitPrice,
    };
  });

  const subtotal = quote.subtotal || items.reduce((acc, item) => acc + item.subtotal, 0);
  const tax = quote.tax || 0;
  const shippingCost = 0;
  const discount = quote.discount || 0;
  const total = quote.total || subtotal + tax + shippingCost - discount;

  return {
    id: quote.id,
    orderNumber: quote.quoteNumber,
    userId: quote.userId,
    customerName: quote.customerName,
    customerEmail: quote.customerEmail,
    customerPhone: quote.customerPhone,
    organization: quote.organization,
    taxId: quote.taxId,
    items,
    products: items,
    subtotal,
    discount,
    tax,
    shippingCost,
    total,
    status: mapQuoteStatusToOrderStatus(quote.status),
    paymentStatus: 'pendiente',
    paymentMethod: 'transferencia',
    vendorId: quote.assignedSalesRep,
    vendorNotes: quote.vendorNotes,
    adminNotes: quote.adminNotes,
    rejectionReason: quote.rejectionReason,
    vendorApprovedAt: quote.vendorApprovedAt ? toIsoDate(quote.vendorApprovedAt) : undefined,
    adminApprovedAt: quote.adminApprovedAt ? toIsoDate(quote.adminApprovedAt) : undefined,
    shippingAddress: normalizeShippingAddress(),
    date: toIsoDate(quote.createdAt),
    updatedAt: quote.updatedAt ? toIsoDate(quote.updatedAt) : undefined,
  };
}

async function getCurrentUserFromApi(): Promise<User> {
  const response = await httpRequest<{ user: User }>('/api/auth/me', { method: 'GET' });
  return response.user;
}

export const authApi = {
  async login(_credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await getCurrentUserFromApi();
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';

    return {
      user,
      token,
    };
  },

  async logout(): Promise<void> {
    return;
  },

  async getOrders(userId?: string): Promise<Order[]> {
    const customerEmail = userId ? auth.currentUser?.email || undefined : undefined;

    const [ordersResponse, quotesResponse] = await Promise.all([
      backendApi.listOrders({ customerEmail, pageSize: 200 }),
      backendApi.listQuotes({ customerEmail, pageSize: 200 }),
    ]);

    const orders = (ordersResponse.data.items || []).map((item) => mapBackendOrder(item as unknown as BackendOrder));
    const quotes = (quotesResponse.data.items || []).map((item) => mapQuoteToPseudoOrder(item as unknown as BackendQuote));

    return [...orders, ...quotes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getOrderById(orderId: string): Promise<Order | undefined> {
    try {
      const orderResponse = await backendApi.getOrder(orderId);
      return mapBackendOrder(orderResponse.data as unknown as BackendOrder);
    } catch {
      const quoteResponse = await backendApi.getQuote(orderId);
      return mapQuoteToPseudoOrder(quoteResponse.data as unknown as BackendQuote);
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const response = await backendApi.updateOrder(orderId, { status });
    return mapBackendOrder(response.data as unknown as BackendOrder);
  },

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    const response = await backendApi.updateOrder(orderId, {
      status: updates.status,
      paymentStatus: updates.paymentStatus,
      trackingNumber: updates.trackingNumber,
      internalNotes: updates.adminNotes || updates.vendorNotes,
      confirmDelivery: false,
    });
    return mapBackendOrder(response.data as unknown as BackendOrder);
  },

  async approveQuotationAsVendor(orderId: string): Promise<Order> {
    const response = await httpRequest<{ quote: BackendQuote }>(`/api/quotes/${orderId}/vendor-approve`, {
      method: 'POST',
      body: { approved: true },
    });
    return mapQuoteToPseudoOrder(response.quote);
  },

  async approveOrderAsAdmin(orderId: string): Promise<Order> {
    const response = await httpRequest<{ quote: BackendQuote }>(`/api/quotes/${orderId}/admin-approve`, {
      method: 'POST',
      body: { approved: true },
    });
    return mapQuoteToPseudoOrder(response.quote);
  },

  async rejectOrder(orderId: string, reason: string, rejectedBy: string): Promise<Order> {
    if (rejectedBy === 'vendedor') {
      const response = await httpRequest<{ quote: BackendQuote }>(`/api/quotes/${orderId}/vendor-approve`, {
        method: 'POST',
        body: { approved: false, rejectionReason: reason },
      });
      return mapQuoteToPseudoOrder(response.quote);
    }

    const response = await httpRequest<{ quote: BackendQuote }>(`/api/quotes/${orderId}/admin-approve`, {
      method: 'POST',
      body: { approved: false, rejectionReason: reason },
    });
    return mapQuoteToPseudoOrder(response.quote);
  },

  async getAllUsers(): Promise<Array<Omit<User, 'password'>>> {
    const response = await httpRequest<{ users: Array<Omit<User, 'password'>> }>('/api/users', { method: 'GET' });
    return response.users;
  },

  async getVendorClients(vendorId: string): Promise<Array<Omit<User, 'password'>>> {
    const response = await httpRequest<{ users: Array<Omit<User, 'password'>> }>(
      `/api/users/role/socio?vendorId=${encodeURIComponent(vendorId)}`,
      { method: 'GET' }
    );
    return response.users;
  },

  async getVendorOrders(vendorId: string): Promise<Order[]> {
    const [ordersResponse, quotePendingResponse] = await Promise.all([
      backendApi.listOrders({ pageSize: 200 }),
      httpRequest<{ items: BackendQuote[] }>('/api/quotes/vendor/pending', { method: 'GET' }),
    ]);

    const orders = (ordersResponse.data.items || [])
      .map((item) => mapBackendOrder(item as unknown as BackendOrder))
      .filter((order) => order.vendorId === vendorId || !order.vendorId);

    const pendingQuotes = (quotePendingResponse.items || []).map((quote) => mapQuoteToPseudoOrder(quote));

    return [...pendingQuotes, ...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getVendor(vendorId: string): Promise<Vendor | undefined> {
    const response = await httpRequest<{ user: Omit<User, 'password'> }>(`/api/users/${vendorId}`, { method: 'GET' });
    return {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      phone: response.user.phone || '',
    };
  },

  async getSupportContacts(): Promise<SupportContact[]> {
    const [support, callcenter] = await Promise.all([
      httpRequest<{ users: Array<Omit<User, 'password'>> }>('/api/users/role/soporte', { method: 'GET' }).catch(() => ({ users: [] })),
      httpRequest<{ users: Array<Omit<User, 'password'>> }>('/api/users/role/callcenter', { method: 'GET' }).catch(() => ({ users: [] })),
    ]);

    return [...support.users, ...callcenter.users].map((user) => ({
      id: user.id,
      name: user.name,
      department: user.department || (user.role === 'soporte' ? 'Soporte Técnico' : 'Call Center'),
      email: user.email,
      phone: user.phone || '',
      available: user.isActive ?? true,
    }));
  }
};
