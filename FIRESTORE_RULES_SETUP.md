# Configuración de Reglas de Firestore

## Problema Actual
❌ Error: **Missing or insufficient permissions**

Los productos están en Firestore pero las reglas no permiten lectura pública de la colección `products`.

## Solución

### Paso 1: Ir a Firebase Console
1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **amiweb-895d7**
3. En el menú lateral, ve a **Firestore Database**
4. Haz clic en la pestaña **Reglas** (Rules)

### Paso 2: Actualizar las Reglas
Copia y pega el contenido del archivo `firestore.rules` en el editor:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Colección de productos - Lectura pública
    match /products/{productId} {
      allow read: if true;  // ✅ Permitir lectura pública
      allow write: if request.auth != null && request.auth.token.role in ['admin', 'root'];
    }
    
    // Colección de categorías - Lectura pública
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role in ['admin', 'root'];
    }
    
    // Usuarios y órdenes - Solo autenticados
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || request.auth.token.role in ['admin', 'root']);
      allow write: if request.auth != null && request.auth.token.role in ['admin', 'root'];
    }
    
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Paso 3: Publicar las Reglas
1. Haz clic en el botón **Publicar** (Publish)
2. Confirma los cambios

### Paso 4: Verificar
1. Recarga la página de productos en tu aplicación
2. El cuadro de debug debería mostrar: **✅ Conexión exitosa!**
3. Los 846 productos deberían cargarse automáticamente

## Explicación de las Reglas

- **`allow read: if true`** → Permite lectura pública sin autenticación (necesario para el catálogo)
- **`allow write: if request.auth != null`** → Solo usuarios autenticados pueden modificar datos
- **`request.auth.token.role in ['admin', 'root']`** → Solo admins pueden escribir productos

## Seguridad
✅ Los productos son de solo lectura para visitantes  
✅ Solo admins autenticados pueden modificar el catálogo  
✅ Los datos de usuarios y órdenes están protegidos  

## Alternativa Rápida (Solo para Testing)
Si quieres permitir todo temporalmente para testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;  // ⚠️ Solo para desarrollo
      allow write: if request.auth != null;
    }
  }
}
```

⚠️ **NO uses esto en producción**
