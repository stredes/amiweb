# Sistema de Gestión de Usuarios AMIWEB

## Descripción General

El usuario **ROOT** tiene control total del sistema y puede crear y gestionar todos los tipos de usuarios de la plataforma.

## Tipos de Usuarios y Sus Roles

### 🔐 ROOT
- **Descripción**: Superadministrador del sistema
- **Permisos**: 
  - Acceso completo a todas las funcionalidades
  - Crear, editar y eliminar cualquier tipo de usuario
  - Gestión de inventario
  - Aprobación de pedidos
  - Visualización de todas las métricas
  - Control total del sistema

### 👔 ADMIN / JEFE
- **Descripción**: Administradores y jefes de la empresa
- **Permisos**:
  - Aprobación final de pedidos
  - Visualización de métricas y reportes
  - Gestión de pedidos
  - Acceso al dashboard administrativo
  - No puede crear/eliminar usuarios (solo ROOT)

### 💼 VENDEDOR
- **Descripción**: Personal de ventas
- **Permisos**:
  - Gestionar pedidos de sus clientes asignados
  - Aprobar/rechazar cotizaciones
  - Ver historial de sus ventas
  - Acceder al dashboard de vendedor
  - Crear cotizaciones

### 📞 CALL CENTER
- **Descripción**: Personal de atención telefónica y administrativa
- **Permisos**:
  - Gestión de pedidos y cotizaciones
  - Atención y seguimiento de clientes
  - Actualización de estados de pedidos
  - Acceso a información de clientes

### 🔧 SOPORTE / INGENIERO
- **Descripción**: Personal técnico y de soporte
- **Permisos**:
  - Asistencia técnica a clientes
  - Gestión de tickets de soporte
  - Acceso a información técnica de productos
  - Resolución de problemas técnicos

### 📦 BODEGA
- **Descripción**: Personal de bodega y logística
- **Permisos**:
  - Control de inventario
  - Gestión de stock
  - Preparación de pedidos
  - Actualización de estados de envío
  - Acceso al dashboard de bodega

### 👥 SOCIO / CLIENTE
- **Descripción**: Clientes de la plataforma
- **Permisos**:
  - Crear cotizaciones
  - Ver y gestionar sus pedidos
  - Acceso al portal de socios
  - Seguimiento de pedidos
  - Descargar facturas

## Flujo de Creación de Usuarios

### Usuario ROOT puede:

1. **Crear Socios/Clientes**: Para empresas que compran productos
2. **Crear Vendedores**: Para gestionar carteras de clientes
3. **Crear Call Center**: Para atención y gestión telefónica
4. **Crear Soporte**: Para asistencia técnica
5. **Crear Bodega**: Para control de inventario
6. **Crear Administradores**: Para jefes y gerentes
7. **Crear otros ROOT**: Para delegar control total (con precaución)

### Datos requeridos al crear usuario:

- ✅ Nombre completo *
- ✅ Email * (único en el sistema)
- ✅ Contraseña * (mínimo 6 caracteres)
- ✅ Rol/Tipo de usuario *
- 📱 Teléfono
- 🏢 Empresa/Organización
- 🏷️ Departamento/Área

## Gestión de Usuarios

### Acciones disponibles para ROOT:

- ✏️ **Editar Usuario**: Modificar información y rol
- 🗑️ **Eliminar Usuario**: Borrar usuario del sistema (excepto el propio ROOT)
- 🔄 **Activar/Desactivar**: Suspender temporalmente acceso
- 🔑 **Resetear Contraseña**: Establecer nueva contraseña

### Restricciones:

- Solo ROOT puede gestionar usuarios
- No se puede eliminar el propio usuario ROOT
- Los emails deben ser únicos en el sistema
- Las contraseñas deben tener al menos 6 caracteres

## Seguridad

- Todas las contraseñas se almacenan encriptadas
- Los tokens de sesión expiran después de inactividad
- Logs de auditoría para acciones críticas
- Verificación de permisos en cada operación

## API Endpoints

```
GET    /api/users              - Listar todos los usuarios
POST   /api/users              - Crear nuevo usuario
PUT    /api/users/:id          - Actualizar usuario
DELETE /api/users/:id          - Eliminar usuario
PATCH  /api/users/:id/status   - Activar/Desactivar usuario
POST   /api/users/:id/reset-password - Resetear contraseña
GET    /api/users/role/:role   - Obtener usuarios por rol
```

## Próximas Mejoras

- [ ] Permisos granulares por funcionalidad
- [ ] Historial de acciones por usuario
- [ ] Notificaciones de cambios en usuarios
- [ ] Importación masiva de usuarios
- [ ] Gestión de equipos y departamentos
- [ ] Sistema de roles personalizados
