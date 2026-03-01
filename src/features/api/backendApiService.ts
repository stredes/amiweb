import { API_BASE_URL, API_VERSION, ENABLE_API_DIAGNOSTICS } from '../../config/env';
import { Order, OrderProduct, ShippingAddress } from '../auth/types';
import { auth } from '../../lib/firebase';
import { ApiRequestError, mapApiErrorMessage, resolveApiEndpoint } from '../../lib/apiContract';

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  organization: string;
  taxId?: string;
  items: OrderProduct[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'transferencia' | 'efectivo' | 'cheque' | 'tarjeta' | 'credito_30' | 'credito_60' | 'credito_90';
  shippingAddress: ShippingAddress;
  customerNotes?: string;
}

export interface UpdateOrderRequest {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
  trackingNumber?: string;
  internalNotes?: string;
  confirmDelivery?: boolean;
}

export interface WarehouseStockItem {
  familia: string;
  subfamilia: string;
  producto: string;
  unidad: string;
  unidadNegocio: string;
  bodega: string;
  ubicacion: string;
  serie?: string;
  lote?: string | null;
  fechaVencimiento?: string | null;
  porLlegar?: number;
  reserva?: number;
  saldoStock?: number;
  codigoArticulo?: string;
  marca?: string;
  origen?: string;
  isTemporaryStock?: boolean;
  date?: string;
}

export interface WarehouseStockSummary {
  totalStock?: number;
  totalReserva?: number;
  totalPorLlegar?: number;
}

export interface WarehouseStockResponse extends PaginatedResponse<WarehouseStockItem> {
  summary?: WarehouseStockSummary;
}

