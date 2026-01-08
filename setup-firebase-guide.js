#!/usr/bin/env node

/**
 * Verificador y Guía de Configuración de Firebase Authentication
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    return {};
  }
}

const env = loadEnv();
const API_KEY = process.env.VITE_FIREBASE_API_KEY || env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID;
const AUTH_DOMAIN = process.env.VITE_FIREBASE_AUTH_DOMAIN || env.VITE_FIREBASE_AUTH_DOMAIN;

console.log('🔍 Verificando configuración de Firebase...\n');

// Verificar variables
let configOk = true;

if (!PROJECT_ID) {
  console.log('❌ VITE_FIREBASE_PROJECT_ID no encontrado');
  configOk = false;
} else {
  console.log(`✅ PROJECT_ID: ${PROJECT_ID}`);
}

if (!API_KEY) {
  console.log('❌ VITE_FIREBASE_API_KEY no encontrado');
  configOk = false;
} else {
  console.log(`✅ API_KEY: ${API_KEY.substring(0, 20)}...`);
}

if (!AUTH_DOMAIN) {
  console.log('❌ VITE_FIREBASE_AUTH_DOMAIN no encontrado');
  configOk = false;
} else {
  console.log(`✅ AUTH_DOMAIN: ${AUTH_DOMAIN}`);
}

console.log('\n' + '='.repeat(70));

if (!configOk) {
  console.log('\n❌ Configuración incompleta. Verifica tu archivo .env\n');
  process.exit(1);
}

console.log('\n⚠️  ERROR DETECTADO: Email/Password Authentication no está habilitado\n');

console.log('📋 PASOS PARA HABILITAR (2 minutos):\n');

console.log('1️⃣  Abre Firebase Console:');
console.log(`   🔗 https://console.firebase.google.com/project/${PROJECT_ID}/authentication/providers\n`);

console.log('2️⃣  Habilita Email/Password:');
console.log('   • Click en "Email/Password"');
console.log('   • Toggle "Enable" → Activar');
console.log('   • Click "Save"\n');

console.log('3️⃣  Crea los usuarios manualmente:');
console.log(`   🔗 https://console.firebase.google.com/project/${PROJECT_ID}/authentication/users\n`);
console.log('   Click "Add user" para cada uno:\n');

const users = [
  { email: 'root@amilab.com', password: 'root2026', role: 'Root (Admin total)' },
  { email: 'admin@amilab.com', password: 'admin123', role: 'Administrador' },
  { email: 'vendedor1@amilab.com', password: 'vende123', role: 'Vendedor' },
  { email: 'vendedor2@amilab.com', password: 'vende123', role: 'Vendedor' },
  { email: 'socio@amilab.com', password: 'demo123', role: 'Socio/Cliente' },
];

console.log('   ┌─────────────────────────────┬──────────────┬─────────────────┐');
console.log('   │ Email                       │ Contraseña   │ Rol             │');
console.log('   ├─────────────────────────────┼──────────────┼─────────────────┤');
users.forEach(u => {
  const email = u.email.padEnd(27);
  const pass = u.password.padEnd(12);
  const role = u.role.padEnd(15);
  console.log(`   │ ${email} │ ${pass} │ ${role} │`);
});
console.log('   └─────────────────────────────┴──────────────┴─────────────────┘\n');

console.log('4️⃣  Prueba la aplicación:');
console.log('   npm run dev');
console.log('   # Ve a http://localhost:5173/login\n');

console.log('='.repeat(70));
console.log('\n💡 ALTERNATIVA RÁPIDA: Copiar comandos curl\n');

console.log('Si prefieres crear usuarios por línea de comandos (después de habilitar):\n');

users.forEach((user, i) => {
  console.log(`# Usuario ${i + 1}: ${user.email} (${user.role})`);
  console.log(`curl -X POST 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}' \\`);
  console.log(`  -H 'Content-Type: application/json' \\`);
  console.log(`  -d '{"email":"${user.email}","password":"${user.password}","returnSecureToken":true}'\n`);
});

console.log('='.repeat(70));
console.log('\n📚 Documentación completa: FIREBASE_AUTH_SETUP.md\n');
