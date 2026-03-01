# INTEGRACIÓN FRONTEND-BACKEND: SISTEMA DE COTIZACIONES

## ✅ COMPLETADO

He integrado completamente el frontend con el sistema de cotizaciones del backend implementado.

## 📦 Archivos Creados/Modificados

### 1. Nuevo Servicio de Cotizaciones
**Archivo**: `src/features/quotes/quoteService.ts`
- Servicio completo para manejar cotizaciones
- Integración con APIs del backend
- Métodos para crear, aprobar, rechazar y convertir cotizaciones
- Sistema de notificaciones

**Métodos Implementados**:
```typescript
- createQuote(quoteData): Crea nueva cotización
- getVendorPendingQuotes(): Lista cotizaciones del vendedor
- vendorApproveQuote(quoteId, approved, notes): Aprobación/rechazo vendedor
- adminApproveQuote(quoteId, approved, notes): Aprobación/rechazo admin
- convertQuoteToOrder(quoteId, payment, address): Convierte quote a orden
- getNotifications(unreadOnly): Obtiene notificaciones
- markAllNotificationsAsRead(): Marca todas como leídas
- markNotificationAsRead(id): Marca una como leída
```

### 2. CheckoutModal Actualizado
**Archivo**: `src/components/cart/CheckoutModal.tsx`

**Cambios Principales**:
- ✅ Usa `quoteService.createQuote()` en lugar de `orderService.createOrder()`
- ✅ Eliminados pasos de envío y pago (se definen en conversión a orden)
- ✅ Flujo simplificado: Información → Confirmar
- ✅ Título cambiado a "Solicitar Cotización"
- ✅ Mensajes actualizados para reflejar proceso de cotización
- ✅ Campo de notas adicionales agregado

**Nuevo Flujo**:
```
1. Cliente ingresa información (nombre, email, teléfono, organización, RUT, notas)
2. Confirma cotización (ve productos y total estimado)
3. Envía cotización
4. Mensaje de éxito: "Tu vendedor la revisará pronto"
```

## 🔄 Flujo Completo Cliente → Orden

### Paso 1: Cliente Crea Cotización
```
Cliente (Portal Socios)
  ↓ Agrega productos al carrito
  ↓ Click "Finalizar Compra"
  ↓ Completa información
  ↓ Envía cotización
→ POST /api/quotes
  - Estado: 'pendiente'
  - Se asigna vendedor automáticamente
  - Notificación al vendedor
```

### Paso 2: Vendedor Revisa
```
Vendedor (Dashboard)
  ↓ Tab "Cotizaciones"
  ↓ Ve cotización pendiente
  ↓ Revisa detalles
  ↓ Aprueba o rechaza
→ POST /api/quotes/{id}/vendor-approve
  - Si aprueba: estado → 'aprobado_vendedor'
  - Notificación a admins
```

### Paso 3: Admin Aprueba
```
Admin (Dashboard)
  ↓ Tab "Aprobaciones"
  ↓ Ve cotización aprobada por vendedor
  ↓ Revisa detalles
  ↓ Aprueba o rechaza
→ POST /api/quotes/{id}/admin-approve
  - Si aprueba: estado → 'aprobado'
  - Lista para conversión a orden
```

### Paso 4: Conversión a Orden
```
Cuando la cotización está aprobada:
→ POST /api/quotes/{id}/convert-to-order
  Body: {
    paymentMethod: 'transferencia',
    shippingAddress: {...}
  }
  - Crea Order en base a Quote
  - Quote estado → 'convertida'
  - Order estado → 'confirmado'
  - Notificación a bodega
```

### Paso 5: Bodega Procesa
```
Bodega (Dashboard)
  ↓ Ve orden confirmada
  ↓ Prepara productos
  ↓ Envía con tracking
  ↓ Confirma entrega
```

## 🔔 Sistema de Notificaciones

El backend envía notificaciones automáticas en cada paso:

1. **Cliente crea quote** → Notifica al vendedor asignado
2. **Vendedor aprueba** → Notifica a todos los admins + cliente
3. **Admin aprueba** → Notifica a vendedor + cliente
4. **Quote → Orden** → Notifica a vendedor, admins, bodega y cliente

