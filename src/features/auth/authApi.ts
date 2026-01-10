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
    vendorId: 'v1', // Vendedor asignado
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
  },
  {
    id: '10',
    email: 'compras@hospitalsangabriel.cl',
    password: 'cliente123',
    name: 'Paula Rojas',
    role: 'socio' as const,
    company: 'Hospital San Gabriel',
    vendorId: 'v1',
    phone: '+56 2 2456 7701'
  },
  {
    id: '11',
    email: 'abastecimiento@labandes.cl',
    password: 'cliente123',
    name: 'Mauricio Pino',
    role: 'socio' as const,
    company: 'Laboratorio Andes Diagnostico',
    vendorId: 'v2',
    phone: '+56 2 2234 8890'
  },
  {
    id: '12',
    email: 'compras@hospitalregionalantofagasta.cl',
    password: 'cliente123',
    name: 'Valentina Soto',
    role: 'socio' as const,
    company: 'Hospital Regional Antofagasta',
    vendorId: 'v1',
    phone: '+56 55 245 3321'
  },
  {
    id: '13',
    email: 'operaciones@labaustral.cl',
    password: 'cliente123',
    name: 'Diego Fuentes',
    role: 'socio' as const,
    company: 'Laboratorio Austral Genetica',
    vendorId: 'v2',
    phone: '+56 41 230 1122'
  },
  {
    id: '14',
    email: 'compras@clinicacordillera.cl',
    password: 'cliente123',
    name: 'Camila Reyes',
    role: 'socio' as const,
    company: 'Clinica Cordillera',
    vendorId: 'v1',
    phone: '+56 2 2688 7788'
  },
  {
    id: 'w1',
    email: 'bodega@amilab.com',
    password: 'bodega123',
    name: 'Miguel Soto',
    role: 'bodega' as const,
    company: 'Amilab - Bodega',
    phone: '+56 9 6666 7777'
  }
];

