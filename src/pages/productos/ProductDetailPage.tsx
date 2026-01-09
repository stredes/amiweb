import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { FadeIn } from '../../components/ui/FadeIn';
import { getCategories, getProductById } from '../../features/catalog/catalogApi';
import { Product, ProductCategory } from '../../features/catalog/types';
import { ROUTES } from '../../config/routes';
import QuoteRequestModal from '../../components/products/QuoteRequestModal';

// Página de detalle de producto con datos mock y modal de cotización.
function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [quotedProduct, setQuotedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!productId) return;
      setLoading(true);
      // TODO: reemplazar por fetch al backend.
      const [data, catalogCategories] = await Promise.all([
        getProductById(productId),
        getCategories()
      ]);
      setProduct(data ?? null);
      setCategories(catalogCategories);
      setLoading(false);
    };

    load();
  }, [productId]);

  const categoryName = useMemo(
    () => categories.find((c) => c.id === product?.categoryId)?.name,
    [categories, product]
  );

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="page">
        <p>Producto no encontrado.</p>
        <Link to={ROUTES.products}>Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <FadeIn direction="up">
        <Link to={ROUTES.products} className="breadcrumb">
          ← Volver al catálogo
        </Link>
      </FadeIn>
      <FadeIn direction="up" delay={0.1}>
        <header className="page__header">
        <h1>{product.name}</h1>
        <p className="muted">
          {product.code ? `Código ${product.code} · ` : ''}
          {product.brand} · {categoryName}
        </p>
        </header>
      </FadeIn>
      <FadeIn direction="up" delay={0.2}>
        <div className="grid two">
        <div className="card">
          <h3>Descripción</h3>
          <p>{product.longDescription}</p>
          <div className="specs">
            <h4>Especificaciones técnicas</h4>
            <table className="specs__table">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {product.requiresInstallation && (
              <p className="badge">Requiere instalación especializada</p>
            )}
          </div>
          <p className="muted">
            {/* TODO: cargar fichas técnicas y PDFs desde el backend. */}
            Documentos y fichas técnicas (placeholder).
          </p>
        </div>
        <div className="card">
          <div className="image-placeholder">Imagen del producto</div>
          <p className="muted">Categoría: {categoryName}</p>
          <p className="muted">Marca: {product.brand}</p>
          <div className="card__actions">
            <Button onClick={() => setQuotedProduct(product)}>Solicitar cotización</Button>
            <Button variant="secondary">Agregar a lista</Button>
          </div>
        </div>
        </div>
      </FadeIn>
      {quotedProduct && (
        <QuoteRequestModal product={quotedProduct} onClose={() => setQuotedProduct(null)} />
      )}
    </div>
  );
}

export default ProductDetailPage;
