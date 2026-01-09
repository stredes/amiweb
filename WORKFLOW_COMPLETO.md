# Workflow Completo del Sistema de Pedidos - Amilab

## 🔄 Flujo de Estados del Pedido

```
┌──────────────┐
│   CLIENTE    │
│   (Socio)    │
└──────┬───────┘
       │ Crea cotización
       ↓
┌──────────────────┐
│   cotizacion     │ ← Pedido inicial creado por el socio
└──────┬───────────┘
       │ Notificación automática
       ↓
┌──────────────────────┐
│  pendiente_vendedor  │ ← Llega al vendedor asignado
└──────┬───────────────┘
       │ Vendedor revisa y aprueba
       ↓
┌──────────────────────┐
│  aprobado_vendedor   │ ← Vendedor aprueba
└──────┬───────────────┘
       │ Notificación a admin
       ↓
┌──────────────────────┐
│   pendiente_admin    │ ← Llega a los jefes (admin/root)
└──────┬───────────────┘
       │ Admin revisa condiciones comerciales
       ├─── Si aprueba ────→ ┌──────────────────┐
       │                      │  aprobado_admin  │
       │                      └────────┬─────────┘
       │                               │ Notificaciones a:
       │                               │ - Vendedor
       │                               │ - Bodega
       │                               ↓
       │                      ┌──────────────────┐
       │                      │   confirmado     │ ← Pedido confirmado
       │                      └────────┬─────────┘
       │                               │ Bodega inicia preparación
       │                               ↓
       │                      ┌──────────────────┐
       │                      │   procesando     │ ← En preparación
       │                      └────────┬─────────┘
       │                               │ Bodega completa y despacha
       │                               ↓
       │                      ┌──────────────────┐
       │                      │     enviado      │ ← En tránsito
       │                      └────────┬─────────┘
       │                               │ Cliente confirma recepción
       │                               ↓
       │                      ┌──────────────────┐
       │                      │    entregado     │ ← Completado
       │                      └──────────────────┘
       │
       └─── Si rechaza ────→ ┌──────────────────┐
                             │    rechazado     │ ← No aprobado
                             └──────────────────┘
```

## 👥 Roles y Responsabilidades

### 1. Cliente (Socio)
**Permisos:**
- Crear cotizaciones/pedidos
- Ver estado de sus pedidos
- Contactar a su vendedor asignado
- Ver historial de pedidos

**Acciones:**
- Agregar productos al carrito
- Completar formulario de cotización
- Enviar solicitud
- Recibir notificaciones de cambios de estado

### 2. Vendedor
**Permisos:**
- Ver pedidos de sus clientes asignados
- Aprobar o rechazar cotizaciones
- Agregar notas comerciales
- Modificar condiciones (descuentos, plazos)

**Acciones:**
1. Recibe notificación de nueva cotización
2. Revisa productos y condiciones
3. Puede modificar:
   - Precios
   - Descuentos
   - Plazos de pago
   - Condiciones de entrega
4. Aprueba y envía a admin
5. Recibe notificación cuando admin aprueba

**Dashboard Vendedor:**
- Cotizaciones pendientes de revisar
- Pedidos aprobados por admin
- Pedidos en proceso
- Historial de ventas

### 3. Admin (Jefes)
**Permisos:**
- Ver todos los pedidos
- Aprobar pedidos aprobados por vendedor
- Rechazar pedidos con motivo
- Gestionar políticas comerciales
- Ver estadísticas globales

**Acciones:**
1. Recibe pedidos aprobados por vendedor
2. Revisa:
   - Condiciones comerciales
   - Crédito del cliente
   - Disponibilidad de productos
   - Políticas de la empresa
3. Aprueba o rechaza con motivo
4. Si aprueba: notifica a vendedor y bodega

**Dashboard Admin:**
- Pedidos pendientes de aprobación
- Estadísticas de ventas
- Gestión de usuarios
- Reportes financieros

### 4. Bodega
**Permisos:**
- Ver pedidos aprobados y confirmados
- Marcar productos como preparados
- Actualizar estado de despacho
- Agregar número de seguimiento
- Confirmar entrega

**Acciones:**
1. Recibe notificación cuando admin aprueba
2. Ve pedido en lista de "Por Preparar"
3. Inicia preparación (marca productos)
4. Completa preparación
5. Agrega número de seguimiento
6. Marca como enviado
7. Confirma entrega

**Dashboard Bodega:**
- Pedidos por preparar (aprobados por admin)
- Pedidos en preparación
- Pedidos listos para despacho
- Pedidos en tránsito

## 📧 Sistema de Notificaciones

### Notificaciones por Estado

| Estado | Notifica A | Mensaje |
|--------|-----------|---------|
| `cotizacion` → `pendiente_vendedor` | Vendedor asignado | "Nueva cotización de [Cliente] requiere tu revisión" |
| `pendiente_vendedor` → `aprobado_vendedor` | Admin/Root | "Vendedor [Nombre] aprobó cotización #[NUM]" |
| `pendiente_admin` → `aprobado_admin` | Vendedor + Bodega | "Pedido #[NUM] aprobado. Preparar para despacho" |
| `pendiente_admin` → `rechazado` | Vendedor + Cliente | "Pedido #[NUM] rechazado: [Motivo]" |
| `confirmado` → `procesando` | Vendedor + Cliente | "Tu pedido #[NUM] está siendo preparado" |
| `procesando` → `enviado` | Vendedor + Cliente | "Tu pedido #[NUM] fue despachado. Tracking: [NUM]" |
| `enviado` → `entregado` | Vendedor | "Pedido #[NUM] entregado exitosamente" |

## 🔐 Permisos de Modificación

