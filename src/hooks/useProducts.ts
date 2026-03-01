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
  const [reloadKey, setReloadKey] = useState(0);

  const searchTerm = termOverride ?? term;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Construir filtros solo si tienen valores reales
        const filters: any = {};
        if (searchTerm && searchTerm.trim() !== '') {
          filters.search = searchTerm;
        }
        if (selectedCategoryId && selectedCategoryId.trim() !== '') {
          filters.categoryId = selectedCategoryId;
        }
        
        const [catalog, availableCategories] = await Promise.all([
          getProducts(Object.keys(filters).length > 0 ? filters : undefined),
          getCategories()
        ]);

        setProducts(catalog);
        setCategories(availableCategories);
      } catch (err) {
        console.error('❌ useProducts: Error al cargar datos', err);
        if (err instanceof Error && err.message.toLowerCase().includes('fetch')) {
          setError('No se pudo conectar con el backend del catálogo.');
        } else {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedCategoryId, reloadKey]);

  return {
    products,
    categories,
    loading,
    error,
    refetch: () => setReloadKey((prev) => prev + 1),
  };
}

export default useProducts;
