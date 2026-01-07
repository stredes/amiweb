import { AuthResponse, LoginCredentials, Order, Vendor, SupportContact } from './types';

// Mock data
const mockUsers = [
  {
    id: '1',
    email: 'socio@amilab.com',
    password: 'demo123',
    name: 'Juan Pérez',
    role: 'socio' as const,
    company: 'Empresa Demo S.A.',
    vendorId: 'v1',
    phone: '+56 9 1234 5678'
  },
  {
    id: '2',
    email: 'admin@amilab.com',
    password: 'admin123',
    name: 'Roberto Silva',
    role: 'admin' as const,
    company: 'Amilab',
    phone: '+56 9 8765 4321'
  },
  {
    id: '3',
    email: 'root@amilab.com',
    password: 'root2026',
    name: 'Desarrollador Web',
    role: 'root' as const,
    company: 'Amilab - Sistema',
    phone: '+56 9 9999 0000'
  },
  {
    id: 'v1',
    email: 'vendedor1@amilab.com',
    password: 'vende123',
    name: 'Carlos Ramírez',
    role: 'vendedor' as const,
    company: 'Amilab - Ventas',
    phone: '+56 9 5555 1234'
  },
  {
    id: 'v2',
    email: 'vendedor2@amilab.com',
    password: 'vende123',
    name: 'Ana Torres',
    role: 'vendedor' as const,
    company: 'Amilab - Ventas',
    phone: '+56 9 5555 5678'
  }
];

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2026-001',
    date: '2026-01-05',
    status: 'en-preparacion',
    products: [
      { id: '1', name: 'Control de Acceso Biométrico', quantity: 2, price: 450000 },
      { id: '2', name: 'Lector RFID', quantity: 5, price: 120000 }
    ],
    total: 1500000,
    estimatedDelivery: '2026-01-12',
    trackingNumber: 'TRK-001-2026'
  },
  {
    id: '2',
    orderNumber: 'ORD-2026-002',
    date: '2026-01-03',
    status: 'en-transito',
    products: [
      { id: '3', name: 'Sistema de Torniquetes', quantity: 1, price: 1200000 }
    ],
    total: 1200000,
    estimatedDelivery: '2026-01-09',
    trackingNumber: 'TRK-002-2026'
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-045',
    date: '2025-12-20',
    status: 'entregado',
    products: [
      { id: '4', name: 'Cámaras de Seguridad', quantity: 10, price: 250000 }
    ],
    total: 2500000,
    estimatedDelivery: '2025-12-28',
    trackingNumber: 'TRK-045-2025'
  }
];

const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Carlos Ramírez',
    email: 'cramirez@amilab.com',
    phone: '+56 9 5555 1234',
    avatar: '👨‍💼'
  },
  {
    id: 'v2',
    name: 'Ana Torres',
    email: 'atorres@amilab.com',
    phone: '+56 9 5555 5678',
    avatar: '👩‍💼'
  }
];

const mockSupport: SupportContact[] = [
  {
    id: 's1',
    name: 'Soporte Técnico',
    department: 'Técnico',
    email: 'soporte@amilab.com',
    phone: '+56 2 2345 6789',
    available: true
  },
  {
    id: 's2',
    name: 'Servicio al Cliente',
    department: 'Atención al Cliente',
    email: 'clientes@amilab.com',
    phone: '+56 2 2345 6790',
    available: true
  },
  {
    id: 's3',
    name: 'Ventas',
    department: 'Ventas',
    email: 'ventas@amilab.com',
    phone: '+56 2 2345 6791',
    available: true
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800);
    
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: `mock-token-${user.id}-${Date.now()}`
    };
  },

  async logout(): Promise<void> {
    await delay(300);
    // Clear session
  },

  async getOrders(_userId?: string): Promise<Order[]> {
    await delay(500);
    return mockOrders;
  },

  async getOrderById(orderId: string): Promise<Order | undefined> {
    await delay(400);
    return mockOrders.find(o => o.id === orderId);
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    await delay(600);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado');
    order.status = status;
    return order;
  },

  async getAllUsers(): Promise<typeof mockUsers> {
    await delay(400);
    return mockUsers.map(({ password, ...user }) => user as any);
  },

  async getVendorClients(vendorId: string): Promise<Array<Omit<typeof mockUsers[0], 'password'>>> {
    await delay(400);
    return mockUsers
      .filter(u => u.vendorId === vendorId)
      .map(({ password, ...user }) => user as any);
  },

  async getVendorOrders(vendorId: string): Promise<Order[]> {
    await delay(500);
    // Filtrar pedidos de clientes asignados al vendedor
    return mockOrders.filter(_order => {
      // Simular que los pedidos pertenecen a clientes del vendedor
      // En producción: filtrar por _order.clientId y verificar que el cliente tenga vendorId
      return vendorId ? true : true; // Mock: retornar todos los pedidos
    });
  },

  async getVendor(vendorId: string): Promise<Vendor | undefined> {
    await delay(300);
    return mockVendors.find(v => v.id === vendorId);
  },

  async getSupportContacts(): Promise<SupportContact[]> {
    await delay(300);
    return mockSupport;
  }
};
