import { useEffect, useState } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function FirestoreTest() {
  const [status, setStatus] = useState<string>('Verificando...');
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('🔄 Conectando a Firestore...');
        
        // Intentar obtener los primeros 5 productos
        const productsRef = collection(db, 'products');
        const q = query(productsRef, limit(5));
        
        setStatus('📥 Obteniendo productos...');
        const snapshot = await getDocs(q);
        
        setStatus(`✅ Conexión exitosa! ${snapshot.size} productos obtenidos`);
        
        const prods = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProducts(prods);
        console.log('🔍 Primeros productos:', prods);
        
      } catch (err: any) {
        console.error('❌ Error en FirestoreTest:', err);
        setError(err.message || 'Error desconocido');
        setStatus('❌ Error al conectar con Firestore');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: 'white', 
      padding: '1rem', 
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      maxWidth: '400px',
      zIndex: 9999,
      fontSize: '0.9rem'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>🔧 Firestore Debug</h3>
      <p style={{ margin: '0.5rem 0' }}><strong>Estado:</strong> {status}</p>
      
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '0.5rem', 
          borderRadius: '4px',
          marginTop: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {products.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <strong>Primeros productos:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '0.85rem' }}>
            {products.map((p, i) => (
              <li key={i}>
                {p.nombre || p.name || 'Sin nombre'} 
                {p.familia && ` (${p.familia})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