export interface WarehouseStockParams {
  date?: string;
  familia?: string;
  subfamilia?: string;
  bodega?: string;
  ubicacion?: string;
  codigoArticulo?: string;
  unidadNegocio?: string;
  marca?: string;
  origen?: string;
  includeTemporaryStock?: boolean;
  hideNoStock?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ListOrdersParams {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
  customerEmail?: string;
  orderNumber?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Servicio para comunicarse con las APIs del backend
 */
class BackendApiService {
  private baseUrl: string;

  constructor() {
    // Normalizar URL: remover trailing slash si existe
    const url = API_BASE_URL || 'http://localhost:3000';
    this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const resolvedEndpoint = resolveApiEndpoint(endpoint, API_VERSION);
    const url = `${this.baseUrl}${resolvedEndpoint}`;
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    };

    try {
      if (ENABLE_API_DIAGNOSTICS) {
        console.info('[BackendApi request]', {
          endpoint,
          resolvedEndpoint,
          url,
          method: config.method || 'GET',
          origin: window.location.origin,
        });
      }

      const response = await fetch(url, config);
      const requestId = response.headers.get('x-request-id') || response.headers.get('x-vercel-id') || undefined;
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : await response.text();

      if (ENABLE_API_DIAGNOSTICS) {
        console.info('[BackendApi response]', {
          endpoint,
          resolvedEndpoint,
          url,
          status: response.status,
          requestId,
        });
      }

      if (!response.ok) {
        const code =
          data && typeof data === 'object' && 'code' in (data as Record<string, unknown>)
            ? String((data as Record<string, unknown>).code || '')
            : undefined;
        const fallbackMessage =
          data && typeof data === 'object' && 'error' in (data as Record<string, unknown>)
            ? String((data as Record<string, unknown>).error || `Error ${response.status}: ${response.statusText}`)
            : `Error ${response.status}: ${response.statusText}`;
        const message = mapApiErrorMessage(code, fallbackMessage);
        throw new ApiRequestError({
          message: requestId ? `${message} (requestId: ${requestId})` : message,
          endpoint,
          url,
          code,
          status: response.status,
          requestId,
          details:
            data && typeof data === 'object' && 'details' in (data as Record<string, unknown>)
              ? ((data as Record<string, unknown>).details as Record<string, unknown>)
              : undefined,
        });
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ==================== ORDERS ====================

  /**
   * Crear una nueva orden
   */
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Listar órdenes con filtros
   */
  async listOrders(params: ListOrdersParams = {}): Promise<ApiResponse<PaginatedResponse<Order>>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/orders${queryString ? `?${queryString}` : ''}`;

    return this.request<ApiResponse<PaginatedResponse<Order>>>(endpoint);
  }

  /**
   * Obtener detalles de una orden específica
   */
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>(`/api/orders/${orderId}`);
  }

  /**
   * Actualizar una orden
   */
  async updateOrder(orderId: string, updates: UpdateOrderRequest): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Cancelar una orden
   */
  async cancelOrder(orderId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });
  }

  // ==================== QUOTES ====================

  /**
   * Solicitar una cotización
   */
  async createQuote(quoteData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    organization: string;
    items: Array<{ productId: string; productName: string; quantity: number }>;
    customerMessage?: string;
  }): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  }

  /**
   * Listar cotizaciones
   */
  async listQuotes(params: {
    status?: string;
    customerEmail?: string;
    quoteNumber?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/quotes${queryString ? `?${queryString}` : ''}`;

    return this.request<ApiResponse<PaginatedResponse<any>>>(endpoint);
  }

  /**
   * Obtener detalles de una cotización
   */
  async getQuote(quoteId: string): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/api/quotes/${quoteId}`);
  }

  /**
   * Actualizar cotización (vendedor)
   */
  async updateQuote(quoteId: string, updates: any): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/api/quotes/${quoteId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // ==================== WAREHOUSE STOCK ====================

  async listWarehouseStock(params: WarehouseStockParams = {}): Promise<ApiResponse<WarehouseStockResponse>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    const endpoint = `/api/warehouse/stock${queryString ? `?${queryString}` : ''}`;
    return this.request<ApiResponse<WarehouseStockResponse>>(endpoint);
  }

  async listWarehouseCatalog(endpoint: string, params: Record<string, string | undefined> = {}): Promise<ApiResponse<string[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    const url = `/api/warehouse/catalog/${endpoint}${queryString ? `?${queryString}` : ''}`;
    return this.request<ApiResponse<string[]>>(url);
  }

  /**
   * Cambiar estado de cotización (cliente: aceptar/rechazar)
   */
  async changeQuoteStatus(quoteId: string, status: string): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/api/quotes/${quoteId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ==================== CART ====================

  /**
   * Obtener carrito actual
   */
  async getCart(userId?: string, sessionId?: string): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    if (sessionId) headers['x-session-id'] = sessionId;

    return this.request<ApiResponse<any>>('/api/cart', { headers });
  }

  /**
   * Agregar producto al carrito
   */
  async addToCart(
    productId: string,
    quantity: number,
    userId?: string,
    sessionId?: string
  ): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    if (sessionId) headers['x-session-id'] = sessionId;

    return this.request<ApiResponse<any>>('/api/cart', {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId, quantity }),
    });
  }

  /**
   * Actualizar carrito completo
   */
  async updateCart(
    items: Array<{ productId: string; quantity: number }>,
    userId?: string,
    sessionId?: string
  ): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    if (sessionId) headers['x-session-id'] = sessionId;

    return this.request<ApiResponse<any>>('/api/cart', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ items }),
    });
  }

  /**
   * Vaciar carrito
   */
  async clearCart(userId?: string, sessionId?: string): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    if (sessionId) headers['x-session-id'] = sessionId;

    return this.request<ApiResponse<any>>('/api/cart', {
      method: 'DELETE',
      headers,
    });
  }

  /**
   * Actualizar cantidad de un item
   */
  async updateCartItem(
    productId: string,
    quantity: number,
    userId?: string,
    sessionId?: string
  ): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    if (sessionId) headers['x-session-id'] = sessionId;

    return this.request<ApiResponse<any>>(`/api/cart/items/${productId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ quantity }),
    });
  }

  /**
   * Eliminar item del carrito
   */
  async removeFromCart(
    productId: string,
    userId?: string,
    sessionId?: string
  ): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    if (sessionId) headers['x-session-id'] = sessionId;

    return this.request<ApiResponse<any>>(`/api/cart/items/${productId}`, {
      method: 'DELETE',
      headers,
    });
  }
}

export const backendApi = new BackendApiService();
