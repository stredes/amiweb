import { auth } from '../../../lib/firebase';
import { Order, OrderProduct, ShippingAddress } from '../../auth/types';
import { backendApi, CreateOrderRequest } from '../../api/backendApiService';

export interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  organization: string;
  taxId?: string;
  products: OrderProduct[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'transferencia' | 'efectivo' | 'cheque' | 'tarjeta' | 'credito_30' | 'credito_60' | 'credito_90';
  notes?: string;
}

export interface OrderNotification {
  orderId: string;
  userId: string;
  type: 'status_change' | 'created' | 'cancelled';
  message: string;
  timestamp: Date;
  read: boolean;
}

class OrderService {
  /**
   * Crea una nueva orden usando la API del backend
   */
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    // Calcular totales
    const subtotal = orderData.products.reduce((sum, p) => sum + (p.subtotal || (p.quantity * (p.unitPrice || p.price || 0))), 0);
    const tax = Math.round(subtotal * 0.1); // 10% de impuesto
    const shippingCost = 0; // Por ahora sin costo de envío
    const discount = 0;
    const total = subtotal + tax + shippingCost - discount;

    const createOrderRequest: CreateOrderRequest = {
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      organization: orderData.organization,
      taxId: orderData.taxId,
      items: orderData.products.map(p => ({
        productId: p.productId || p.id || '',
        productName: p.productName || p.name || '',
        quantity: p.quantity,
        unitPrice: p.unitPrice || p.price || 0,
        subtotal: p.subtotal || (p.quantity * (p.unitPrice || p.price || 0)),
      })),
      subtotal,
      discount,
      tax,
      shippingCost,
      total,
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      customerNotes: orderData.notes,
    };

    try {
      const response = await backendApi.createOrder(createOrderRequest);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al crear la orden');
      }

      return response.data;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  }

  /**
   * Obtiene una orden por ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await backendApi.getOrder(orderId);
      
      if (!response.success) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Error al obtener orden:', error);
      return null;
    }
  }

  /**
   * Obtiene todas las órdenes del usuario actual
   */
  async getUserOrders(): Promise<Order[]> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const response = await backendApi.listOrders({
        customerEmail: user.email || undefined,
        pageSize: 100,
      });

      if (!response.success) {
        throw new Error(response.error || 'Error al obtener órdenes');
      }

      return response.data.items;
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw new Error('No se pudo obtener las órdenes');
    }
  }

  /**
   * Obtiene todas las órdenes (solo para admins)
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await backendApi.listOrders({
        pageSize: 100,
      });

      if (!response.success) {
        throw new Error(response.error || 'Error al obtener órdenes');
      }

      return response.data.items;
    } catch (error) {
      console.error('Error al obtener todas las órdenes:', error);
      throw new Error('No se pudo obtener las órdenes');
    }
  }

  /**
   * Actualiza el estado de una orden
   */
  async updateOrderStatus(
    orderId: string, 
    status: Order['status'], 
    trackingNumber?: string
  ): Promise<void> {
    try {
      const response = await backendApi.updateOrder(orderId, {
        status,
        trackingNumber,
      });

      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar orden');
      }
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
      throw new Error('No se pudo actualizar el estado de la orden');
    }
  }

  /**
   * Confirma la entrega por parte del cliente
   */
  async confirmDelivery(orderId: string): Promise<void> {
    try {
      const response = await backendApi.updateOrder(orderId, {
        confirmDelivery: true,
      });

      if (!response.success) {
        throw new Error(response.error || 'Error al confirmar entrega');
      }
    } catch (error) {
      console.error('Error al confirmar entrega:', error);
      throw new Error('No se pudo confirmar la entrega');
    }
  }

  /**
   * Cancela una orden
   */
  async cancelOrder(orderId: string): Promise<void> {
    try {
      const response = await backendApi.cancelOrder(orderId);

      if (!response.success) {
        throw new Error(response.error || 'Error al cancelar orden');
      }
    } catch (error) {
      console.error('Error al cancelar orden:', error);
      throw error;
    }
  }

  /**
   * Obtiene la etiqueta del estado
   */
  getStatusLabel(status: Order['status']): string {
    const labels: Record<Order['status'], string> = {
      'pendiente': 'Pendiente',
      'confirmado': 'Confirmado',
      'procesando': 'Procesando',
      'enviado': 'Enviado',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado',
    };
    return labels[status];
  }

  /**
   * Obtiene la etiqueta del estado de pago
   */
  getPaymentStatusLabel(paymentStatus: Order['paymentStatus']): string {
    const labels: Record<Order['paymentStatus'], string> = {
      'pendiente': 'Pendiente',
      'parcial': 'Pago Parcial',
      'pagado': 'Pagado',
      'reembolsado': 'Reembolsado',
    };
    return labels[paymentStatus];
  }

  /**
   * Obtiene estadísticas de órdenes (para dashboard admin)
   */
  async getOrderStats(): Promise<{
    total: number;
    pendientes: number;
    enProceso: number;
    entregados: number;
    cancelados: number;
    ventasMes: number;
  }> {
    try {
      const response = await backendApi.listOrders({ pageSize: 1000 });
      
      if (!response.success) {
        throw new Error(response.error || 'Error al obtener estadísticas');
      }

      const orders = response.data.items;
      const mesActual = new Date().getMonth();

      let pendientes = 0;
      let enProceso = 0;
      let entregados = 0;
      let cancelados = 0;
      let ventasMes = 0;

      orders.forEach((order) => {
        switch (order.status) {
          case 'pendiente':
            pendientes++;
            break;
          case 'confirmado':
          case 'procesando':
          case 'enviado':
            enProceso++;
            break;
          case 'entregado':
            entregados++;
            break;
          case 'cancelado':
            cancelados++;
            break;
        }

        // Ventas del mes actual
        const orderDate = new Date(order.date);
        if (orderDate.getMonth() === mesActual && order.status !== 'cancelado') {
          ventasMes += order.total || 0;
        }
      });

      return {
        total: orders.length,
        pendientes,
        enProceso,
        entregados,
        cancelados,
        ventasMes,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        total: 0,
        pendientes: 0,
        enProceso: 0,
        entregados: 0,
        cancelados: 0,
        ventasMes: 0,
      };
    }
  }

  // ==================== NOTIFICACIONES ====================
  // NOTA: Las notificaciones se manejan ahora en el backend
  // Estos métodos quedan para compatibilidad pero no hacen nada

  async getUserNotifications(): Promise<OrderNotification[]> {
    console.warn('getUserNotifications: Las notificaciones ahora se manejan en el backend');
    return [];
  }

  /** @deprecated Backend handles notifications */
  async markNotificationAsRead(): Promise<void> {
    console.warn('markNotificationAsRead: Las notificaciones ahora se manejan en el backend');
  }
}

export const orderService = new OrderService();
