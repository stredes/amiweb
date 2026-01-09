# 🔗 Integración Backend - AMIWEB

## ✅ Cambios Implementados

He adaptado el frontend de AMIWEB para que se integre correctamente con las APIs REST del backend.

---

## 📝 Archivos Actualizados

### 1. **Tipos de Datos** (`src/features/auth/types.ts`)

**Actualizaciones:**
- ✅ Estructura de `Order` ahora coincide con backend
- ✅ Agregados campos: `customerName`, `customerEmail`, `customerPhone`, `organization`, `taxId`
- ✅ Nuevos campos de totales: `subtotal`, `discount`, `tax`, `shippingCost`
- ✅ Estados actualizados: `pendiente | confirmado | procesando | enviado | entregado | cancelado`
- ✅ Agregado `paymentStatus`: `pendiente | parcial | pagado | reembolsado`
- ✅ Métodos de pago actualizados: `transferencia | efectivo | cheque | tarjeta | credito_30 | credito_60 | credito_90`
- ✅ Estructura `ShippingAddress` completa con todos los campos del backend
- ✅ `OrderProduct` ahora incluye: `productId`, `productName`, `unitPrice`, `subtotal`

**Compatibilidad:**
- ⚠️ Se mantienen aliases para compatibilidad con código anterior:
  - `products` → `items`
  - `id` → `productId`
  - `name` → `productName`
  - `price` → `unitPrice`
  - `region` → `state`
  - `postalCode` → `zipCode`

---

### 2. **Servicio de API Backend** (`src/features/api/backendApiService.ts`) - NUEVO

**Funcionalidad:**
Servicio completo para comunicarse con todas las APIs REST del backend.

**Endpoints Implementados:**

#### 📦 **Órdenes**
```typescript
- POST /api/orders         → createOrder()
- GET /api/orders          → listOrders(params)
- GET /api/orders/[id]     → getOrder(orderId)
- PATCH /api/orders/[id]   → updateOrder(orderId, updates)
- DELETE /api/orders/[id]  → cancelOrder(orderId)
```

#### 📋 **Cotizaciones**
```typescript
- POST /api/quotes         → createQuote()
- GET /api/quotes          → listQuotes(params)
- GET /api/quotes/[id]     → getQuote(quoteId)
- PATCH /api/quotes/[id]   → updateQuote(quoteId, updates)
- PUT /api/quotes/[id]     → changeQuoteStatus(quoteId, status)
```

#### 🛒 **Carrito**
```typescript
- GET /api/cart                  → getCart()
- POST /api/cart                 → addToCart()
- PUT /api/cart                  → updateCart()
- DELETE /api/cart               → clearCart()
- PATCH /api/cart/items/[id]     → updateCartItem()
- DELETE /api/cart/items/[id]    → removeFromCart()
```

**Headers Soportados:**
- `x-user-id` - Para usuarios autenticados
- `x-session-id` - Para usuarios anónimos

---

### 3. **Servicio de Órdenes** (`src/features/cart/services/orderService.ts`) - REESCRITO

**Cambios Principales:**
- ❌ Ya NO usa Firebase Firestore directamente
- ✅ Ahora usa `backendApi` para todas las operaciones
- ✅ Método `createOrder()` envía datos en formato esperado por backend
- ✅ Cálculo automático de `subtotal`, `tax`, `discount`, `shippingCost`, `total`
- ✅ Mapeo automático de campos entre frontend y backend
- ✅ `getUserOrders()` ahora filtra por `customerEmail`
- ✅ `getAllOrders()` obtiene todas las órdenes (admin)
- ✅ `getOrderStats()` calcula estadísticas desde las órdenes del backend

**Métodos Disponibles:**
```typescript
- createOrder(orderData) → Promise<Order>
- getOrderById(orderId) → Promise<Order | null>
- getUserOrders() → Promise<Order[]>
- getAllOrders() → Promise<Order[]>
- updateOrderStatus(orderId, status, trackingNumber?) → Promise<void>
- cancelOrder(orderId, reason?) → Promise<void>
- getStatusLabel(status) → string
- getPaymentStatusLabel(paymentStatus) → string
- getOrderStats() → Promise<{...}>
```

**Notas:**
- ⚠️ Los métodos de notificaciones (`getUserNotifications`, `markNotificationAsRead`) ahora están deprecados
- ℹ️ Las notificaciones deben implementarse en el backend

---

### 4. **CheckoutModal** (`src/components/cart/CheckoutModal.tsx`) - PENDIENTE

**Cambios Requeridos:**

1. **Nuevo paso "Customer"** al inicio:
   - customerName
   - customerEmail
   - customerPhone
   - organization
   - taxId (opcional)

2. **Actualizar paso "Shipping":**
   - Cambiar `region` → `state`
   - Cambiar `postalCode` → `zipCode`
   - Agregar `phone`
   - Agregar `contactName`

