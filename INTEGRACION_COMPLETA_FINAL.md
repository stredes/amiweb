# INTEGRACION COMPLETA - SISTEMA DE COTIZACIONES (FRONTEND + BACKEND)

## Objetivo
Documento final de la integracion completa del flujo de cotizaciones, desde el portal de socios hasta la conversion a orden y notificaciones.

## Alcance
- Frontend actualizado para crear cotizaciones reales contra el backend.
- Servicio dedicado `quoteService` con endpoints de cotizaciones y notificaciones.
- Modal de checkout simplificado para solicitar cotizacion.

## Archivos clave
- `src/features/quotes/quoteService.ts`
  - Calcula subtotal, IVA (19%), descuento y total.
  - Mapea productos a `items` con `productId`, `productName`, `quantity`, `unitPrice`, `subtotal`, `sku`.
  - Endpoints: crear cotizacion, aprobaciones, conversion a orden, notificaciones.
- `src/components/cart/CheckoutModal.tsx`
  - Flujo de dos pasos: informacion del cliente -> confirmacion.
  - Envia cotizacion con `quoteService.createQuote`.
  - Campo de notas adicionales opcional.
  - Mensajes y textos alineados al proceso de cotizacion.

## Flujo funcional completo
1) Cliente arma carrito y solicita cotizacion.
2) Backend crea quote en estado `pendiente` y notifica al vendedor.
3) Vendedor aprueba o rechaza.
4) Admin aprueba o rechaza.
5) Si se aprueba, se convierte a orden y se notifica a los actores.

## Endpoints consumidos
```
POST /api/quotes
GET /api/quotes/vendor/pending
POST /api/quotes/{id}/vendor-approve
POST /api/quotes/{id}/admin-approve
POST /api/quotes/{id}/convert-to-order
GET /api/notifications?unreadOnly=true
PATCH /api/notifications (markAllAsRead)
PATCH /api/notifications/{id} (read=true)
```

## Contratos principales
- `CreateQuoteData`: datos de cliente, productos y notas.
- `Quote`: estado completo de la cotizacion (totales, estados, timestamps).
- `QuoteNotification`: notificaciones generadas por el flujo.

## Estado final
- Integracion funcional completa en frontend para crear cotizaciones.
- Servicio de cotizaciones listo para aprobaciones y conversion.
- CheckoutModal alineado al flujo de cotizacion.

## Validacion manual sugerida
1) Agregar productos al carrito.
2) Abrir "Solicitar Cotizacion" y completar datos.
3) Confirmar y enviar.
4) Verificar que el backend cree la cotizacion y registre notificacion.
