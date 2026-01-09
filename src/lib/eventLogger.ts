import { logger } from './logger';

/**
 * Utilidades para logging de eventos de usuario
 */

// Autenticación
export const logAuthEvent = {
  login: (userId: string, method: string) => {
    logger.info('User logged in', { userId, method });
    logger.logEvent('login', { method });
  },
  
  logout: (userId: string) => {
    logger.info('User logged out', { userId });
    logger.logEvent('logout');
  },
  
  signUp: (userId: string, method: string) => {
    logger.info('User signed up', { userId, method });
    logger.logEvent('sign_up', { method });
  },
  
  authError: (error: string, context?: Record<string, any>) => {
    logger.error('Authentication error', { error, ...context });
    logger.logEvent('auth_error', { error });
  }
};

// Navegación
export const logNavigationEvent = {
  pageView: (path: string, title?: string) => {
    logger.debug('Page viewed', { path, title });
    logger.logEvent('page_view', { page_path: path, page_title: title });
  },
  
  routeChange: (from: string, to: string) => {
    logger.debug('Route changed', { from, to });
    logger.logEvent('route_change', { from, to });
  }
};

// Productos
export const logProductEvent = {
  view: (productId: string, productName: string) => {
    logger.debug('Product viewed', { productId, productName });
    logger.logEvent('view_item', { 
      item_id: productId, 
      item_name: productName 
    });
  },
  
  addToCart: (productId: string, productName: string, quantity: number, price: number) => {
    logger.info('Product added to cart', { productId, productName, quantity, price });
    logger.logEvent('add_to_cart', {
      item_id: productId,
      item_name: productName,
      quantity,
      value: price * quantity
    });
  },
  
  removeFromCart: (productId: string, productName: string) => {
    logger.info('Product removed from cart', { productId, productName });
    logger.logEvent('remove_from_cart', {
      item_id: productId,
      item_name: productName
    });
  },
  
  search: (searchTerm: string, resultsCount: number) => {
    logger.debug('Product search', { searchTerm, resultsCount });
    logger.logEvent('search', { 
      search_term: searchTerm,
      results_count: resultsCount
    });
  }
};

// Carrito y Compras
export const logCartEvent = {
  beginCheckout: (cartValue: number, itemCount: number) => {
    logger.info('Checkout started', { cartValue, itemCount });
    logger.logEvent('begin_checkout', {
      value: cartValue,
      items_count: itemCount
    });
  },
  
  purchase: (orderId: string, value: number, items: number) => {
    logger.info('Purchase completed', { orderId, value, items });
    logger.logEvent('purchase', {
      transaction_id: orderId,
      value,
      items
    });
  },
  
  abandonCart: (cartValue: number, itemCount: number) => {
    logger.warn('Cart abandoned', { cartValue, itemCount });
    logger.logEvent('cart_abandoned', {
      value: cartValue,
      items_count: itemCount
    });
  }
};

// Wishlist
export const logWishlistEvent = {
  add: (productId: string, productName: string) => {
    logger.debug('Product added to wishlist', { productId, productName });
    logger.logEvent('add_to_wishlist', {
      item_id: productId,
      item_name: productName
    });
  },
  
  remove: (productId: string, productName: string) => {
    logger.debug('Product removed from wishlist', { productId, productName });
    logger.logEvent('remove_from_wishlist', {
      item_id: productId,
      item_name: productName
    });
  }
};

// Formularios
export const logFormEvent = {
  start: (formName: string) => {
    logger.debug('Form started', { formName });
    logger.logEvent('form_start', { form_name: formName });
  },
  
  submit: (formName: string, success: boolean) => {
    logger.info('Form submitted', { formName, success });
    logger.logEvent('form_submit', { 
      form_name: formName, 
      success 
    });
  },
  
  error: (formName: string, fieldName: string, error: string) => {
    logger.warn('Form validation error', { formName, fieldName, error });
    logger.logEvent('form_error', {
      form_name: formName,
      field_name: fieldName,
      error
    });
  }
};

