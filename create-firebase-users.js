#!/usr/bin/env node

/**
 * Script para crear usuarios en Firebase Authentication usando REST API
 * 
 * Uso:
 *   node create-firebase-users.js
 * 
 * Requiere:
 *   - FIREBASE_WEB_API_KEY en .env o como variable de entorno
 *   - FIREBASE_PROJECT_ID en .env o como variable de entorno
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env
function loadEnv() {
  try {
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length) {
          env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
    
    return env;
  } catch (error) {
    console.warn('⚠️  No se pudo leer .env, usando variables de entorno del sistema');
    return {};
  }
}

const env = loadEnv();
const API_KEY = process.env.VITE_FIREBASE_API_KEY || env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID;

if (!API_KEY) {
  console.error('❌ Error: VITE_FIREBASE_API_KEY no encontrada');
  console.error('   Asegúrate de tener el archivo .env con VITE_FIREBASE_API_KEY');
  process.exit(1);
}

if (!PROJECT_ID) {
  console.error('❌ Error: VITE_FIREBASE_PROJECT_ID no encontrado');
  process.exit(1);
}

// Usuarios a crear
const users = [
  {
    email: 'root@spdental.com',
    password: 'root2026',
    displayName: 'Desarrollador Web',
    role: 'root'
  },
  {
    email: 'admin@spdental.com',
    password: 'admin123',
    displayName: 'Roberto Silva',
    role: 'admin'
  },
  {
    email: 'vendedor1@spdental.com',
    password: 'vende123',
    displayName: 'Carlos Ramírez',
    role: 'vendedor'
  },
  {
    email: 'vendedor2@spdental.com',
    password: 'vende123',
    displayName: 'Ana Torres',
    role: 'vendedor'
  },
  {
    email: 'socio@spdental.com',
    password: 'demo123',
    displayName: 'Juan Pérez',
    role: 'socio'
  },
  {
    email: 'bodega@spdental.com',
    password: 'bodega123',
    displayName: 'Miguel Soto',
    role: 'bodega'
  },
];

/**
 * Crear usuario usando Firebase REST API
 */
async function createUser(email, password, displayName) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      displayName,
      returnSecureToken: true
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error desconocido');
  }
  
  return data;
}

/**
 * Verificar si un usuario ya existe intentando hacer login
 */
async function userExists(email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Proceso principal
 */
async function main() {
  console.log('🔧 Creando usuarios en Firebase Authentication...');
  console.log(`📋 Proyecto: ${PROJECT_ID}\n`);

  let created = 0;
  let existing = 0;
  let failed = 0;

  for (const user of users) {
    try {
      // Verificar si ya existe
      const exists = await userExists(user.email, user.password);
      
      if (exists) {
        console.log(`✓ Usuario ${user.email} ya existe`);
        existing++;
        continue;
      }

      // Crear el usuario
      const result = await createUser(user.email, user.password, user.displayName);
      console.log(`✅ Usuario creado: ${user.email} (${user.role})`);
      console.log(`   UID: ${result.localId}`);
      created++;
      
      // Pequeña pausa entre creaciones
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error creando ${user.email}:`);
      
      if (error.message.includes('EMAIL_EXISTS')) {
        console.error('   El email ya está registrado (intenta con credenciales diferentes)');
        existing++;
      } else if (error.message.includes('WEAK_PASSWORD')) {
        console.error('   La contraseña es muy débil (mínimo 6 caracteres)');
        failed++;
      } else if (error.message.includes('INVALID_EMAIL')) {
        console.error('   Email inválido');
        failed++;
      } else {
        console.error(`   ${error.message}`);
        failed++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Resumen:');
  console.log(`   ✅ Creados: ${created}`);
  console.log(`   ✓  Ya existían: ${existing}`);
  console.log(`   ❌ Fallos: ${failed}`);
  console.log('='.repeat(50));

  if (created > 0 || existing === users.length) {
    console.log('\n✅ ¡Proceso completado exitosamente!');
    console.log('\n🚀 Próximos pasos:');
    console.log('   1. Inicia tu app: npm run dev');
    console.log('   2. Ve a: http://localhost:5173/login');
    console.log('   3. Usa cualquiera de las credenciales creadas');
    console.log('\n📝 Credenciales disponibles:');
    users.forEach(u => {
      console.log(`   • ${u.email} / ${u.password} (${u.role})`);
    });
  } else if (failed > 0) {
    console.log('\n⚠️  Algunos usuarios no se pudieron crear');
    console.log('   Revisa los errores arriba');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ Error fatal:', error.message);
  process.exit(1);
});
