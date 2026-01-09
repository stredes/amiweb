import { useEffect, useState } from 'react';
import { getCategories, getProducts } from '../features/catalog/catalogApi';
import { Product, ProductCategory } from '../features/catalog/types';
import { useSearchStore } from '../features/search/searchStore';

// Hook para cargar productos y categorías con filtros locales.
function useProducts(selectedCategoryId?: string, termOverride?: string) {
  const { term } = useSearchStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTerm = termOverride ?? term;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 useProducts: Iniciando carga...', { searchTerm, selectedCategoryId });
        
        // Construir filtros solo si tienen valores reales
        const filters: any = {};
        if (searchTerm && searchTerm.trim() !== '') {
          filters.search = searchTerm;
        }
        if (selectedCategoryId && selectedCategoryId.trim() !== '') {
          filters.categoryId = selectedCategoryId;
        }
        
        console.log('📋 Filtros construidos:', filters);
        
        const [catalog, availableCategories] = await Promise.all([
          getProducts(Object.keys(filters).length > 0 ? filters : undefined),
          getCategories()
        ]);
        
        console.log('📦 useProducts: Datos recibidos', {
          productos: catalog.length,
          categorias: availableCategories.length
        });
        
        setProducts(catalog);
        setCategories(availableCategories);
      } catch (err) {
        console.error('❌ useProducts: Error al cargar datos', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedCategoryId]);

  return { products, categories, loading, error };
}

export default useProducts;
