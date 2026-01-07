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

  const searchTerm = termOverride ?? term;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // TODO: reemplazar por llamadas HTTP reales.
      const [catalog, availableCategories] = await Promise.all([
        getProducts({ search: searchTerm, categoryId: selectedCategoryId }),
        getCategories()
      ]);
      setProducts(catalog);
      setCategories(availableCategories);
      setLoading(false);
    };

    fetchData();
  }, [searchTerm, selectedCategoryId]);

  return { products, categories, loading };
}

export default useProducts;