## 📋 APIs del Backend Utilizadas

```http
# Crear cotización
POST /api/quotes
Body: {
  customerName, customerEmail, customerPhone,
  organization, taxId,
  items: [{ productId, quantity, unitPrice, subtotal }],
  subtotal, tax, discount, total,
  customerNotes
}

# Ver cotizaciones pendientes (vendedor)
GET /api/quotes/vendor/pending

# Aprobar/rechazar (vendedor)
POST /api/quotes/{id}/vendor-approve
Body: { approved: true, notes: "..." }

# Aprobar/rechazar (admin)
POST /api/quotes/{id}/admin-approve
Body: { approved: true, notes: "..." }

# Convertir a orden
POST /api/quotes/{id}/convert-to-order
Body: {
  paymentMethod: "transferencia",
  shippingAddress: { street, city, state, zipCode, country, phone, contactName }
}

# Notificaciones
GET /api/notifications?unreadOnly=true
PATCH /api/notifications
Body: { markAllAsRead: true }
```

## 🎯 Estados de Quote

| Estado | Descripción | Siguiente Paso |
|--------|-------------|----------------|
| `pendiente` | Recién creada | Vendedor revisa |
| `en_revision_vendedor` | Vendedor revisando | Vendedor aprueba/rechaza |
| `aprobado_vendedor` | Aprobada por vendedor | Admin revisa |
| `rechazado_vendedor` | Rechazada por vendedor | FIN |
| `en_revision_admin` | Admin revisando | Admin aprueba/rechaza |
| `aprobado` | Aprobada por admin | Conversión a orden |
| `rechazado` | Rechazada por admin | FIN |
| `convertida` | Ya convertida a orden | FIN |

## 🔧 Próximos Pasos

### 1. Actualizar Componentes de Aprobación

Actualmente `QuotationApproval.tsx` y `OrderApproval.tsx` usan el mock `authApi`. Necesitan actualizarse para usar `quoteService`:

```typescript
// En QuotationApproval.tsx
import { quoteService } from '../../features/quotes/quoteService';

// Reemplazar
await authApi.approveQuotationAsVendor(orderId);
// Por
await quoteService.vendorApproveQuote(quoteId, true, notes);

// En OrderApproval.tsx
// Reemplazar
await authApi.approveOrderAsAdmin(orderId);
// Por
await quoteService.adminApproveQuote(quoteId, true, notes);
```

### 2. Sistema de Notificaciones UI

Crear componente para mostrar notificaciones en tiempo real:
- Badge en navbar con conteo de no leídas
- Panel de notificaciones
- Integración con `quoteService.getNotifications()`

### 3. Vista de Cotizaciones en Portal Socios

Agregar sección donde el socio pueda ver:
- Cotizaciones enviadas
- Estado actual
- Historial de aprobaciones
- Razón de rechazo si aplica

### 4. Conversión Manual a Orden

Agregar UI para que admin/vendedor puedan convertir quote aprobada a orden:
- Seleccionar método de pago
- Ingresar dirección de envío
- Confirmar conversión

## 📊 Ventajas del Nuevo Sistema

1. **Separación Clara**: Cotización ≠ Orden
2. **Workflow Definido**: Cada paso tiene validaciones
3. **Trazabilidad**: Historial completo de aprobaciones
4. **Notificaciones**: Todos informados en tiempo real
5. **Flexibilidad**: Método de pago y envío se definen al final
6. **Backend Centralizado**: Una sola fuente de verdad

## 🧪 Cómo Probar

1. **Como Cliente** (socio@amilab.com):
   - Agregar productos al carrito
   - Click "Finalizar Compra"
   - Completar formulario
   - Enviar cotización
   - Ver mensaje de éxito

2. **Como Vendedor** (vendedor1@amilab.com):
   - Ir a dashboard → Tab "Cotizaciones"
   - Ver cotización pendiente
   - Aprobar o rechazar

3. **Como Admin** (admin@amilab.com):
   - Ir a dashboard → Tab "Aprobaciones"
   - Ver cotización aprobada por vendedor
   - Aprobar o rechazar

4. **Conversión a Orden**:
   - Por ahora manual via API
   - TODO: Agregar UI

