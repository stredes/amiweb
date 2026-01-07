import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import ProductFilters from '../../components/products/ProductFilters';
import Loader from '../../components/ui/Loader';
import useProducts from '../../hooks/useProducts';
import { useSearchStore } from '../../features/search/searchStore';
import { Product } from '../../features/catalog/types';
import QuoteRequestModal from '../../components/products/QuoteRequestModal';

function ProductsPage() {
  const { term, setTerm } = useSearchStore();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState(term);
  const [quotedProduct, setQuotedProduct] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, loading } = useProducts(
    selectedCategory || undefined,
    searchTerm
  );

  // Map de categorías para mostrar nombres en tarjetas.
  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  // Inicializa filtros desde query params (?categoryId=&q=)
  useEffect(() => {
    const cat = searchParams.get('categoryId') ?? '';
    const q = searchParams.get('q') ?? '';
    setSelectedCategory(cat);
    setSearchTerm(q);
    setTerm(q);
  }, [searchParams, setTerm]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('categoryId', value);
      else next.delete('categoryId');
      if (searchTerm) next.set('q', searchTerm);
      else next.delete('q');
      return next;
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setTerm(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('q', value);
      else next.delete('q');
      if (selectedCategory) next.set('categoryId', selectedCategory);
      else next.delete('categoryId');
      return next;
    });
  };

  const handleQuote = (product: Product) => {
    setQuotedProduct(product);
  };

  return (
    <div className="page">
      <header className="page__header">
        <h1>Productos</h1>
        <p>
          Catálogo de equipos, reactivos e insumos para laboratorios clínicos. {/* TODO: paginación
          y filtros conectados a backend. */}
        </p>
      </header>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="grid three">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryNameById.get(product.categoryId) ?? 'Sin categoría'}
              onQuote={handleQuote}
            />
          ))}
          {products.length === 0 && (
            <p>No hay productos que coincidan con los filtros seleccionados.</p>
          )}
        </div>
      )}

      {quotedProduct && (
        <QuoteRequestModal product={quotedProduct} onClose={() => setQuotedProduct(null)} />
      )}
    </div>
  );
}

export default ProductsPage;
