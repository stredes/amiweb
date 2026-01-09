import { OrderProduct, ShippingAddress } from '../auth/types';
import { httpRequest } from '../../lib/httpClient';

export interface CreateQuoteData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  organization: string;
  taxId?: string;
  products: OrderProduct[];
  notes?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  userId: string;
  vendorId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  organization: string;
  taxId?: string;
  items: OrderProduct[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'pendiente' | 'en_revision_vendedor' | 'aprobado_vendedor' | 'rechazado_vendedor' | 'en_revision_admin' | 'aprobado' | 'rechazado' | 'convertida';
  customerNotes?: string;
  vendorNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  vendorApprovedAt?: string;
  adminApprovedAt?: string;
  convertedToOrderAt?: string;
  orderId?: string;
}

export interface QuoteNotification {
  id: string;
  userId: string;
  quoteId: string;
  type: 'quote_created' | 'vendor_approved' | 'vendor_rejected' | 'admin_approved' | 'admin_rejected' | 'converted_to_order';
  message: string;
  read: boolean;
  createdAt: string;
}

class QuoteService {
  /**
   * Crea una nueva cotización
   */
  async createQuote(quoteData: CreateQuoteData): Promise<Quote> {
    // Calcular totales
    const subtotal = quoteData.products.reduce(
      (sum, p) => sum + (p.subtotal || (p.quantity * (p.unitPrice || p.price || 0))), 
      0
    );
    const tax = Math.round(subtotal * 0.19); // IVA 19%
    const discount = 0;
    const total = subtotal + tax - discount;

    const response = await httpRequest<Quote>('/api/quotes', {
      method: 'POST',
      body: {
        customerName: quoteData.customerName,
        customerEmail: quoteData.customerEmail,
        customerPhone: quoteData.customerPhone,
        organization: quoteData.organization,
        taxId: quoteData.taxId,
        items: quoteData.products.map(p => ({
          productId: p.productId || p.id || '',
          productName: p.productName || p.name || '',
          quantity: p.quantity,
          unitPrice: p.unitPrice || p.price || 0,
          subtotal: p.subtotal || (p.quantity * (p.unitPrice || p.price || 0)),
          sku: p.sku
        })),
        subtotal,
        discount,
        tax,
        total,
        customerNotes: quoteData.notes
      }
    });

    return response;
  }

  /**
   * Obtiene cotizaciones pendientes para el vendedor
   */
  async getVendorPendingQuotes(): Promise<Quote[]> {
    const response = await httpRequest<Quote[]>('/api/quotes/vendor/pending');
    return response;
  }

  /**
   * Aprobar/rechazar cotización como vendedor
   */
  async vendorApproveQuote(quoteId: string, approved: boolean, notes?: string): Promise<Quote> {
    const response = await httpRequest<Quote>(`/api/quotes/${quoteId}/vendor-approve`, {
      method: 'POST',
      body: { approved, notes }
    });
    return response;
  }

  /**
   * Aprobar/rechazar cotización como admin
   */
  async adminApproveQuote(quoteId: string, approved: boolean, notes?: string): Promise<Quote> {
    const response = await httpRequest<Quote>(`/api/quotes/${quoteId}/admin-approve`, {
      method: 'POST',
      body: { approved, notes }
    });
    return response;
  }

  /**
   * Convertir cotización aprobada a orden
   */
  async convertQuoteToOrder(
    quoteId: string, 
    paymentMethod: string, 
    shippingAddress: ShippingAddress
  ): Promise<any> {
    const response = await httpRequest(`/api/quotes/${quoteId}/convert-to-order`, {
      method: 'POST',
      body: { paymentMethod, shippingAddress }
    });
    return response;
  }

  /**
   * Obtener notificaciones
   */
  async getNotifications(unreadOnly: boolean = false): Promise<QuoteNotification[]> {
    const url = unreadOnly ? '/api/notifications?unreadOnly=true' : '/api/notifications';
    const response = await httpRequest<QuoteNotification[]>(url);
    return response;
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllNotificationsAsRead(): Promise<void> {
    await httpRequest('/api/notifications', {
      method: 'PATCH',
      body: { markAllAsRead: true }
    });
  }

  /**
   * Marcar una notificación como leída
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    await httpRequest(`/api/notifications/${notificationId}`, {
      method: 'PATCH',
      body: { read: true }
    });
  }
}

export const quoteService = new QuoteService();