// Errores de API
export const logApiEvent = {
  request: (endpoint: string, method: string) => {
    logger.debug('API request', { endpoint, method });
  },
  
  success: (endpoint: string, method: string, duration: number) => {
    logger.debug('API request success', { endpoint, method, duration });
  },
  
  error: (endpoint: string, method: string, status: number, error: string) => {
    logger.error('API request failed', { 
      endpoint, 
      method, 
      status, 
      error 
    });
    logger.logEvent('api_error', {
      endpoint,
      method,
      status,
      error
    });
  },
  
  timeout: (endpoint: string, method: string) => {
    logger.error('API request timeout', { endpoint, method });
    logger.logEvent('api_timeout', { endpoint, method });
  }
};

// Performance
export const logPerformanceEvent = {
  slowRender: (componentName: string, duration: number) => {
    logger.warn('Slow component render', { componentName, duration });
    logger.logEvent('slow_render', {
      component: componentName,
      duration
    });
  },
  
  pageLoad: (duration: number) => {
    logger.info('Page loaded', { duration });
    logger.logEvent('page_load', { duration });
  },
  
  resourceLoadError: (resource: string, error: string) => {
    logger.error('Resource load error', { resource, error });
    logger.logEvent('resource_error', { resource, error });
  }
};

// Interacciones de UI
export const logUIEvent = {
  buttonClick: (buttonName: string, context?: Record<string, any>) => {
    logger.debug('Button clicked', { buttonName, ...context });
    logger.logEvent('button_click', { 
      button_name: buttonName,
      ...context
    });
  },
  
  modalOpen: (modalName: string) => {
    logger.debug('Modal opened', { modalName });
    logger.logEvent('modal_open', { modal_name: modalName });
  },
  
  modalClose: (modalName: string) => {
    logger.debug('Modal closed', { modalName });
    logger.logEvent('modal_close', { modal_name: modalName });
  },
  
  tabChange: (tabName: string, context?: Record<string, any>) => {
    logger.debug('Tab changed', { tabName, ...context });
  },
  
  filterApply: (filterType: string, filterValue: any) => {
    logger.debug('Filter applied', { filterType, filterValue });
    logger.logEvent('filter_apply', {
      filter_type: filterType,
      filter_value: String(filterValue)
    });
  }
};

// Soporte
export const logSupportEvent = {
  ticketCreated: (ticketId: string, category: string) => {
    logger.info('Support ticket created', { ticketId, category });
    logger.logEvent('ticket_created', { ticket_id: ticketId, category });
  },
  
  chatStarted: (userId?: string) => {
    logger.info('Chat started', { userId });
    logger.logEvent('chat_started');
  },
  
  feedbackSubmitted: (rating: number, comment?: string) => {
    logger.info('Feedback submitted', { rating, hasComment: !!comment });
    logger.logEvent('feedback_submitted', { rating });
  }
};

// Warehouse
export const logWarehouseEvent = {
  stockCheck: (productId: string, warehouse: string, stock: number) => {
    logger.debug('Stock checked', { productId, warehouse, stock });
  },
  
  stockUpdate: (productId: string, oldStock: number, newStock: number) => {
    logger.info('Stock updated', { productId, oldStock, newStock });
    logger.logEvent('stock_update', {
      product_id: productId,
      old_stock: oldStock,
      new_stock: newStock
    });
  },
  
  lowStock: (productId: string, productName: string, currentStock: number) => {
    logger.warn('Low stock alert', { productId, productName, currentStock });
    logger.logEvent('low_stock_alert', {
      product_id: productId,
      product_name: productName,
      current_stock: currentStock
    });
  },
  
  orderProcessed: (orderId: string, items: number) => {
    logger.info('Order processed in warehouse', { orderId, items });
    logger.logEvent('warehouse_order_processed', {
      order_id: orderId,
      items_count: items
    });
  }
};

// Admin
export const logAdminEvent = {
  userManagement: (action: string, targetUserId: string) => {
    logger.info('Admin user management action', { action, targetUserId });
    logger.logEvent('admin_user_action', { action, target_user_id: targetUserId });
  },
  
  orderApproval: (orderId: string, approved: boolean) => {
    logger.info('Admin order approval', { orderId, approved });
    logger.logEvent('admin_order_approval', { order_id: orderId, approved });
  },
  
  configChange: (configKey: string, oldValue: any, newValue: any) => {
    logger.info('Admin config changed', { configKey, oldValue, newValue });
    logger.logEvent('admin_config_change', { config_key: configKey });
  }
};
