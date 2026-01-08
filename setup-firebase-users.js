/**
 * Script para crear usuarios en Firebase Authentication
 * 
 * Ejecutar: node setup-firebase-users.js
 */

import admin from 'firebase-admin';

// Cargar credenciales desde variables de entorno
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

const users = [
  {
    email: 'socio@amilab.com',
    password: 'demo123',
    displayName: 'Juan Pérez',
  },
  {
    email: 'admin@amilab.com',
    password: 'admin123',
    displayName: 'Roberto Silva',
  },
  {
    email: 'root@amilab.com',
    password: 'root2026',
    displayName: 'Desarrollador Web',
  },
  {
    email: 'vendedor1@amilab.com',
    password: 'vende123',
    displayName: 'Carlos Ramírez',
  },
  {
    email: 'vendedor2@amilab.com',
    password: 'vende123',
    displayName: 'Ana Torres',
  },
];

async function createUsers() {
  console.log('🔧 Creando usuarios en Firebase Authentication...\n');

  for (const user of users) {
    try {
      // Verificar si el usuario ya existe
      try {
        const existingUser = await admin.auth().getUserByEmail(user.email);
        console.log(`✓ Usuario ${user.email} ya existe (UID: ${existingUser.uid})`);
        continue;
      } catch (error) {
        // Usuario no existe, proceder a crearlo
      }

      // Crear el usuario
      const userRecord = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true, // Marcar como verificado
      });

      console.log(`✓ Usuario creado: ${user.email} (UID: ${userRecord.uid})`);
    } catch (error) {
      console.error(`✗ Error creando ${user.email}:`, error.message);
    }
  }

  console.log('\n✅ Proceso completado');
  process.exit(0);
}

createUsers().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