## ⚠️ Notas Importantes

- El sistema usa `httpRequest` que actualmente es mock
- Cuando el backend esté desplegado, cambiar `API_BASE_URL` en `config/env.ts`
- Las imágenes de productos siguen siendo mock
- El cálculo de IVA es 19% (Chile)
- Sin costo de envío por ahora

## 📝 Checklist de Integración

- [x] Crear quoteService
- [x] Actualizar CheckoutModal
- [x] Eliminar pasos innecesarios (shipping/payment)
- [x] Cambiar mensajes a "cotización"
- [x] Integrar con httpRequest
- [ ] Actualizar QuotationApproval component
- [ ] Actualizar OrderApproval component
- [ ] Crear NotificationCenter component
- [ ] Agregar vista de cotizaciones en portal socio
- [ ] UI para conversión manual quote → order
- [ ] Testing end-to-end con backend real

---

**Estado Actual**: ✅ Frontend listo para integrarse con backend de cotizaciones
**Siguiente Paso**: Conectar componentes de aprobación con quoteService

---

## Front-Backend Sync Contract (Implementación Front 2026-03-01)

### Implementado en frontend
- Cliente HTTP estandarizado para contrato `{ success, data }` y errores `{ success:false, code, details }`.
- Soporte de versionado por entorno:
  - `VITE_API_VERSION=legacy` -> usa `/api/*`
  - `VITE_API_VERSION=v1` -> reescribe `/api/*` a `/api/v1/*` automáticamente.
- Errores enriquecidos con:
  - `code`
  - `status`
  - `requestId` (`x-request-id` o `x-vercel-id`)
  - `endpoint` y `url`
- Mensajería de UI mapeada por `code` estable (`TOKEN_EXPIRED`, `FORBIDDEN`, `VALIDATION_ERROR`, etc.).
- Modo diagnóstico opcional (`VITE_ENABLE_API_DIAGNOSTICS=true`):
  - imprime `origin`, `API_BASE_URL`, versión API
  - registra request/response final con status y requestId.
- Normalización de listados de usuarios para aceptar tanto `items` como `users` durante migración.
- Smoke test de integración API:
  - `npm run smoke:api`
  - verifica `health`, `products`, `auth/me` y muestra `x-request-id`.

### Variables de entorno front
- `VITE_API_URL` o `VITE_API_BASE_URL`
- `VITE_API_VERSION` (`legacy` | `v1`)
- `VITE_ENABLE_API_DIAGNOSTICS` (`true` | `false`)

## Requerimientos obligatorios para backend

1. Respuesta uniforme en todos los endpoints:
   - éxito: `{ "success": true, "data": ... }`
   - error: `{ "success": false, "error": "...", "code": "...", "details": { "requestId": "..." } }`
2. Header de trazabilidad en todas las respuestas: `x-request-id`.
3. Mantener CORS consistente para frontend de producción y previews (incluyendo preflight `OPTIONS -> 204`).
4. Mantener semántica auth estricta:
   - `401` para token faltante/inválido/expirado (`TOKEN_MISSING`, `TOKEN_INVALID`, `TOKEN_EXPIRED`)
   - `403` para permisos insuficientes.
5. Endpoints de usuarios con paginación estándar y payload estable:
   - preferido: `data.items`
   - transición: aceptar temporalmente `data.users`.
6. Mantener paridad funcional en legacy y v1 durante migración para evitar breaking en front.
7. Publicar changelog por release con endpoints afectados y fecha efectiva.
8. En incidentes, permitir rastreo cruzado por `x-request-id` en logs backend.

### Tabla rápida endpoint -> handler front
- `GET /api/health` -> `checkBackendConnection` en `src/lib/httpClient.ts`
- `GET /api/products` -> `catalogApi` (`src/features/catalog/catalogApi.ts`)
- `GET /api/auth/me` -> `authApi.getCurrentUserFromApi` (`src/features/auth/authApi.ts`)
- `GET/POST/PUT/PATCH/DELETE /api/users*` -> `userManagementApi` (`src/features/auth/userManagementApi.ts`)
- `GET /api/users/role/:role` -> `authApi` y `userManagementApi` (ambos con normalización `items/users`)