const mockOrders: Order[] = [
  // Pedido en estado: COTIZACIÓN (recién creado por socio)
  {
    id: '1',
    userId: '1',
    orderNumber: 'ORD-2026-001',
    date: '2026-01-09T08:00:00Z',
    status: 'cotizacion',
    paymentStatus: 'pendiente',
    paymentMethod: 'transferencia',
    customerName: 'Juan Pérez',
    customerEmail: 'socio@amilab.com',
    customerPhone: '+56 9 1234 5678',
    organization: 'Empresa Demo S.A.',
    taxId: '76.XXX.XXX-1',
    vendorId: 'v1',
    items: [
      { 
        productId: '1', 
        productName: 'Control de Acceso Biométrico', 
        quantity: 3, 
        unitPrice: 450000, 
        subtotal: 1350000,
        id: '1',
        name: 'Control de Acceso Biométrico',
        price: 450000,
        sku: 'CAB-2024-100'
      }
    ],
    products: [
      { 
        productId: '1', 
        productName: 'Control de Acceso Biométrico', 
        quantity: 3, 
        unitPrice: 450000, 
        subtotal: 1350000,
        id: '1',
        name: 'Control de Acceso Biométrico',
        price: 450000,
        sku: 'CAB-2024-100'
      }
    ],
    subtotal: 1350000,
    tax: 135000,
    shippingCost: 0,
    discount: 0,
    total: 1485000,
    shippingAddress: {
      street: 'Av. Providencia 1234',
      city: 'Santiago',
      state: 'Región Metropolitana',
      region: 'Región Metropolitana',
      zipCode: '7500000',
      postalCode: '7500000',
      country: 'Chile',
      phone: '+56 9 1234 5678',
      contactName: 'Juan Pérez',
      fullName: 'Juan Pérez',
      address: 'Av. Providencia 1234'
    },
    estimatedDelivery: '2026-01-16',
    createdAt: '2026-01-09T08:00:00Z',
    updatedAt: '2026-01-09T08:00:00Z'
  },
  // Pedido en estado: PENDIENTE VENDEDOR
  {
    id: '2',
    userId: '1',
    orderNumber: 'ORD-2026-002',
    date: '2026-01-08T10:00:00Z',
    status: 'pendiente_vendedor',
    paymentStatus: 'pendiente',
    paymentMethod: 'credito_30',
    customerName: 'Juan Pérez',
    customerEmail: 'socio@amilab.com',
    customerPhone: '+56 9 1234 5678',
    organization: 'Empresa Demo S.A.',
    taxId: '76.XXX.XXX-1',
    vendorId: 'v1',
    items: [
      { 
        productId: '2', 
        productName: 'Lector RFID', 
        quantity: 10, 
        unitPrice: 120000, 
        subtotal: 1200000,
        id: '2',
        name: 'Lector RFID',
        price: 120000,
        sku: 'RFID-2024-200'
      }
    ],
    products: [
      { 
        productId: '2', 
        productName: 'Lector RFID', 
        quantity: 10, 
        unitPrice: 120000, 
        subtotal: 1200000,
        id: '2',
        name: 'Lector RFID',
        price: 120000,
        sku: 'RFID-2024-200'
      }
    ],
    subtotal: 1200000,
    tax: 120000,
    shippingCost: 0,
    discount: 0,
    total: 1320000,
    shippingAddress: {
      street: 'Av. Providencia 1234',
      city: 'Santiago',
      state: 'Región Metropolitana',
      region: 'Región Metropolitana',
      zipCode: '7500000',
      postalCode: '7500000',
      country: 'Chile',
      phone: '+56 9 1234 5678',
      contactName: 'Juan Pérez',
      fullName: 'Juan Pérez',
      address: 'Av. Providencia 1234'
    },
    estimatedDelivery: '2026-01-15',
    createdAt: '2026-01-08T10:00:00Z',
    updatedAt: '2026-01-08T10:00:00Z'
  },
  // Pedido en estado: PENDIENTE ADMIN (ya aprobado por vendedor)
  {
    id: '3',
    userId: '1',
    orderNumber: 'ORD-2026-003',
    date: '2026-01-07T14:00:00Z',
    status: 'pendiente_admin',
    paymentStatus: 'pendiente',
    paymentMethod: 'credito_60',
    customerName: 'María González',
    customerEmail: 'mgonzalez@empresa.cl',
    customerPhone: '+56 9 8765 4321',
    organization: 'TechCorp Ltda',
    taxId: '77.YYY.YYY-2',
    vendorId: 'v1',
    vendorApprovedAt: '2026-01-08T09:00:00Z',
    vendorApprovedBy: 'v1',
    items: [
      { 
        productId: '5', 
        productName: 'Sistema de Control de Asistencia', 
        quantity: 5, 
        unitPrice: 380000, 
        subtotal: 1900000,
        id: '5',
        name: 'Sistema de Control de Asistencia',
        price: 380000,
        sku: 'SCA-2024-001'
      }
    ],
    products: [
      { 
        productId: '5', 
        productName: 'Sistema de Control de Asistencia', 
        quantity: 5, 
        unitPrice: 380000, 
        subtotal: 1900000,
        id: '5',
        name: 'Sistema de Control de Asistencia',
        price: 380000,
        sku: 'SCA-2024-001'
      }
    ],
    subtotal: 1900000,
    tax: 190000,
    shippingCost: 15000,
    discount: 50000,
    total: 2055000,
    shippingAddress: {
      street: 'Av. Apoquindo 3000',
      city: 'Las Condes',
      state: 'Región Metropolitana',
      region: 'Región Metropolitana',
      zipCode: '7550000',
      postalCode: '7550000',
      country: 'Chile',
      phone: '+56 9 8765 4321',
      contactName: 'María González',
      fullName: 'María González',
      address: 'Av. Apoquindo 3000',
      apartment: 'Oficina 502'
    },
    estimatedDelivery: '2026-01-18',
    createdAt: '2026-01-07T14:00:00Z',
    updatedAt: '2026-01-08T09:00:00Z'
  },
  // Pedido en estado: CONFIRMADO (listo para bodega)
  {
    id: '4',
    userId: '1',
    orderNumber: 'ORD-2026-004',
    date: '2026-01-06T11:00:00Z',
    status: 'confirmado',
    paymentStatus: 'pendiente',
    paymentMethod: 'transferencia',
    customerName: 'Pedro Sánchez',
    customerEmail: 'psanchez@industrias.cl',
    customerPhone: '+56 9 5555 9999',
    organization: 'Industrias del Sur',
    taxId: '78.ZZZ.ZZZ-3',
    vendorId: 'v1',
    vendorApprovedAt: '2026-01-07T10:00:00Z',
    vendorApprovedBy: 'v1',
    adminApprovedAt: '2026-01-07T15:00:00Z',
    adminApprovedBy: '2',
    items: [
      { 
        productId: '7', 
        productName: 'Barrera Vehicular Automática', 
        quantity: 2, 
        unitPrice: 1850000, 
        subtotal: 3700000,
        id: '7',
        name: 'Barrera Vehicular Automática',
        price: 1850000,
        sku: 'BVA-2024-003'
      }
    ],
    products: [
      { 
        productId: '7', 
        productName: 'Barrera Vehicular Automática', 
        quantity: 2, 
        unitPrice: 1850000, 
        subtotal: 3700000,
        id: '7',
        name: 'Barrera Vehicular Automática',
        price: 1850000,
        sku: 'BVA-2024-003'
      }
    ],
    subtotal: 3700000,
    tax: 370000,
    shippingCost: 25000,
    discount: 100000,
    total: 3995000,
    shippingAddress: {
      street: 'Ruta 5 Sur Km 1050',
      city: 'Temuco',
      state: 'Región de La Araucanía',
      region: 'Región de La Araucanía',
      zipCode: '4780000',
      postalCode: '4780000',
      country: 'Chile',
      phone: '+56 9 5555 9999',
      contactName: 'Pedro Sánchez',
      fullName: 'Pedro Sánchez',
      address: 'Ruta 5 Sur Km 1050',
      apartment: 'Galpón 3'
    },
    estimatedDelivery: '2026-01-20',
    confirmedAt: '2026-01-07T15:00:00Z',
    createdAt: '2026-01-06T11:00:00Z',
    updatedAt: '2026-01-07T15:00:00Z'
  },
  // Pedido en estado: PROCESANDO (bodega preparando)
  {
    id: '5',
    userId: '1',
    orderNumber: 'ORD-2026-005',
    date: '2026-01-05T09:00:00Z',
    status: 'procesando',
    paymentStatus: 'pendiente',
    paymentMethod: 'credito_30',
    customerName: 'Juan Pérez',
    customerEmail: 'socio@amilab.com',
    customerPhone: '+56 9 1234 5678',
    organization: 'Empresa Demo S.A.',
    vendorId: 'v1',
    vendorApprovedAt: '2026-01-06T10:00:00Z',
    vendorApprovedBy: 'v1',
    adminApprovedAt: '2026-01-06T14:00:00Z',
    adminApprovedBy: '2',
    items: [
      { 
        productId: '1', 
        productName: 'Control de Acceso Biométrico', 
        quantity: 2, 
        unitPrice: 450000, 
        subtotal: 900000,
        id: '1',
        name: 'Control de Acceso Biométrico',
        price: 450000,
        sku: 'CAB-2024-100'
      },
      { 
        productId: '2', 
        productName: 'Lector RFID', 
        quantity: 5, 
        unitPrice: 120000, 
        subtotal: 600000,
        id: '2',
        name: 'Lector RFID',
        price: 120000,
        sku: 'RFID-2024-200'
      }
    ],
    products: [
      { 
        productId: '1', 
        productName: 'Control de Acceso Biométrico', 
        quantity: 2, 
        unitPrice: 450000, 
        subtotal: 900000,
        id: '1',
        name: 'Control de Acceso Biométrico',
        price: 450000,
        sku: 'CAB-2024-100'
      },
      { 
        productId: '2', 
        productName: 'Lector RFID', 
        quantity: 5, 
        unitPrice: 120000, 
        subtotal: 600000,
        id: '2',
        name: 'Lector RFID',
        price: 120000,
        sku: 'RFID-2024-200'
      }
    ],
    subtotal: 1500000,
    tax: 150000,
    shippingCost: 0,
    discount: 0,
    total: 1650000,
    shippingAddress: {
      street: 'Av. Providencia 1234',
      city: 'Santiago',
      state: 'Región Metropolitana',
      region: 'Región Metropolitana',
      zipCode: '7500000',
      postalCode: '7500000',
      country: 'Chile',
      phone: '+56 9 1234 5678',
      contactName: 'Juan Pérez',
      fullName: 'Juan Pérez',
      address: 'Av. Providencia 1234'
    },
    estimatedDelivery: '2026-01-12',
    confirmedAt: '2026-01-06T14:00:00Z',
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-01-08T10:00:00Z'
  },
  // Pedido en estado: ENVIADO
  {
    id: '6',
    userId: '1',
    orderNumber: 'ORD-2026-006',
    date: '2026-01-03T10:00:00Z',
    status: 'enviado',
    paymentStatus: 'pagado',
    paymentMethod: 'transferencia',
    customerName: 'Juan Pérez',
    customerEmail: 'socio@amilab.com',
    customerPhone: '+56 9 1234 5678',
    organization: 'Empresa Demo S.A.',
    vendorId: 'v1',
    trackingNumber: 'TRK-002-2026',
    items: [
      { 
        productId: '3', 
        productName: 'Sistema de Torniquetes', 
        quantity: 1, 
        unitPrice: 1200000, 
        subtotal: 1200000,
        id: '3',
        name: 'Sistema de Torniquetes',
        price: 1200000,
        sku: 'ST-2024-300'
      }
    ],
    products: [
      { 
        productId: '3', 
        productName: 'Sistema de Torniquetes', 
        quantity: 1, 
        unitPrice: 1200000, 
        subtotal: 1200000,
        id: '3',
        name: 'Sistema de Torniquetes',
        price: 1200000,
        sku: 'ST-2024-300'
      }
    ],
    subtotal: 1200000,
    tax: 120000,
    shippingCost: 0,
    discount: 0,
    total: 1320000,
    shippingAddress: {
      street: 'Av. Providencia 1234',
      city: 'Santiago',
      state: 'Región Metropolitana',
      region: 'Región Metropolitana',
      zipCode: '7500000',
      postalCode: '7500000',
      country: 'Chile',
      phone: '+56 9 1234 5678',
      contactName: 'Juan Pérez',
      fullName: 'Juan Pérez',
      address: 'Av. Providencia 1234'
    },
    estimatedDelivery: '2026-01-09',
    shippedAt: '2026-01-08T14:00:00Z',
    createdAt: '2026-01-03T10:00:00Z',
    updatedAt: '2026-01-08T14:00:00Z'
  },
  {
    id: '7',
    userId: '10',
    orderNumber: 'ORD-2026-007',
    date: '2026-01-10T09:15:00Z',
    status: 'pendiente_vendedor',
    paymentStatus: 'pendiente',
    paymentMethod: 'transferencia',
    customerName: 'Paula Rojas',
    customerEmail: 'compras@hospitalsangabriel.cl',
    customerPhone: '+56 2 2456 7701',
    organization: 'Hospital San Gabriel',
    taxId: '76.123.456-7',
    vendorId: 'v1',
    items: [
      {
        productId: '9',
        productName: 'Autoclave de Laboratorio',
        quantity: 1,
        unitPrice: 2800000,
        subtotal: 2800000,
        id: '9',
        name: 'Autoclave de Laboratorio',
        price: 2800000,
        sku: 'AUTO-2024-009'
      },
      {
        productId: '10',
        productName: 'Centrifuga Clinica',
        quantity: 2,
        unitPrice: 680000,
        subtotal: 1360000,
        id: '10',
        name: 'Centrifuga Clinica',
        price: 680000,
        sku: 'CENT-2024-010'
      }
    ],
    products: [
      {
        productId: '9',
        productName: 'Autoclave de Laboratorio',
        quantity: 1,
        unitPrice: 2800000,
        subtotal: 2800000,
        id: '9',
        name: 'Autoclave de Laboratorio',
        price: 2800000,
        sku: 'AUTO-2024-009'
      },
      {
        productId: '10',
        productName: 'Centrifuga Clinica',
        quantity: 2,
        unitPrice: 680000,
        subtotal: 1360000,
        id: '10',
        name: 'Centrifuga Clinica',
        price: 680000,
        sku: 'CENT-2024-010'
      }
    ],
    subtotal: 4160000,
    tax: 416000,
    shippingCost: 20000,
    discount: 0,
    total: 4596000,
    shippingAddress: {
      street: 'Av. Independencia 1234',
      city: 'Santiago',
      state: 'Region Metropolitana',
      region: 'Region Metropolitana',
      zipCode: '8380000',
      postalCode: '8380000',
      country: 'Chile',
      phone: '+56 2 2456 7701',
      contactName: 'Paula Rojas',
      fullName: 'Paula Rojas',
      address: 'Av. Independencia 1234'
    },
    estimatedDelivery: '2026-01-17',
    createdAt: '2026-01-10T09:15:00Z',
    updatedAt: '2026-01-10T09:15:00Z'
  },
  {
    id: '8',
    userId: '11',
    orderNumber: 'ORD-2026-008',
    date: '2026-01-08T11:40:00Z',
    status: 'aprobado_vendedor',
    paymentStatus: 'pendiente',
    paymentMethod: 'credito_30',
    customerName: 'Mauricio Pino',
    customerEmail: 'abastecimiento@labandes.cl',
    customerPhone: '+56 2 2234 8890',
    organization: 'Laboratorio Andes Diagnostico',
    taxId: '77.234.567-8',
    vendorId: 'v2',
    vendorApprovedAt: '2026-01-09T09:20:00Z',
    vendorApprovedBy: 'v2',
    vendorNotes: 'Revisado stock y condiciones comerciales.',
    items: [
      {
        productId: '11',
        productName: 'Microscopio Trinocular',
        quantity: 1,
        unitPrice: 1900000,
        subtotal: 1900000,
        id: '11',
        name: 'Microscopio Trinocular',
        price: 1900000,
        sku: 'MICR-2024-011'
      }
    ],
    products: [
      {
        productId: '11',
        productName: 'Microscopio Trinocular',
        quantity: 1,
        unitPrice: 1900000,
        subtotal: 1900000,
        id: '11',
        name: 'Microscopio Trinocular',
        price: 1900000,
        sku: 'MICR-2024-011'
      }
    ],
    subtotal: 1900000,
    tax: 190000,
    shippingCost: 15000,
    discount: 50000,
    total: 2055000,
    shippingAddress: {
      street: 'Av. Apoquindo 2800',
      city: 'Las Condes',
      state: 'Region Metropolitana',
      region: 'Region Metropolitana',
      zipCode: '7550000',
      postalCode: '7550000',
      country: 'Chile',
      phone: '+56 2 2234 8890',
      contactName: 'Mauricio Pino',
      fullName: 'Mauricio Pino',
      address: 'Av. Apoquindo 2800'
    },
    estimatedDelivery: '2026-01-15',
    createdAt: '2026-01-08T11:40:00Z',
    updatedAt: '2026-01-09T09:20:00Z'
  },
  {
    id: '9',
    userId: '12',
    orderNumber: 'ORD-2026-009',
    date: '2026-01-07T16:10:00Z',
    status: 'pendiente_admin',
    paymentStatus: 'pendiente',
    paymentMethod: 'transferencia',
    customerName: 'Valentina Soto',
    customerEmail: 'compras@hospitalregionalantofagasta.cl',
    customerPhone: '+56 55 245 3321',
    organization: 'Hospital Regional Antofagasta',
    taxId: '76.345.678-9',
    vendorId: 'v1',
    vendorApprovedAt: '2026-01-08T08:10:00Z',
    vendorApprovedBy: 'v1',
    items: [
      {
        productId: '12',
        productName: 'Monitor de Signos Vitales',
        quantity: 4,
        unitPrice: 520000,
        subtotal: 2080000,
        id: '12',
        name: 'Monitor de Signos Vitales',
        price: 520000,
        sku: 'MSV-2024-012'
      }
    ],
    products: [
      {
        productId: '12',
        productName: 'Monitor de Signos Vitales',
        quantity: 4,
        unitPrice: 520000,
        subtotal: 2080000,
        id: '12',
        name: 'Monitor de Signos Vitales',
        price: 520000,
        sku: 'MSV-2024-012'
      }
    ],
    subtotal: 2080000,
    tax: 208000,
    shippingCost: 35000,
    discount: 0,
    total: 2323000,
    shippingAddress: {
      street: 'Av. Argentina 1230',
      city: 'Antofagasta',
      state: 'Region de Antofagasta',
      region: 'Region de Antofagasta',
      zipCode: '1240000',
      postalCode: '1240000',
      country: 'Chile',
      phone: '+56 55 245 3321',
      contactName: 'Valentina Soto',
      fullName: 'Valentina Soto',
      address: 'Av. Argentina 1230'
    },
    estimatedDelivery: '2026-01-16',
    createdAt: '2026-01-07T16:10:00Z',
    updatedAt: '2026-01-08T08:10:00Z'
  },
  {
    id: '10',
    userId: '13',
    orderNumber: 'ORD-2026-010',
    date: '2026-01-06T12:00:00Z',
    status: 'rechazado',
    paymentStatus: 'pendiente',
    paymentMethod: 'transferencia',
    customerName: 'Diego Fuentes',
    customerEmail: 'operaciones@labaustral.cl',
    customerPhone: '+56 41 230 1122',
    organization: 'Laboratorio Austral Genetica',
    taxId: '78.456.789-0',
    vendorId: 'v2',
    rejectedAt: '2026-01-06T18:30:00Z',
    rejectedBy: 'v2',
    rejectionReason: 'Falta informacion tecnica del equipo solicitado.',
    items: [
      {
        productId: '13',
        productName: 'Cabina de Bioseguridad',
        quantity: 1,
        unitPrice: 3200000,
        subtotal: 3200000,
        id: '13',
        name: 'Cabina de Bioseguridad',
        price: 3200000,
        sku: 'BIO-2024-013'
      }
    ],
    products: [
      {
        productId: '13',
        productName: 'Cabina de Bioseguridad',
        quantity: 1,
        unitPrice: 3200000,
        subtotal: 3200000,
        id: '13',
        name: 'Cabina de Bioseguridad',
        price: 3200000,
        sku: 'BIO-2024-013'
      }
    ],
    subtotal: 3200000,
    tax: 320000,
    shippingCost: 20000,
    discount: 0,
    total: 3520000,
    shippingAddress: {
      street: 'Camino a Coronel 8500',
      city: 'Concepcion',
      state: 'Region del Biobio',
      region: 'Region del Biobio',
      zipCode: '4030000',
      postalCode: '4030000',
      country: 'Chile',
      phone: '+56 41 230 1122',
      contactName: 'Diego Fuentes',
      fullName: 'Diego Fuentes',
      address: 'Camino a Coronel 8500'
    },
    estimatedDelivery: '2026-01-20',
    createdAt: '2026-01-06T12:00:00Z',
    updatedAt: '2026-01-06T18:30:00Z'
  },
  {
    id: '11',
    userId: '14',
    orderNumber: 'ORD-2026-011',
    date: '2026-01-04T09:05:00Z',
    status: 'cancelado',
    paymentStatus: 'pendiente',
    paymentMethod: 'transferencia',
    customerName: 'Camila Reyes',
    customerEmail: 'compras@clinicacordillera.cl',
    customerPhone: '+56 2 2688 7788',
    organization: 'Clinica Cordillera',
    taxId: '76.987.654-3',
    vendorId: 'v1',
    cancelledAt: '2026-01-05T10:15:00Z',
    items: [
      {
        productId: '14',
        productName: 'Equipo de Rayos X Portatil',
        quantity: 1,
        unitPrice: 5400000,
        subtotal: 5400000,
        id: '14',
        name: 'Equipo de Rayos X Portatil',
        price: 5400000,
        sku: 'RX-2024-014'
      }
    ],
    products: [
      {
        productId: '14',
        productName: 'Equipo de Rayos X Portatil',
        quantity: 1,
        unitPrice: 5400000,
        subtotal: 5400000,
        id: '14',
        name: 'Equipo de Rayos X Portatil',
        price: 5400000,
        sku: 'RX-2024-014'
      }
    ],
    subtotal: 5400000,
    tax: 540000,
    shippingCost: 25000,
    discount: 0,
    total: 5965000,
    shippingAddress: {
      street: 'Av. Las Condes 12450',
      city: 'Las Condes',
      state: 'Region Metropolitana',
      region: 'Region Metropolitana',
      zipCode: '7560000',
      postalCode: '7560000',
      country: 'Chile',
      phone: '+56 2 2688 7788',
      contactName: 'Camila Reyes',
      fullName: 'Camila Reyes',
      address: 'Av. Las Condes 12450'
    },
    estimatedDelivery: '2026-01-12',
    createdAt: '2026-01-04T09:05:00Z',
    updatedAt: '2026-01-05T10:15:00Z'
  },
  {
    id: '1',
    userId: 'user1',
    orderNumber: 'ORD-2026-001',
    date: '2026-01-05',
    status: 'procesando',
    paymentStatus: 'pendiente',
    paymentMethod: 'transferencia',
    customerName: 'Juan Pérez',
    customerEmail: 'cliente@example.com',
    customerPhone: '+56 9 1234 5678',
    organization: 'Empresa Demo',
    taxId: '76.XXX.XXX-1',
    products: [
      { id: '1', name: 'Control de Acceso Biométrico', productId: '1', productName: 'Control de Acceso Biométrico', quantity: 2, price: 450000, unitPrice: 450000, subtotal: 900000, sku: 'CAB-2024-100' },
      { id: '2', name: 'Lector RFID', productId: '2', productName: 'Lector RFID', quantity: 5, price: 120000, unitPrice: 120000, subtotal: 600000, sku: 'RFID-2024-200' }
    ],
    subtotal: 1500000,
    tax: 150000,
    shippingCost: 0,
    discount: 0,
    total: 1650000,
    shippingAddress: {
      street: 'Av. Providencia 1234',
      city: 'Santiago',
      state: 'Región Metropolitana',
      zipCode: '7500000',
      country: 'Chile',
      phone: '+56 9 1234 5678',
      contactName: 'Juan Pérez'
    },
    estimatedDelivery: '2026-01-12',
    trackingNumber: 'TRK-001-2026',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-05T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    orderNumber: 'ORD-2026-002',
    date: '2026-01-03',
    status: 'enviado',
    paymentStatus: 'pagado',
    paymentMethod: 'credito_30',
    customerName: 'Juan Pérez',
    customerEmail: 'cliente@example.com',
    customerPhone: '+56 9 1234 5678',
    organization: 'Empresa Demo',
    products: [
      { id: '3', name: 'Sistema de Torniquetes', productId: '3', productName: 'Sistema de Torniquetes', quantity: 1, price: 1200000, unitPrice: 1200000, subtotal: 1200000 }
    ],
    subtotal: 1200000,
    tax: 120000,
    shippingCost: 0,
    discount: 0,
    total: 1320000,
    shippingAddress: {
      street: 'Av. Providencia 1234',
      city: 'Santiago',
      state: 'Región Metropolitana',
      zipCode: '7500000',
      country: 'Chile',
      phone: '+56 9 1234 5678',
      contactName: 'Juan Pérez'
    },
    estimatedDelivery: '2026-01-09',
    trackingNumber: 'TRK-002-2026',
    createdAt: '2026-01-03T10:00:00Z',
    updatedAt: '2026-01-03T10:00:00Z'
  },
  {
    id: '3',
    userId: 'user1',
    userEmail: 'cliente@example.com',
    date: '2025-12-20',
    status: 'entregado',
    paymentStatus: 'pagado',
    paymentMethod: 'transferencia',
    customerName: 'Juan Pérez',
    customerEmail: 'cliente@example.com',
    customerPhone: '+56 9 1234 5678',
    organization: 'Empresa Demo',
    products: [
      { id: '4', name: 'Cámaras de Seguridad', productId: '4', productName: 'Cámaras de Seguridad', quantity: 10, price: 250000, unitPrice: 250000, subtotal: 2500000 }
    ],
    subtotal: 2500000,
    tax: 250000,
    shippingCost: 0,
    discount: 0,
    total: 2750000,
    shippingAddress: {
      street: 'Av. Providencia 1234',
      city: 'Santiago',
      state: 'Región Metropolitana',
      zipCode: '7500000',
      country: 'Chile',
      phone: '+56 9 1234 5678',
      contactName: 'Juan Pérez'
    },
    estimatedDelivery: '2025-12-28',
    trackingNumber: 'TRK-045-2025',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2025-12-20T10:00:00Z'
  },
  {
    id: '4',
    userId: 'user2',
    orderNumber: 'ORD-2026-004',
    date: '2026-01-09T08:30:00Z',
    status: 'pendiente',
    paymentStatus: 'pendiente',
    paymentMethod: 'transferencia',
    customerName: 'María González',
    customerEmail: 'mgonzalez@empresa.cl',
    customerPhone: '+56 9 8765 4321',
    organization: 'TechCorp Ltda',
    taxId: '77.YYY.YYY-2',
    items: [
      { 
        productId: '5', 
        productName: 'Sistema de Control de Asistencia', 
        quantity: 3, 
        unitPrice: 380000, 
        subtotal: 1140000,
        id: '5',
        name: 'Sistema de Control de Asistencia',
        price: 380000,
        sku: 'SCA-2024-001'
      },
      { 
        productId: '6', 
        productName: 'Terminal Biométrico', 
        quantity: 2, 
        unitPrice: 290000, 
        subtotal: 580000,
        id: '6',
        name: 'Terminal Biométrico',
        price: 290000,
        sku: 'TB-2024-002'
      }
    ],
    products: [
      { 
        productId: '5', 
        productName: 'Sistema de Control de Asistencia', 
        quantity: 3, 
        unitPrice: 380000, 
        subtotal: 1140000,
        id: '5',
        name: 'Sistema de Control de Asistencia',
        price: 380000,
        sku: 'SCA-2024-001'
      },
      { 
        productId: '6', 
        productName: 'Terminal Biométrico', 
        quantity: 2, 
        unitPrice: 290000, 
        subtotal: 580000,
        id: '6',
        name: 'Terminal Biométrico',
        price: 290000,
        sku: 'TB-2024-002'
      }
    ],
    subtotal: 1720000,
    tax: 172000,
    shippingCost: 15000,
    discount: 0,
    total: 1907000,
    shippingAddress: {
      street: 'Av. Apoquindo 3000',
      city: 'Las Condes',
      state: 'Región Metropolitana',
      region: 'Región Metropolitana',
      zipCode: '7550000',
      postalCode: '7550000',
      country: 'Chile',
      phone: '+56 9 8765 4321',
      contactName: 'María González',
      fullName: 'María González',
      address: 'Av. Apoquindo 3000',
      apartment: 'Oficina 502',
      instructions: 'Tocar el timbre de la oficina 502'
    },
    estimatedDelivery: '2026-01-15',
    createdAt: '2026-01-09T08:30:00Z',
    updatedAt: '2026-01-09T08:30:00Z'
  },
  {
    id: '11',
    userId: 'user3',
    orderNumber: 'ORD-2026-011',
    date: '2026-01-07T14:20:00Z',
    status: 'confirmado',
    paymentStatus: 'pagado',
    paymentMethod: 'credito_30',
    customerName: 'Pedro Sánchez',
    customerEmail: 'psanchez@industrias.cl',
    customerPhone: '+56 9 5555 9999',
    organization: 'Industrias del Sur',
    taxId: '78.ZZZ.ZZZ-3',
    items: [
      { 
        productId: '7', 
        productName: 'Barrera Vehicular Automática', 
        quantity: 1, 
        unitPrice: 1850000, 
        subtotal: 1850000,
        id: '7',
        name: 'Barrera Vehicular Automática',
        price: 1850000,
        sku: 'BVA-2024-003'
      },
      { 
        productId: '8', 
        productName: 'Kit de Señalización LED', 
        quantity: 4, 
        unitPrice: 95000, 
        subtotal: 380000,
        id: '8',
        name: 'Kit de Señalización LED',
        price: 95000,
        sku: 'KSL-2024-004'
      }
    ],
    products: [
      { 
        productId: '7', 
        productName: 'Barrera Vehicular Automática', 
        quantity: 1, 
        unitPrice: 1850000, 
        subtotal: 1850000,
        id: '7',
        name: 'Barrera Vehicular Automática',
        price: 1850000,
        sku: 'BVA-2024-003'
      },
      { 
        productId: '8', 
        productName: 'Kit de Señalización LED', 
        quantity: 4, 
        unitPrice: 95000, 
        subtotal: 380000,
        id: '8',
        name: 'Kit de Señalización LED',
        price: 95000,
        sku: 'KSL-2024-004'
      }
    ],
    subtotal: 2230000,
    tax: 223000,
    shippingCost: 25000,
    discount: 50000,
    total: 2428000,
    shippingAddress: {
      street: 'Ruta 5 Sur Km 1050',
      city: 'Temuco',
      state: 'Región de La Araucanía',
      region: 'Región de La Araucanía',
      zipCode: '4780000',
      postalCode: '4780000',
      country: 'Chile',
      phone: '+56 9 5555 9999',
      contactName: 'Pedro Sánchez',
      fullName: 'Pedro Sánchez',
      address: 'Ruta 5 Sur Km 1050',
      apartment: 'Galpón 3',
      instructions: 'Entrada por portón trasero'
    },
    estimatedDelivery: '2026-01-18',
    createdAt: '2026-01-07T14:20:00Z',
    updatedAt: '2026-01-08T14:00:00Z'
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

/**
 * IMPORTANTE: Para usar Firebase Auth, debes crear los usuarios en Firebase Console:
 * 1. Ve a Firebase Console > Authentication > Users
 * 2. Crea usuarios con los emails de mockUsers y contraseñas correspondientes:
 *    - socio@amilab.com / demo123
 *    - admin@amilab.com / admin123  
 *    - root@amilab.com / root2026
 *    - vendedor1@amilab.com / vende123
 *    - vendedor2@amilab.com / vende123
 */

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

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    await delay(600);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado');
    Object.assign(order, updates);
    return order;
  },

  async approveQuotationAsVendor(orderId: string, notes?: string): Promise<Order> {
    await delay(700);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado');
    
    order.status = 'aprobado_vendedor';
    order.vendorApprovedAt = new Date().toISOString();
    if (notes) order.vendorNotes = notes;
    order.updatedAt = new Date().toISOString();
    
    // Automáticamente cambia a pendiente_admin
    setTimeout(() => {
      order.status = 'pendiente_admin';
    }, 100);
    
    return order;
  },

  async approveOrderAsAdmin(orderId: string, notes?: string): Promise<Order> {
    await delay(700);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado');
    
    order.status = 'aprobado_admin';
    order.adminApprovedAt = new Date().toISOString();
    if (notes) order.adminNotes = notes;
    order.updatedAt = new Date().toISOString();
    
    // Automáticamente cambia a confirmado
    setTimeout(() => {
      order.status = 'confirmado';
    }, 100);
    
    return order;
  },

  async rejectOrder(orderId: string, reason: string, rejectedBy: string): Promise<Order> {
    await delay(700);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado');
    
    order.status = 'rechazado';
    order.rejectedAt = new Date().toISOString();
    order.rejectedBy = rejectedBy;
    order.rejectionReason = reason;
    order.updatedAt = new Date().toISOString();
    
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
