import { useEffect, useMemo, useState, useCallback, type UIEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import ProductFilters from '../../components/products/ProductFilters';
import Loader from '../../components/ui/Loader';
import { FadeIn } from '../../components/ui/FadeIn';
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
  const { products, categories, loading, error } = useProducts(
    selectedCategory || undefined,
    searchTerm
  );
  const [visibleCount, setVisibleCount] = useState(16);
  const batchSize = 16;

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

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [selectedCategory, searchTerm]);

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

  const handleQuote = useCallback((product: Product) => {
    setQuotedProduct(product);
  }, []);

  const handleGridScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const threshold = 200;
      if (target.scrollHeight - target.scrollTop - target.clientHeight < threshold) {
        setVisibleCount((prev) => Math.min(prev + batchSize, products.length));
      }
    },
    [batchSize, products.length]
  );

  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount]
  );

  return (
    <div className="page">
      <FadeIn direction="up">
        <header className="page__header">
          <h1>Productos</h1>
        <p>
          Catálogo de equipos, reactivos e insumos para laboratorios clínicos.
        </p>
        </header>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        />
      </FadeIn>

      {loading ? (
        <Loader />
      ) : error ? (
        <FadeIn direction="up" delay={0.2}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--color-error)' }}>❌ Error al cargar productos</h3>
            <p>{error}</p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
              Verifica la consola del navegador para más detalles.
            </p>
          </div>
        </FadeIn>
      ) : (
        <FadeIn direction="up" delay={0.2}>
          <div className="products-grid-scroll" onScroll={handleGridScroll}>
            <div className="grid three">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={categoryNameById.get(product.categoryId) ?? product.familia ?? 'Sin categoría'}
                  onQuote={handleQuote}
                />
              ))}
              {products.length === 0 && (
                <p>No hay productos que coincidan con los filtros seleccionados.</p>
              )}
            </div>
          </div>
        </FadeIn>
      )}

      {quotedProduct && (
        <QuoteRequestModal product={quotedProduct} onClose={() => setQuotedProduct(null)} />
      )}
    </div>
  );
}

export default ProductsPage;
