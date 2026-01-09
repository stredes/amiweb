# Sistema de Logging y Monitoreo - AMIWEB

## 📋 Descripción General

Sistema completo de logging, captura de errores y analíticas para el frontend de AMIWEB. Proporciona visibilidad total sobre errores, eventos de usuario y rendimiento de la aplicación.

## 🎯 Características Principales

### 1. **Logger Central** (`src/lib/logger.ts`)
- ✅ Captura automática de errores globales de JavaScript
- ✅ Captura de promesas rechazadas sin catch
- ✅ Persistencia de logs en localStorage
- ✅ Integración con Firebase Analytics
- ✅ 5 niveles de log: DEBUG, INFO, WARN, ERROR, CRITICAL
- ✅ Contexto automático de usuario y sesión
- ✅ Stack traces completos
- ✅ Exportación de logs a JSON

### 2. **Visor de Logs en Tiempo Real** (`src/components/debug/LogViewer.tsx`)
- 📊 Interfaz visual para ver logs en tiempo real
- 🔍 Filtrado por nivel de log
- 🔎 Búsqueda en logs
- 📈 Estadísticas de logs
- 💾 Exportación de logs
- 🗑️ Limpieza de logs
- 🎨 Colores por nivel de severidad
- 👁️ Solo visible en modo desarrollo

### 3. **Error Boundary** (`src/components/debug/ErrorBoundary.tsx`)
- 🛡️ Captura errores de React
- 🎨 UI amigable para errores
- 📋 Detalles técnicos expandibles
- 🔄 Recarga rápida de aplicación
- 📝 Exportación de reportes de error

### 4. **Event Logger** (`src/lib/eventLogger.ts`)
Helpers organizados por categorías:

#### Autenticación
```typescript
logAuthEvent.login(userId, method);
logAuthEvent.logout(userId);
logAuthEvent.signUp(userId, method);
logAuthEvent.authError(error);
```

#### Navegación
```typescript
logNavigationEvent.pageView(path, title);
logNavigationEvent.routeChange(from, to);
```

#### Productos
```typescript
logProductEvent.view(productId, productName);
logProductEvent.addToCart(productId, productName, quantity, price);
logProductEvent.removeFromCart(productId, productName);
logProductEvent.search(searchTerm, resultsCount);
```

#### Carrito y Compras
```typescript
logCartEvent.beginCheckout(cartValue, itemCount);
logCartEvent.purchase(orderId, value, items);
logCartEvent.abandonCart(cartValue, itemCount);
```

#### API
```typescript
logApiEvent.request(endpoint, method);
logApiEvent.success(endpoint, method, duration);
logApiEvent.error(endpoint, method, status, error);
logApiEvent.timeout(endpoint, method);
```

#### Performance
```typescript
logPerformanceEvent.slowRender(componentName, duration);
logPerformanceEvent.pageLoad(duration);
logPerformanceEvent.resourceLoadError(resource, error);
```

#### UI Interactions
```typescript
logUIEvent.buttonClick(buttonName, context);
logUIEvent.modalOpen(modalName);
logUIEvent.tabChange(tabName, context);
logUIEvent.filterApply(filterType, filterValue);
```

#### Warehouse
```typescript
logWarehouseEvent.stockCheck(productId, warehouse, stock);
logWarehouseEvent.stockUpdate(productId, oldStock, newStock);
logWarehouseEvent.lowStock(productId, productName, currentStock);
logWarehouseEvent.orderProcessed(orderId, items);
```

#### Admin
```typescript
logAdminEvent.userManagement(action, targetUserId);
logAdminEvent.orderApproval(orderId, approved);
logAdminEvent.configChange(configKey, oldValue, newValue);
```

### 5. **Hooks Personalizados** (`src/hooks/useLogger.ts`)

#### `useLogger()`
Hook con contexto automático de usuario:
```typescript
const { debug, info, warn, error, critical, logEvent } = useLogger();

info('User action completed', { action: 'purchase', amount: 150 });
error('Failed to load data', error);
```

#### `usePageTracking()`
Tracking automático de páginas:
```typescript
function App() {
  usePageTracking(); // Auto-track all page views
  return <Routes>...</Routes>;
}
```

#### `usePerformanceLogger(componentName)`
Mide performance de componentes:
```typescript
function ExpensiveComponent() {
  usePerformanceLogger('ExpensiveComponent');
  // Logs warning si el componente tarda >1s en desmontar
}
```

#### `useAsyncLogger()`
Wrapper para operaciones asíncronas:
```typescript
const { wrapAsync } = useAsyncLogger();

const data = await wrapAsync(
  () => fetchData(),
  'fetchUserData',
  { userId: '123' }
);
```

## 🚀 Uso Básico

### 1. Logging Simple
```typescript
import { logger } from '@/lib/logger';

// Logs básicos
logger.debug('Debugging info', { data: 'value' });
logger.info('User logged in', { userId: '123' });
logger.warn('Low stock detected', { product: 'ABC' });
logger.error('Failed to save', { reason: 'Network error' });
logger.critical('System failure', { component: 'Auth' });

// Con error object
try {
  riskyOperation();
} catch (error) {
  logger.error('Operation failed', error);
}
```

### 2. Eventos de Usuario
```typescript
import { logProductEvent, logCartEvent } from '@/lib/eventLogger';

// Ver producto
logProductEvent.view(product.id, product.name);

// Agregar al carrito
logProductEvent.addToCart(
  product.id,
  product.name,
  quantity,
  product.price
);

// Checkout
logCartEvent.beginCheckout(cartTotal, itemCount);
```