3. **Actualizar paso "Payment":**
   - Nuevos métodos: `efectivo`, `cheque`, `tarjeta`
   - Nuevas opciones de crédito: `credito_30`, `credito_60`, `credito_90`

4. **Actualizar confirmación:**
   - Pasar todos los nuevos campos a `orderService.createOrder()`

**Estados del Flujo:**
```
customer → shipping → payment → confirm
```

---

## 🔄 Flujo de Integración

### Flujo Actual (Frontend → Backend)

```mermaid
Cliente Frontend
    ↓
CheckoutModal (captura datos)
    ↓
orderService.createOrder()
    ↓
backendApi.createOrder()
    ↓
POST /api/orders (Backend)
    ↓
Firestore (Backend guarda)
    ↓
Respuesta JSON
    ↓
Order mostrada en Portal
```

---

## 🎯 Estados y Transiciones

### Estados de Orden

| Estado | Descripción | Siguiente Estado |
|--------|-------------|------------------|
| `pendiente` | Orden creada, esperando confirmación | `confirmado` |
| `confirmado` | Confirmada por vendedor | `procesando` |
| `procesando` | En preparación | `enviado` |
| `enviado` | Enviado al cliente | `entregado` |
| `entregado` | Entregado al cliente | - |
| `cancelado` | Cancelado | - |

### Estados de Pago

| Estado | Descripción |
|--------|-------------|
| `pendiente` | Pago pendiente |
| `parcial` | Pago parcial recibido |
| `pagado` | Pagado completamente |
| `reembolsado` | Reembolsado |

---

## 🔧 Configuración Requerida

### Variables de Entorno

Asegúrate de configurar en `src/config/env.ts`:

```typescript
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

En `.env`:
```
VITE_API_BASE_URL=https://tu-backend.com
```

---

## ✅ Tareas Completadas

- [x] Actualizar tipos de Order y OrderProduct
- [x] Crear backendApiService con todos los endpoints
- [x] Reescribir orderService para usar backend
- [x] Adaptar estructura de datos entre frontend/backend
- [x] Implementar mapeo de campos legacy
- [x] Calcular totales automáticamente
- [x] Filtrar órdenes por customerEmail

---

## ⏳ Tareas Pendientes

- [ ] **URGENTE:** Actualizar CheckoutModal con nuevo formulario de 4 pasos
- [ ] Actualizar OrderCard para mostrar `paymentStatus`
- [ ] Actualizar OrderManagement (Admin) para cambiar estados
- [ ] Implementar vista de cotizaciones
- [ ] Integrar carrito con backend (opcional, si se usa)
- [ ] Agregar manejo de errores más detallado
- [ ] Implementar retry logic para peticiones fallidas
- [ ] Agregar loading states en componentes

---

## 📊 Mapeo de Campos

### Frontend → Backend

| Frontend | Backend | Notas |
|----------|---------|-------|
| `products` | `items` | Array de productos |
| `id` | `productId` | ID del producto |
| `name` | `productName` | Nombre del producto |
| `price` | `unitPrice` | Precio unitario |
| `region` | `state` | Estado/Región |
| `postalCode` | `zipCode` | Código postal |

### Backend → Frontend

El backend devuelve exactamente lo que espera, así que no hay mapeo adicional necesario en ese sentido.

---

## 🐛 Problemas Conocidos

1. **CheckoutModal Desactualizado**
   - Falta agregar paso de Customer
   - Faltan campos en Shipping
   - Métodos de pago incompletos

2. **Notificaciones**
   - Sistema de notificaciones aún usa Firebase
   - Debe migrarse al backend cuando esté disponible

3. **Inventario**
   - `inventoryOrderService` aún usa Firebase directamente
   - Debe integrarse con backend si hay API de inventario

---

## 📚 Documentación del Backend

Ver archivo original para documentación completa de las APIs del backend.

**Endpoints Principales:**
- `/api/orders` - Gestión de órdenes
- `/api/quotes` - Gestión de cotizaciones
- `/api/cart` - Gestión de carrito

---

## 🚀 Próximos Pasos

1. **Terminar CheckoutModal**
   - Agregar formulario de Customer
   - Actualizar campos de Shipping
   - Actualizar métodos de pago

2. **Probar Integración**
   - Crear orden de prueba end-to-end
   - Verificar que datos lleguen correctamente al backend
   - Validar que órdenes se muestren en portal

3. **Actualizar UI**
   - Mostrar paymentStatus en OrderCard
   - Adaptar timeline de estados
   - Agregar acciones de admin para cambiar estados

4. **Optimizar**
   - Agregar caché de órdenes
   - Implementar polling para actualizaciones
   - Mejorar manejo de errores

---

*Última actualización: Enero 2026*
*Estado: ⚠️ Integración parcial - CheckoutModal pendiente*
