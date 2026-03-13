export type AdminAssistantUserRole = 'admin' | 'root';

export interface AdminAssistantSuggestion {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  domain: 'sales' | 'clients' | 'orders' | 'inventory' | 'vendors';
}

export interface AdminAssistantChatRequest {
  message: string;
  sessionId?: string;
}

export interface AdminAssistantTable {
  columns: string[];
  rows: Array<Record<string, string | number | null>>;
}

export interface AdminAssistantChatResponse {
  answer: string;
  table: AdminAssistantTable;
  meta: {
    requestId?: string;
    sessionId?: string;
    status?: 'backend_pending' | 'connected';
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
  message: string,
  sessionId?: string
): AdminAssistantChatRequest {
  const normalizedMessage = message.trim();

  return {
    message: normalizedMessage,
    ...(sessionId ? { sessionId } : {}),
  };
}

export function normalizeAdminAssistantResponse(
  response: Partial<AdminAssistantChatResponse>
): AdminAssistantChatResponse {
  return {
    answer: response.answer || 'Sin respuesta del asistente.',
    table: {
      columns: response.table?.columns || [],
      rows: response.table?.rows || [],
    },
    meta: {
      requestId: response.meta?.requestId,
      sessionId: response.meta?.sessionId,
      status: response.meta?.status || 'connected',
    },
  };
}

export function createPendingAssistantResponse(question: string): AdminAssistantChatResponse {
  return {
    answer:
      'La interfaz ya esta lista, pero el backend del asistente aun no esta conectado. Esta consulta quedara disponible cuando exista el endpoint productivo.',
    table: {
      columns: ['campo', 'valor_esperado'],
      rows: [
        { campo: 'consulta', valor_esperado: question.trim() },
        { campo: 'endpoint', valor_esperado: ADMIN_ASSISTANT_ENDPOINT },
        { campo: 'estado', valor_esperado: 'Esperando integracion backend' },
      ],
    },
    meta: {
      requestId: 'pending-backend',
      status: 'backend_pending',
    },
  };
}