### 3. En Componentes React
```typescript
import { useLogger } from '@/hooks/useLogger';

function ProductCard({ product }) {
  const log = useLogger();

  const handleAddToCart = () => {
    try {
      addToCart(product);
      log.info('Product added to cart', { 
        productId: product.id 
      });
    } catch (error) {
      log.error('Failed to add product', error);
    }
  };

  return <button onClick={handleAddToCart}>Add</button>;
}
```

### 4. Operaciones Asíncronas
```typescript
import { useAsyncLogger } from '@/hooks/useLogger';

function DataComponent() {
  const { wrapAsync } = useAsyncLogger();

  useEffect(() => {
    wrapAsync(
      () => fetchData(),
      'loadInitialData',
      { component: 'DataComponent' }
    );
  }, []);
}
```

## 📊 Visor de Logs

El visor de logs está disponible en **modo desarrollo** (DEV):

- 📍 Aparece como botón flotante en la esquina inferior derecha
- 🔴 Muestra badge rojo si hay errores
- 📱 Totalmente responsive
- ⚙️ Filtros por nivel y búsqueda
- 💾 Exporta logs a JSON
- 🗑️ Limpia logs cuando sea necesario

### Acceso
```typescript
// Ya está integrado en App.tsx
{import.meta.env.DEV && <LogViewer />}
```

## 🎨 Integración Existente

El sistema ya está integrado en:

1. **App.tsx** - Error Boundary y LogViewer
2. **httpClient.ts** - Logging de requests HTTP
3. **Hooks automáticos** - Page tracking

## 🔧 Configuración

### Variables de Entorno
```env
# Firebase Analytics (opcional)
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Modo de desarrollo
VITE_APP_VERSION=1.0.0
```

### Personalización del Logger
```typescript
import { logger } from '@/lib/logger';

// Configurar usuario
logger.setUserId('user-123');

// Limpiar usuario (logout)
logger.clearUserId();

// Obtener estadísticas
const stats = logger.getStats();
// { total: 150, debug: 50, info: 80, warn: 15, error: 5, critical: 0 }

// Exportar logs
const json = logger.exportLogs();
```

## 📈 Firebase Analytics

Los eventos importantes se envían automáticamente a Firebase Analytics:

- ✅ Errores (ERROR, CRITICAL)
- ✅ Eventos de negocio (compras, búsquedas, etc.)
- ✅ Eventos de navegación
- ✅ Eventos personalizados via `logEvent()`

### Eventos Enviados a Firebase
```typescript
// Errores
error_occurred { error_message, error_level, user_id, session_id }

// Productos
view_item { item_id, item_name }
add_to_cart { item_id, item_name, quantity, value }
remove_from_cart { item_id, item_name }
search { search_term, results_count }

// Compras
begin_checkout { value, items_count }
purchase { transaction_id, value, items }

// API
api_error { endpoint, method, status, error }
api_timeout { endpoint, method }
```

## 🛠️ Mejores Prácticas

### DO ✅
```typescript
// Contexto rico
logger.info('User purchased product', {
  userId: user.id,
  productId: product.id,
  amount: 99.99,
  paymentMethod: 'credit_card'
});

// Usar helpers de eventos
logProductEvent.view(product.id, product.name);

// Manejar errores apropiadamente
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', error);
  // Manejar el error...
}
```

### DON'T ❌
```typescript
// No usar console.log directamente
console.log('User logged in'); // ❌

// No logs sin contexto
logger.info('Error'); // ❌

// No ignorar errores
try {
  await riskyOperation();
} catch (error) {
  // Silently ignore ❌
}
```

## 🔍 Debugging

### Ver logs en consola
Los logs se muestran en la consola del navegador con colores:
- 🔵 **DEBUG/INFO** - Azul/Gris
- 🟠 **WARN** - Naranja
- 🔴 **ERROR** - Rojo
- ⚫ **CRITICAL** - Rojo con fondo

### Ver logs en localStorage
```javascript
// En consola del navegador
JSON.parse(localStorage.getItem('app_logs'));
```

### Exportar logs
1. Abrir LogViewer
2. Click en "💾 Exportar"
3. Se descarga archivo JSON con todos los logs

## 📝 Mantenimiento

### Límites de Memoria
- Máximo 1000 logs en memoria
- Solo 100 logs en localStorage
- Auto-limpieza cuando se excede

### Logs en Producción
- Solo ERROR y CRITICAL se muestran en consola
- Todos los logs se guardan en memoria
- Todos los eventos importantes van a Firebase Analytics

## 🎯 Próximas Mejoras

- [ ] Integración con Sentry/LogRocket
- [ ] Dashboard de analíticas
- [ ] Alertas en tiempo real
- [ ] Agregación de logs por sesión
- [ ] Replay de sesiones de usuario
- [ ] Machine learning para detección de anomalías

## 🐛 Troubleshooting

### El visor no aparece
- Verificar que estás en modo desarrollo (`npm run dev`)
- Verificar que `import.meta.env.DEV` es `true`

### Los logs no se guardan
- Verificar espacio en localStorage
- Verificar que no hay errores en consola

### Firebase Analytics no funciona
- Verificar configuración de Firebase
- Verificar `VITE_FIREBASE_MEASUREMENT_ID`
- Verificar que analytics está habilitado en Firebase Console

## 📚 Referencias

- [Logger.ts](src/lib/logger.ts) - Logger principal
- [EventLogger.ts](src/lib/eventLogger.ts) - Helpers de eventos
- [useLogger.ts](src/hooks/useLogger.ts) - Hooks personalizados
- [LogViewer.tsx](src/components/debug/LogViewer.tsx) - Visor visual
- [ErrorBoundary.tsx](src/components/debug/ErrorBoundary.tsx) - Captura de errores React

---

**Desarrollado para AMIWEB** 🚀
