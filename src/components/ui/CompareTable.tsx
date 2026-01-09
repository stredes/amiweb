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
        <button onClick={clearCompare} className="compare-table__clear">
          Limpiar todo
        </button>
      </div>

      <div className="compare-table">
        <table>
          <thead>
            <tr>
              <th className="compare-table__row-header">Producto</th>
              {products.map((product) => (
                <th key={product.id} className="compare-table__product-header">
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="compare-table__remove"
                    aria-label="Remove from comparison"
                  >
                    <FiX />
                  </button>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="compare-table__product-image"
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
              <td className="compare-table__row-header">Precio</td>
              {products.map((product) => (
                <td key={product.id} className="compare-table__cell compare-table__cell--price">
                  {formatPrice(product.price)}
                </td>
              ))}
            </tr>
            
            {products.some((p) => p.rating) && (
              <tr>
                <td className="compare-table__row-header">Calificación</td>
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
                <td className="compare-table__row-header">Categoría</td>
                {products.map((product) => (
                  <td key={product.id} className="compare-table__cell">
                    {product.category || '-'}
                  </td>
                ))}
              </tr>
            )}

            {Array.from(allSpecs).map((spec) => (
              <tr key={spec}>
                <td className="compare-table__row-header">{spec}</td>
                {products.map((product) => {
                  const value = product.specs?.[spec];
                  const hasValue = value !== undefined && value !== null && value !== '';
                  
                  return (
                    <td key={product.id} className="compare-table__cell">
                      {hasValue ? (
                        <span className="compare-table__spec-value">
                          <FiCheck className="compare-table__check" />
                          {value}
                        </span>
                      ) : (
                        <span className="compare-table__spec-empty">
                          <FiMinus />
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
