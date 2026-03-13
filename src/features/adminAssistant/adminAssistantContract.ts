export type AdminAssistantUserRole = 'admin' | 'root';

export type AdminAssistantVisualization = 'text' | 'table' | 'kpi' | 'chart';

export interface AdminAssistantSuggestion {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  domain: 'sales' | 'clients' | 'orders' | 'inventory' | 'vendors';
}

export interface AdminAssistantQueryRequest {
  question: string;
  context: {
    scope: 'admin';
    userRole: AdminAssistantUserRole;
    page: 'admin-dashboard';
    requestedAt: string;
  };
}

export interface AdminAssistantQueryResponse {
  answer: string;
  queryLabel: string;
  visualization: AdminAssistantVisualization;
  columns: string[];
  rows: Array<Record<string, string | number | null>>;
  requestId?: string;
  metadata: {
    status: 'backend_pending' | 'connected';
    backendEndpoint: string;
  };
}

export interface AdminAssistantMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export const ADMIN_ASSISTANT_ENDPOINT = '/api/admin/assistant/query';

const ADMIN_ASSISTANT_SUGGESTIONS: AdminAssistantSuggestion[] = [
  {
    id: 'sales-by-vendor',
    label: 'Ventas por vendedor',
    prompt: 'Muéstrame las ventas del mes agrupadas por vendedor.',
    icon: '📈',
    domain: 'sales',
  },
  {
    id: 'inactive-clients',
    label: 'Clientes inactivos',
    prompt: 'Qué clientes no han comprado en los últimos 60 días.',
    icon: '🤝',
    domain: 'clients',
  },
  {
    id: 'pending-orders',
    label: 'Pedidos pendientes',
    prompt: 'Resume los pedidos pendientes por estado y prioridad.',
    icon: '📦',
    domain: 'orders',
  },
  {
    id: 'top-products',
    label: 'Top productos',
    prompt: 'Cuáles son los productos con mayor rotación este mes.',
    icon: '🧪',
    domain: 'inventory',
  },
  {
    id: 'vendor-portfolio',
    label: 'Cartera por vendedor',
    prompt: 'Compara la cartera de clientes asignada a cada vendedor.',
    icon: '👥',
    domain: 'vendors',
  },
  {
    id: 'risk-accounts',
    label: 'Cuentas en riesgo',
    prompt: 'Detecta cuentas con caída de pedidos o actividad comercial.',
    icon: '⚠️',
    domain: 'clients',
  },
];

export function getAdminAssistantSuggestions(): AdminAssistantSuggestion[] {
  return ADMIN_ASSISTANT_SUGGESTIONS;
}

export function buildAdminAssistantRequest(
  question: string,
  userRole: AdminAssistantUserRole
): AdminAssistantQueryRequest {
  return {
    question: question.trim(),
    context: {
      scope: 'admin',
      userRole,
      page: 'admin-dashboard',
      requestedAt: new Date().toISOString(),
    },
  };
}

export function createPendingAssistantResponse(question: string): AdminAssistantQueryResponse {
  return {
    answer:
      'La interfaz ya esta lista, pero el backend del asistente aun no esta conectado. Esta consulta quedara disponible cuando exista el endpoint productivo.',
    queryLabel: `Consulta pendiente de backend: ${question.trim()}`,
    visualization: 'table',
    columns: ['campo', 'valor_esperado'],
    rows: [
      { campo: 'endpoint', valor_esperado: ADMIN_ASSISTANT_ENDPOINT },
      { campo: 'estado', valor_esperado: 'Esperando integracion backend' },
      { campo: 'formato', valor_esperado: 'success/data con answer, columns, rows y requestId' },
    ],
    metadata: {
      status: 'backend_pending',
      backendEndpoint: ADMIN_ASSISTANT_ENDPOINT,
    },
  };
}
