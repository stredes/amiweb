/**
 * Script para crear el usuario de bodega en Firebase
 * 
 * Ejecutar con: node create-warehouse-user.js
 */

const admin = require('firebase-admin');

// Inicializar Firebase Admin
const serviceAccount = require('./path-to-your-serviceAccountKey.json'); // Actualizar esta ruta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const firestore = admin.firestore();

async function createWarehouseUser() {
  try {
    console.log('🏭 Creando usuario de bodega en Firebase...\n');

    // Datos del usuario de bodega
    const warehouseUser = {
      email: 'bodega@amilab.com',
      password: 'bodega123', // Cambiar en producción
      displayName: 'Miguel Soto',
      disabled: false
    };

    // Crear el usuario en Firebase Authentication
    console.log('📝 Creando usuario en Firebase Auth...');
    const userRecord = await auth.createUser({
      email: warehouseUser.email,
      password: warehouseUser.password,
      displayName: warehouseUser.displayName,
      disabled: warehouseUser.disabled
    });

    console.log('✅ Usuario creado en Auth:', userRecord.uid);

    // Crear el documento del usuario en Firestore
    console.log('📄 Creando documento en Firestore...');
    await firestore.collection('users').doc(userRecord.uid).set({
      email: warehouseUser.email,
      name: warehouseUser.displayName,
      role: 'bodega',
      company: 'Amilab - Bodega',
      phone: '+56 9 6666 7777',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Documento creado en Firestore');

    // Establecer claims personalizados para el rol
    console.log('🔐 Estableciendo custom claims...');
    await auth.setCustomUserClaims(userRecord.uid, {
      role: 'bodega'
    });

    console.log('✅ Custom claims establecidos');

    console.log('\n✨ Usuario de bodega creado exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', warehouseUser.email);
    console.log('🔑 Password:', warehouseUser.password);
    console.log('👤 Nombre:', warehouseUser.displayName);
    console.log('🎭 Rol: bodega');
    console.log('🆔 UID:', userRecord.uid);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña en producción\n');

  } catch (error) {
    console.error('❌ Error al crear el usuario:', error);
    
    // Detalles del error
    if (error.code === 'auth/email-already-exists') {
      console.log('\n💡 El usuario ya existe. Si quieres recrearlo, primero elimínalo desde la consola de Firebase.');
    } else {
      console.log('\nCódigo de error:', error.code);
      console.log('Mensaje:', error.message);
    }
  } finally {
    // Cerrar la conexión
    process.exit(0);
  }
}

// Ejecutar la función
createWarehouseUser();
