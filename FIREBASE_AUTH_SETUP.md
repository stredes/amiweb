# ✅ Firebase Authentication Integrado

## 🎉 Cambios Completados

Se ha integrado **Firebase Authentication real** en tu aplicación:

### ✅ Archivos Modificados:

1. **[authStore.tsx](src/features/auth/authStore.tsx)** - Sincronización automática con Firebase Auth
2. **[LoginPage.tsx](src/pages/auth/LoginPage.tsx)** - Login con `signInWithEmailAndPassword()` de Firebase
3. **[authApi.ts](src/features/auth/authApi.ts)** - Comentarios sobre usuarios Firebase

### ✅ Scripts Disponibles:

- **`./create-users.sh`** - Script bash automatizado (recomendado)
- **`node setup-firebase-guide.js`** - Guía interactiva con comandos curl
- **`node create-firebase-users.js`** - Script Node.js alternativo

---

## 🚀 INICIO RÁPIDO (3 pasos)

### 1️⃣ Habilitar Email/Password en Firebase (1 minuto)

Abre este enlace y habilita Email/Password:

**🔗 https://console.firebase.google.com/project/amiweb-895d7/authentication/providers**

1. Click en **"Email/Password"**
2. Toggle **"Enable"** → Activar
3. Click **"Save"**

### 2️⃣ Crear usuarios automáticamente

```bash
# Opción A: Script Bash (Recomendado)
./create-users.sh

# Opción B: Script Node.js
node create-firebase-users.js

# Opción C: Comandos curl individuales
node setup-firebase-guide.js  # Te da los comandos
```

### 3️⃣ Probar la aplicación

```bash
npm run dev
# Ve a http://localhost:5173/login
# Usa: root@amilab.com / root2026
```

---

## 📋 Usuarios que se crearán

| Email | Contraseña | Rol | Descripción |
|-------|------------|-----|-------------|
| **root@amilab.com** | root2026 | Root | Admin total + upload stock |
| **admin@amilab.com** | admin123 | Admin | Administrador general |
| **vendedor1@amilab.com** | vende123 | Vendedor | Panel de ventas |
| **vendedor2@amilab.com** | vende123 | Vendedor | Panel de ventas |
| **socio@amilab.com** | demo123 | Socio | Portal de clientes |

---

## 🔄 Cómo Funciona el Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                     FLUJO DE AUTENTICACIÓN                  │
└─────────────────────────────────────────────────────────────┘

1. Usuario ingresa credenciales (LoginPage.tsx)
         ↓
2. signInWithEmailAndPassword() - Firebase Auth
         ↓
3. getIdToken() - Obtiene token JWT válido
         ↓
4. authApi.login() - Valida datos del usuario (mock/backend)
         ↓
5. authStore guarda: user + token en localStorage
         ↓
6. onAuthStateChanged() mantiene sesión sincronizada
         ↓
7. StockUploader usa auth.currentUser.getIdToken() ✅
```

---

## 🛠️ Troubleshooting

### Error: "CONFIGURATION_NOT_FOUND"
**Causa:** Email/Password no habilitado en Firebase  
**Solución:** Ve al paso 1️⃣ y habilítalo

### Error: "EMAIL_EXISTS"
**Causa:** El usuario ya fue creado anteriormente  
**Solución:** ✅ No hay problema, ya puedes usarlo

### Error: "WEAK_PASSWORD"
**Causa:** Firebase requiere mínimo 6 caracteres  
**Solución:** Las contraseñas del script ya cumplen este requisito

### StockUploader: "No hay usuario autenticado"
**Causa:** No has iniciado sesión con Firebase Auth  
**Solución:** 
1. Verifica que creaste los usuarios
2. Haz login en `/login`
3. Verifica token en DevTools → Application → Local Storage

---

## 💻 Verificar Configuración

```bash
# Ver configuración actual
node setup-firebase-guide.js

# Debe mostrar:
# ✅ PROJECT_ID: amiweb-895d7
# ✅ API_KEY: AIzaSy...
# ✅ AUTH_DOMAIN: amiweb-895d7.firebaseapp.com
```

---

## 📝 Código Relevante

### authStore sincroniza con Firebase:
```typescript
// src/features/auth/authStore.tsx
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const freshToken = await firebaseUser.getIdToken();
      setToken(freshToken); // ✅ Token siempre fresco
    } else {
      // Cerró sesión → limpiar
      setUser(null);
      setToken(null);
    }
  });
  return () => unsubscribe();
}, []);
```

### LoginPage usa Firebase Auth:
```typescript
// src/pages/auth/LoginPage.tsx
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const firebaseToken = await userCredential.user.getIdToken();
// ✅ Token JWT válido de Firebase
```

### StockUploader obtiene el token:
```typescript
// src/components/admin/StockUploader.tsx
const user = auth.currentUser;
if (!user) throw new Error('No hay usuario autenticado');
const token = await user.getIdToken();
// ✅ Token válido para el backend
```

---

## ✅ Checklist Final

- [x] Firebase Auth integrado en el código
- [x] Scripts de creación disponibles
- [ ] **Email/Password habilitado en Firebase Console** ⚠️
- [ ] **Usuarios creados con el script** ⚠️
- [ ] Login testeado
- [ ] StockUploader funcional

---

## 🎯 Próximos Pasos

1. **Habilita Email/Password**: https://console.firebase.google.com/project/amiweb-895d7/authentication/providers
2. **Ejecuta**: `./create-users.sh`
3. **Prueba**: `npm run dev` → Login con root@amilab.com

¡Listo! El StockUploader ahora tendrá tokens Firebase válidos.
