import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { productCategories } from './mockData';
import { Product, ProductCategory, ProductFilters } from './types';

// Devuelve categorías desde Firestore o desde las definidas localmente
export async function getCategories(): Promise<ProductCategory[]> {
  try {
    // Intentar cargar categorías desde Firestore si existen
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    if (snapshot.empty) {
      // Si no hay categorías en Firestore, usar las definidas localmente
      console.log('📋 Usando categorías locales (familias)');
      return Promise.resolve(productCategories);
    }
    
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ProductCategory[];
    
    console.log(`✅ Categorías cargadas desde Firestore: ${categories.length}`);
    return categories;
  } catch (error) {
    console.error('❌ Error al cargar categorías desde Firestore:', error);
    return Promise.resolve(productCategories);
  }
}

// Obtiene productos desde Firestore con filtros opcionales.
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    
    // Si hay filtro de categoría, intentar filtrar
    if (filters?.categoryId) {
      // Intentar filtrar por 'familia' primero
      let productsQuery = query(productsRef, where('familia', '==', filters.categoryId));
      let snapshot = await getDocs(productsQuery);
      
      if (snapshot.empty) {
        // Si no hay resultados, intentar con 'categoryId'
        productsQuery = query(productsRef, where('categoryId', '==', filters.categoryId));
        snapshot = await getDocs(productsQuery);
      }
      
      let products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Asegurar que categoryId exista usando familia como fallback
        categoryId: doc.data().categoryId || doc.data().familia || '',
        shortDescription: doc.data().shortDescription || doc.data().descripcion || '',
        longDescription: doc.data().longDescription || doc.data().descripcion || '',
        specs: doc.data().specs || {},
        requiresInstallation: doc.data().requiresInstallation || false
      })) as Product[];

      // Aplicar filtro de búsqueda
      if (filters.search) {
        const term = filters.search.toLowerCase();
        products = products.filter(
          (product) =>
            product.name?.toLowerCase().includes(term) ||
            product.brand?.toLowerCase().includes(term) ||
            product.shortDescription?.toLowerCase().includes(term) ||
            product.familia?.toLowerCase().includes(term) ||
            product.subfamilia?.toLowerCase().includes(term)
        );
      }

      console.log(`✅ Productos filtrados: ${products.length} (categoría: ${filters.categoryId})`);
      return products;
    }
    
    // Sin filtro de categoría: cargar TODOS los productos
    const snapshot = await getDocs(productsRef);
    let products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.nombre || data.name || 'Sin nombre',
        brand: data.marca || data.brand || 'Sin marca',
        categoryId: data.familia || data.categoryId || 'Sin categoría',
        familia: data.familia,
        subfamilia: data.subfamilia,
        shortDescription: data.descripcion || data.shortDescription || '',
        longDescription: data.descripcion || data.longDescription || '',
        code: data.codigo || data.code,
        precio: data.precio,
        stock: data.stock,
        specs: data.specs || {},
        requiresInstallation: data.requiresInstallation || false,
        imageUrl: data.imageUrl || data.imagen
      } as Product;
    });

    // Aplicar filtro de búsqueda si existe
    if (filters?.search) {
      const term = filters.search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.brand?.toLowerCase().includes(term) ||
          product.shortDescription?.toLowerCase().includes(term) ||
          product.familia?.toLowerCase().includes(term) ||
          product.subfamilia?.toLowerCase().includes(term)
      );
    }

    console.log(`✅ Productos cargados desde Firestore: ${products.length}`);
    return products;
  } catch (error) {
    console.error('❌ Error al cargar productos desde Firestore:', error);
    return [];
  }
}

// Obtiene un producto por id desde Firestore.
export async function getProductById(productId: string): Promise<Product | undefined> {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      return {
        id: productDoc.id,
        ...productDoc.data()
      } as Product;
    }
    
    console.warn(`⚠️ Producto no encontrado: ${productId}`);
    return undefined;
  } catch (error) {
    console.error('❌ Error al cargar producto desde Firestore:', error);
    return undefined;
  }
}
