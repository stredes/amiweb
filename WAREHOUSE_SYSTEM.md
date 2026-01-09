# Sistema de Bodega - Amilab

Sistema completo de gestión de bodega para preparación y despacho de pedidos.

## 🎯 Características

### Dashboard de Bodega
- **Estadísticas en tiempo real**: Visualización de pedidos pendientes, en preparación, listos para despacho y despachados
- **Gestión de pedidos**: Sistema de pestañas para separar preparación y despacho
- **Interfaz intuitiva**: Diseño optimizado para el flujo de trabajo de bodega

### Preparación de Pedidos
- ✅ **Sistema de checklist**: Verificación producto por producto
- 📦 **Información detallada**: Datos completos del cliente y dirección de envío
- ⏰ **Indicadores de prioridad**: Marcado de pedidos urgentes según antigüedad
- 📊 **Barra de progreso**: Visualización del avance de preparación
- 🔄 **Estados flexibles**: Manejo de pedidos pendientes, confirmados y en procesamiento

### Gestión de Despacho
- 🚚 **Asignación de tracking**: Ingreso de número de seguimiento para cada pedido
- 📍 **Dirección completa**: Visualización de destino e instrucciones de entrega
- ✅ **Confirmación de entrega**: Sistema para marcar pedidos como entregados
- 📋 **Historial de envíos**: Seguimiento de pedidos en tránsito

## 👤 Credenciales de Prueba

### Todos los Roles Disponibles
```
Bodega:   bodega@amilab.com / bodega123
Socio:    socio@amilab.com / demo123
Vendedor: vendedor1@amilab.com / vende123
Admin:    admin@amilab.com / admin123
Root:     root@amilab.com / root2026
```

### Permisos
- Visualizar todos los pedidos
- Cambiar estado de pedidos a: procesando, enviado, entregado
- Agregar números de seguimiento
- Acceder al dashboard de bodega (`/bodega`)

## 🚀 Instalación

### 1. Crear el usuario en Firebase

Ejecuta el script para crear el usuario de bodega:

```bash
# Primero, actualiza la ruta del serviceAccountKey en create-warehouse-user.js
node create-warehouse-user.js
```

### 2. Actualizar Firestore Rules

Las reglas de Firestore ya incluyen permisos para el rol 'bodega':

```javascript
match /orders/{orderId} {
  // Bodega puede leer todos los pedidos y actualizar status/tracking
  allow read: if isAuthenticated() && 
    (request.auth.token.role == 'bodega' || 
     request.auth.token.role == 'admin' || 
     request.auth.token.role == 'root');
  
  allow update: if isAuthenticated() && 
    (request.auth.token.role == 'bodega' || 
     request.auth.token.role == 'admin' || 
     request.auth.token.role == 'root');
}
```

## 📱 Uso del Sistema

### Flujo de Trabajo

#### 1. Preparación de Pedidos
1. El operario ingresa al dashboard de bodega
2. Ve la lista de pedidos pendientes en la pestaña "Preparación de Pedidos"
3. Expande un pedido para ver los detalles
4. Va marcando cada producto conforme lo recoge
5. Una vez todos los productos están verificados, completa la preparación
6. El pedido queda listo para despacho

#### 2. Gestión de Despacho
1. El operario cambia a la pestaña "Gestión de Despachos"
2. Ve los pedidos listos para enviar
3. Selecciona un pedido y expande los detalles
4. Ingresa el número de seguimiento de la empresa de transporte
5. Marca el pedido como enviado
6. El pedido pasa a la sección "En Tránsito"
7. Cuando se confirma la entrega, marca el pedido como entregado

### Estados de Pedido

```
pendiente → confirmado → procesando → enviado → entregado
                            ↓
                        cancelado
```

**Flujo para bodega:**
- `pendiente/confirmado`: Pedido nuevo que debe prepararse
- `procesando`: Pedido en preparación o listo para despacho
- `enviado`: Pedido despachado con tracking
- `entregado`: Pedido confirmado como recibido

## 🎨 Componentes Principales

### WarehouseDashboardPage
Página principal del dashboard de bodega con estadísticas y pestañas.

**Ubicación:** `src/pages/warehouse/WarehouseDashboardPage.tsx`

**Características:**
- Estadísticas de pedidos
- Sistema de pestañas
- Carga asíncrona de pedidos

### OrderPreparation
Componente para la preparación de pedidos.

**Ubicación:** `src/components/warehouse/OrderPreparation.tsx`

**Características:**
- Lista expandible de pedidos
- Checklist de productos
- Indicadores de prioridad
- Barra de progreso

### ShippingManagement
Componente para la gestión de despachos.

**Ubicación:** `src/components/warehouse/ShippingManagement.tsx`

**Características:**
- Sección de listos para despacho
- Sección de en tránsito
- Input de número de seguimiento
- Confirmación de entrega

## 🔧 Configuración Técnica

### Tipos TypeScript

El rol 'bodega' ha sido agregado al tipo `User`:

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'socio' | 'admin' | 'root' | 'vendedor' | 'bodega';
  company?: string;
  vendorId?: string;
  phone?: string;
}
```

### Rutas

Nueva ruta agregada:

```typescript
warehouseDashboard: '/bodega'
```

### API

Método agregado en `authApi`:

```typescript
async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order>
```

## 📊 Datos de Prueba

El sistema incluye pedidos de prueba con diferentes estados:

- **ORD-2026-001**: En preparación (procesando)
- **ORD-2026-002**: Enviado
- **ORD-2026-003**: Entregado
- **ORD-2026-004**: Pendiente (recién creado)
- **ORD-2026-005**: Confirmado (listo para preparar)

## 🎯 Próximas Mejoras

- [ ] Sistema de escaneo de código de barras
- [ ] Impresión de etiquetas de envío
- [ ] Notificaciones push para nuevos pedidos
- [ ] Historial de picking por operario
- [ ] Reportes de productividad
- [ ] Integración con sistemas de transporte
- [ ] Fotografía de productos embalados
- [ ] Firma digital de recepción

## 📝 Notas

- El sistema actualmente usa datos mock. En producción, conectar con Firestore.
- Los números de seguimiento pueden ser de cualquier formato según la empresa de transporte.
- Las prioridades se calculan automáticamente según la antigüedad del pedido.
- El sistema es completamente responsive y funciona en tablets.

## 🔐 Seguridad

- Solo usuarios con rol 'bodega', 'admin' o 'root' pueden acceder al dashboard
- Los pedidos solo pueden ser actualizados, no eliminados
- Todas las acciones quedan registradas con timestamp
- Autenticación mediante Firebase Authentication

## 📱 Soporte

Para soporte técnico contactar a:
- Email: soporte@amilab.com
- Teléfono: +56 2 2345 6789