### Cambios de Estado Permitidos

**Cliente (Socio):**
- Puede cancelar solo si está en estado `cotizacion` o `pendiente_vendedor`

**Vendedor:**
- `pendiente_vendedor` → `aprobado_vendedor`
- `pendiente_vendedor` → `rechazado`
- Puede modificar datos comerciales antes de aprobar

**Admin:**
- `pendiente_admin` → `aprobado_admin`
- `pendiente_admin` → `rechazado`
- Puede cancelar en cualquier estado

**Bodega:**
- `confirmado` → `procesando`
- `procesando` → `enviado`
- `enviado` → `entregado`

## 💾 Datos Adicionales por Estado

### En Aprobación de Vendedor
```typescript
{
  vendorId: "v1",
  vendorNotes: "Cliente frecuente, aplicar descuento del 10%",
  modifiedBy: "v1",
  priceAdjustments: [...]
}
```

### En Aprobación de Admin
```typescript
{
  vendorApprovedAt: "2026-01-09T10:00:00Z",
  vendorApprovedBy: "v1",
  adminNotes: "Verificar disponibilidad de stock",
  creditCheckRequired: true
}
```

### Aprobado
```typescript
{
  adminApprovedAt: "2026-01-09T11:00:00Z",
  adminApprovedBy: "admin1",
  approvalNotes: "Aprobado. Cliente con buen historial crediticio"
}
```

### Rechazado
```typescript
{
  rejectedAt: "2026-01-09T11:00:00Z",
  rejectedBy: "admin1",
  rejectionReason: "Cliente tiene facturas pendientes de pago"
}
```

## 🎯 Implementación Técnica

### Componentes Necesarios

1. **VendorQuotationApproval** (`src/components/vendor/QuotationApproval.tsx`)
   - Lista de cotizaciones pendientes
   - Formulario de aprobación con ajustes
   - Botones: Aprobar / Rechazar

2. **AdminOrderApproval** (`src/components/admin/OrderApproval.tsx`)
   - Lista de pedidos pendientes de admin
   - Verificación de crédito
   - Botones: Aprobar / Rechazar con motivo

3. **NotificationCenter** (ya existe, actualizar)
   - Agregar notificaciones de workflow
   - Sistema de badges por rol
   - Sonido o notificación push

4. **OrderTimeline** (`src/components/shared/OrderTimeline.tsx`)
   - Visualización del estado del pedido
   - Historial de cambios
   - Responsables de cada acción

### Actualizaciones de API

```typescript
// authApi.ts
async approveQuotationAsVendor(
  orderId: string, 
  adjustments?: PriceAdjustment[], 
  notes?: string
): Promise<Order>

async approveOrderAsAdmin(
  orderId: string, 
  notes?: string
): Promise<Order>

async rejectOrder(
  orderId: string, 
  reason: string, 
  rejectedBy: string
): Promise<Order>

async getOrdersByStatus(
  status: Order['status'],
  role: User['role']
): Promise<Order[]>
```

### Base de Datos (Firestore)

```javascript
// Colección: orders
{
  id: "order123",
  orderNumber: "ORD-2026-001",
  status: "pendiente_admin",
  
  // Cliente
  customerId: "user123",
  customerName: "Juan Pérez",
  
  // Vendedor asignado
  vendorId: "v1",
  vendorName: "Carlos Ramírez",
  
  // Timeline
  timeline: [
    {
      status: "cotizacion",
      timestamp: "2026-01-09T09:00:00Z",
      userId: "user123",
      userName: "Juan Pérez"
    },
    {
      status: "aprobado_vendedor",
      timestamp: "2026-01-09T10:00:00Z",
      userId: "v1",
      userName: "Carlos Ramírez",
      notes: "Cliente frecuente, aplicar descuento"
    }
  ],
  
  // Aprobaciones
  vendorApprovedAt: "2026-01-09T10:00:00Z",
  vendorApprovedBy: "v1",
  
  // ... resto de campos
}
```

## 📊 Dashboard por Rol

### Dashboard Socio
- ✅ Mis cotizaciones pendientes
- ✅ Pedidos en proceso
- ✅ Historial de pedidos
- ✅ Mi vendedor asignado

### Dashboard Vendedor
- ✅ Cotizaciones por revisar
- ✅ Esperando aprobación admin
- ✅ Pedidos activos
- ✅ Mis clientes

### Dashboard Admin
- ✅ Pendientes de aprobación
- ✅ Estadísticas de ventas
- ✅ Gestión de pedidos
- ✅ Reportes

### Dashboard Bodega
- ✅ Por preparar (ya implementado)
- ✅ En preparación (ya implementado)
- ✅ Listos para despacho (ya implementado)
- ✅ En tránsito (ya implementado)

## 🚀 Próximos Pasos de Implementación

1. ✅ Actualizar tipos de estados (completado)
2. ⏳ Crear componente de aprobación de vendedor
3. ⏳ Crear componente de aprobación de admin
4. ⏳ Implementar sistema de notificaciones por rol
5. ⏳ Agregar timeline visual en detalle de pedido
6. ⏳ Actualizar dashboard de cada rol
7. ⏳ Agregar asignación automática de vendedor
8. ⏳ Implementar webhooks/emails de notificación

## 📝 Notas Importantes

- Los socios solo pueden crear cotizaciones, no pedidos directos
- Cada socio debe tener un vendedor asignado (campo `vendorId` en User)
- Las notificaciones deben ser en tiempo real (usar Firestore listeners)
- El admin puede ver todos los pedidos de todos los vendedores
- El vendedor solo ve pedidos de sus clientes asignados
- La bodega solo ve pedidos confirmados (aprobados por admin)
