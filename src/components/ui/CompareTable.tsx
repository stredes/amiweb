import { FiX, FiCheck, FiMinus } from 'react-icons/fi';
import { useCompare } from '../../contexts/CompareContext';
import { Rating } from './Rating';
import './CompareTable.css';

export function CompareTable() {
  const { products, removeProduct, clearCompare } = useCompare();

  if (products.length === 0) {
    return (
      <div className="compare-empty">
        <p>No hay productos para comparar</p>
        <p className="compare-empty__hint">Agrega productos para comenzar la comparación</p>
      </div>
    );
  }

  // Collect all unique specs from all products
  const allSpecs = new Set<string>();
  products.forEach((product) => {
    if (product.specs) {
      Object.keys(product.specs).forEach((key) => allSpecs.add(key));
    }
  });

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  return (
    <div className="compare-table-wrapper">
      <div className="compare-table__header">
        <h2>Comparación de Productos ({products.length})</h2>
        <button type="button" onClick={clearCompare} className="compare-table__clear">
          Limpiar todo
        </button>
      </div>

      <div className="compare-table">
        <table>
          <thead>
            <tr>
              <th className="compare-table__row-header" scope="col">Producto</th>
              {products.map((product) => (
                <th key={product.id} className="compare-table__product-header" scope="col">
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="compare-table__remove"
                    aria-label={`Eliminar ${product.name} de la comparación`}
                  >
                    <FiX aria-hidden="true" />
                  </button>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="compare-table__product-image"
                      width={120}
                      height={120}
                      loading="lazy"
                    />
                  )}
                  <div className="compare-table__product-name">{product.name}</div>
                  {product.brand && (
                    <div className="compare-table__product-brand">{product.brand}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="compare-table__row-header" scope="row">Precio</th>
              {products.map((product) => (
                <td key={product.id} className="compare-table__cell compare-table__cell--price">
                  {formatPrice(product.price)}
                </td>
              ))}
            </tr>
            
            {products.some((p) => p.rating) && (
              <tr>
                <th className="compare-table__row-header" scope="row">Calificación</th>
                {products.map((product) => (
                  <td key={product.id} className="compare-table__cell">
                    {product.rating ? (
                      <Rating value={product.rating} readonly size="sm" showValue />
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
            )}

            {products.some((p) => p.category) && (
              <tr>
                <th className="compare-table__row-header" scope="row">Categoría</th>
                {products.map((product) => (
                  <td key={product.id} className="compare-table__cell">
                    {product.category || '-'}
                  </td>
                ))}
              </tr>
            )}

            {Array.from(allSpecs).map((spec) => (
              <tr key={spec}>
                <th className="compare-table__row-header" scope="row">{spec}</th>
                {products.map((product) => {
                  const value = product.specs?.[spec];
                  const hasValue = value !== undefined && value !== null && value !== '';
                  
                  return (
                    <td key={product.id} className="compare-table__cell">
                      {hasValue ? (
                        <span className="compare-table__spec-value">
                          <FiCheck className="compare-table__check" aria-hidden="true" />
                          {value}
                        </span>
                      ) : (
                        <span className="compare-table__spec-empty">
                          <FiMinus aria-hidden="true" />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
